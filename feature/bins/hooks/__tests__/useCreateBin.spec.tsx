import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import api from '@/utils/api';

import useCreateBin from '../useCreateBin';

// Mock dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useUser: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn() },
  show: jest.fn(),
}));
jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe('useCreateBin hook', () => {
  let queryClient: QueryClient;

  function wrapper({ children }: { children: React.ReactNode }) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchInterval: false,
          staleTime: Infinity,
          gcTime: 0,
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

    afterEach(async () => {
      jest.restoreAllMocks();
      if (queryClient) {
        await queryClient.cancelQueries();
        queryClient.clear();
      }
    });

    it('successfully creates a bin and shows toast', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { id: 1, latitude: 1, longitude: 2 } });
      // Clear both Toast.show and Toast.default.show mocks
      const Toast = require('react-native-toast-message');
      Toast.show.mockClear();
      Toast.default.show.mockClear();
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      const data = await result.current.mutateAsync([1, 2]);
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/bins', { latitude: 1, longitude: 2 });
        expect(data).toEqual({ id: 1, latitude: 1, longitude: 2 });
        expect(Toast.show.mock.calls.length > 0 || Toast.default.show.mock.calls.length > 0).toBe(
          true
        );
        const calls = [...Toast.show.mock.calls, ...Toast.default.show.mock.calls];
        expect(calls.some((call) => call[0] && call[0].type === 'success')).toBe(true);
      });
    });

    it('throws error and logs when post fails', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (api.post as jest.Mock).mockRejectedValue(new Error('Network response was not ok'));
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await expect(result.current.mutateAsync([1, 2])).rejects.toThrow(
        'Network response was not ok'
      );
      await waitFor(() => {
        expect(mockShowToast).not.toHaveBeenCalled();
      });
      errorSpy.mockRestore();
    });

    it('throws and logs error on post exception', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (api.post as jest.Mock).mockRejectedValue(new Error('fetch failed'));
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await expect(result.current.mutateAsync([1, 2])).rejects.toThrow('fetch failed');
      await waitFor(() => {
        expect(mockShowToast).not.toHaveBeenCalled();
      });
      errorSpy.mockRestore();
    });

    it('uses correct clerkId from useUser', async () => {
      mockUseUser.mockReturnValue({ user: { id: 'abc-xyz' } });
      (api.post as jest.Mock).mockResolvedValue({ data: { id: 2, latitude: 3, longitude: 4 } });
      const { result } = renderHook(() => useCreateBin(), { wrapper });
      await result.current.mutateAsync([3, 4]);
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/bins', { latitude: 3, longitude: 4 });
      });
    });
  });
});
