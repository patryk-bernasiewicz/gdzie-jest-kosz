import { useUser } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Provider } from 'jotai';

import api from '@/utils/api';

import useUserProfile from '../useUserProfile';

jest.mock('@clerk/clerk-expo');
jest.mock('@/utils/api');

const mockUser = { id: '123', email: 'test@example.com' };

const queryClient = new QueryClient({
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
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </Provider>
);

describe('useUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('fetches user profile when user is present', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockResolvedValue({ data: { id: '123', name: 'Test User' } });

    const { result } = renderHook(() => useUserProfile(), { wrapper: wrapper as any });
    await act(async () => {
      await waitFor(() => result.current.isSuccess && result.current.data !== undefined, {
        timeout: 3000,
      });
    });
    expect(api.get).toHaveBeenCalledWith('/user/me');
    expect(result.current.data).toEqual({ id: '123', name: 'Test User' });
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
    await act(async () => {
      await waitFor(() => result.current.isError && result.current.error !== undefined);
    });
    expect(result.current.error).toBeDefined();
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });
});
