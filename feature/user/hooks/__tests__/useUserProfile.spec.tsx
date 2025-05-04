import { useUser } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { ReactNode } from 'react';

import api from '@/utils/api';

import useUserProfile from '../useUserProfile';

jest.mock('@clerk/clerk-expo');
jest.mock('@/utils/api');

const mockUser = { id: '123', email: 'test@example.com' };

describe('useUserProfile', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          refetchIntervalInBackground: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          staleTime: Infinity,
          gcTime: 0,
        },
      },
    });
    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('fetches user profile when user is present', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockResolvedValue({ data: { id: '123', name: 'Test User' } });

    const { result } = renderHook(() => useUserProfile({ refetchInterval: false }), {
      wrapper: wrapper as any,
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual({ id: '123', name: 'Test User' });
      },
      {
        timeout: 5000,
      }
    );

    expect(api.get).toHaveBeenCalledWith('/user/me');
  });

  it('does not fetch user profile when user is not present', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });
    const { result } = renderHook(() => useUserProfile(), { wrapper: wrapper as any });
    expect(result.current.isLoading).toBe(false);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockRejectedValue(new Error('API error'));
    const { result } = renderHook(() => useUserProfile({ retry: false }), {
      wrapper: wrapper as any,
    });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });
});
