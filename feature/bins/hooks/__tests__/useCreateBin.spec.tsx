import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import Toast from 'react-native-toast-message';

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
  let toastShowSpy: jest.SpyInstance;

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
    const mockClerkUseUser = require('@clerk/clerk-expo').useUser;

    beforeEach(() => {
      jest.clearAllMocks();
      mockClerkUseUser.mockReturnValue({ user: { id: 'clerk-123' } });

      toastShowSpy = jest.spyOn(Toast, 'show');
      toastShowSpy.mockClear();
    });

    afterEach(async () => {
      if (queryClient) {
        await queryClient.cancelQueries();
        queryClient.clear();
      }
      toastShowSpy.mockRestore();
    });

    it('successfully creates a bin and shows toast', async () => {
      const mockBinData = { id: 1, latitude: 1, longitude: 2 };
      (api.post as jest.Mock).mockResolvedValue({ data: mockBinData });

      const { result } = renderHook(() => useCreateBin(), { wrapper });

      const data = await result.current.mutateAsync([1, 2]);

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith({
          type: 'success',
          text1: 'Kosz został dodany',
          text2: 'Twój kosz pokaże się po zaakceptowaniu przed administratora.',
        });
      });

      expect(data).toEqual(mockBinData);
      expect(api.post).toHaveBeenCalledWith('/bins', { latitude: 1, longitude: 2 });
    });

    it('throws error and logs when post fails', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (api.post as jest.Mock).mockRejectedValue(new Error('Network response was not ok'));
      const { result } = renderHook(() => useCreateBin(), { wrapper });

      await expect(result.current.mutateAsync([1, 2])).rejects.toThrow(
        'Network response was not ok'
      );

      await waitFor(() => {
        expect(Toast.show).not.toHaveBeenCalled();
      });
      expect(errorSpy).toHaveBeenCalledWith('Error creating bin:', expect.any(Error));
      errorSpy.mockRestore();
    });

    it('throws and logs error on post exception', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (api.post as jest.Mock).mockRejectedValue(new Error('fetch failed'));
      const { result } = renderHook(() => useCreateBin(), { wrapper });

      await expect(result.current.mutateAsync([1, 2])).rejects.toThrow('fetch failed');

      await waitFor(() => {
        expect(Toast.show).not.toHaveBeenCalled();
      });
      expect(errorSpy).toHaveBeenCalledWith('Error creating bin:', expect.any(Error));
      errorSpy.mockRestore();
    });

    it('uses correct clerkId from useUser', async () => {
      mockClerkUseUser.mockReturnValue({ user: { id: 'abc-xyz' } });
      const mockBinData = { id: 2, latitude: 3, longitude: 4 };
      (api.post as jest.Mock).mockResolvedValue({ data: mockBinData });
      const { result } = renderHook(() => useCreateBin(), { wrapper });

      await result.current.mutateAsync([3, 4]);

      expect(api.post).toHaveBeenCalledWith('/bins', { latitude: 3, longitude: 4 });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
      });
    });
  });
});
