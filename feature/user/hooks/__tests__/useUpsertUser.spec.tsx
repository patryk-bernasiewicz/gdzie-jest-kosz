import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import useUpsertUser from '../useUpsertUser';

const mockUser = { id: '123', email: 'test@example.com' };
const mockFetch = jest.fn();

global.fetch = mockFetch;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      gcTime: 0,
    },
    mutations: {
      retry: false,
      gcTime: 0,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUpsertUser', () => {
  afterAll(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    mockFetch.mockReset();
  });

  it('successfully upserts user', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });
    const { result } = renderHook(() => useUpsertUser(), { wrapper: wrapper as any });
    act(() => {
      result.current.mutate('session-123');
    });
    await act(async () => {
      await waitFor(() => result.current.isSuccess && result.current.data !== undefined);
    });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/validate-session'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 'session-123' }),
      })
    );
    expect(result.current.data).toEqual(mockUser);
  });

  it('handles network error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const { result } = renderHook(() => useUpsertUser(), { wrapper: wrapper as any });
    act(() => {
      result.current.mutate('session-err');
    });
    await act(async () => {
      await waitFor(() => result.current.isError && result.current.error !== undefined);
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('handles fetch exception', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fetch failed'));
    const { result } = renderHook(() => useUpsertUser(), { wrapper: wrapper as any });
    act(() => {
      result.current.mutate('session-exc');
    });
    await act(async () => {
      await waitFor(() => result.current.isError && result.current.error !== undefined);
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
