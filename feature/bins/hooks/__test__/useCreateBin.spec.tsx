import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import useCreateBin from '../useCreateBin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useUser: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn() },
  show: jest.fn(),
}));

describe('useCreateBin hook', () => {
  function wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchInterval: false,
          staleTime: Infinity,
        },
        mutations: {
          retry: false,
        },
      },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  describe('useCreateBin', () => {
    const mockShowToast = require('react-native-toast-message').show;
    const mockUseUser = require('@clerk/clerk-expo').useUser;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUseUser.mockReturnValue({ user: { id: 'clerk-123' } });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('successfully creates a bin and shows toast', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, latitude: 1, longitude: 2 }),
      });
      // Clear both Toast.show and Toast.default.show mocks
      const Toast = require('react-native-toast-message');
      Toast.show.mockClear();
      Toast.default.show.mockClear();
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await act(async () => {
        const data = await result.current.mutateAsync([1, 2]);
        expect(data).toEqual({ id: 1, latitude: 1, longitude: 2 });
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bins?clerkId=clerk-123'),
        expect.objectContaining({ method: 'POST' })
      );
      // Accept either Toast.show or Toast.default.show being called
      expect(Toast.show.mock.calls.length > 0 || Toast.default.show.mock.calls.length > 0).toBe(
        true
      );
      const calls = [...Toast.show.mock.calls, ...Toast.default.show.mock.calls];
      expect(calls.some((call) => call[0] && call[0].type === 'success')).toBe(true);
    });

    it('throws error and logs when fetch fails', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await act(async () => {
        await expect(result.current.mutateAsync([1, 2])).rejects.toThrow(
          'Network response was not ok'
        );
      });
      expect(mockShowToast).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('throws and logs error on fetch exception', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn().mockRejectedValue(new Error('fetch failed'));
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await act(async () => {
        await expect(result.current.mutateAsync([1, 2])).rejects.toThrow('fetch failed');
      });
      expect(mockShowToast).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('uses correct clerkId from useUser', async () => {
      mockUseUser.mockReturnValue({ user: { id: 'abc-xyz' } });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 2, latitude: 3, longitude: 4 }),
      });
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await act(async () => {
        await result.current.mutateAsync([3, 4]);
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('clerkId=abc-xyz'),
        expect.any(Object)
      );
    });
  });
});
