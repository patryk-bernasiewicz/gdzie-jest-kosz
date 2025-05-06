import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import api from '@/utils/api';

import useLocation from '../../../map/hooks/useLocation';
import useBins from '../useBins';

// Mock useLocation (correct path)
jest.mock('../../../map/hooks/useLocation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the entire api module (axios instance)
jest.mock('@/utils/api');

// Cast the imported api to its mocked type for type safety in tests
const mockedApi = api as jest.Mocked<typeof api>;

// Helper to mock useLocation's new return type
function mockUseLocation({
  location = null,
  isLoading = false,
  moveOffsetNorth = jest.fn(),
  moveOffsetSouth = jest.fn(),
  moveOffsetEast = jest.fn(),
  moveOffsetWest = jest.fn(),
  resetOffset = jest.fn(),
}: {
  location?: [number, number] | null;
  isLoading?: boolean;
  moveOffsetNorth?: () => void;
  moveOffsetSouth?: () => void;
  moveOffsetEast?: () => void;
  moveOffsetWest?: () => void;
  resetOffset?: () => void;
} = {}) {
  (useLocation as jest.Mock).mockReturnValue({
    location,
    isLoading,
    moveOffsetNorth,
    moveOffsetSouth,
    moveOffsetEast,
    moveOffsetWest,
    resetOffset,
  });
}

describe('useBins', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => React.ReactElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.get.mockReset();

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
  });

  it('does not fetch bins if location is not available', async () => {
    mockUseLocation({ location: null });

    const { result } = renderHook(() => useBins(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(mockedApi.get).not.toHaveBeenCalled();
  });

  it('fetches bins if location is available', async () => {
    mockUseLocation({ location: [52.1, 21.0] });

    mockedApi.get.mockResolvedValueOnce({
      data: [{ id: 1, latitude: 52.1, longitude: 21.0 }],
    });

    const { result } = renderHook(() => useBins(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual([{ id: 1, latitude: 52.1, longitude: 21.0 }]);
    });
    expect(mockedApi.get).toHaveBeenCalledWith(
      expect.stringContaining(`/bins/?latitude=52.1&longitude=21`)
    );
  });

  it('handles fetch errors gracefully', async () => {
    mockUseLocation({ location: [52.1, 21.0] });

    mockedApi.get.mockRejectedValueOnce(new Error('Network response was not ok'));

    const { result } = renderHook(() => useBins(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe('Network response was not ok');
      },
      { timeout: 5000 }
    );
  });

  it('does not fetch if binsUrl is null', async () => {
    mockUseLocation({ location: null });

    const { result } = renderHook(() => useBins(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(mockedApi.get).not.toHaveBeenCalled();
  });

  it('returns isLoading from useLocation', () => {
    mockUseLocation({ location: [52.1, 21.0], isLoading: true });
    const { location, isLoading } = useLocation();
    expect(location).toEqual([52.1, 21.0]);
    expect(isLoading).toBe(true);
  });

  it('calls offset control functions', () => {
    const moveOffsetNorth = jest.fn();
    const moveOffsetSouth = jest.fn();
    const moveOffsetEast = jest.fn();
    const moveOffsetWest = jest.fn();
    const resetOffset = jest.fn();
    mockUseLocation({
      location: [52.1, 21.0],
      moveOffsetNorth,
      moveOffsetSouth,
      moveOffsetEast,
      moveOffsetWest,
      resetOffset,
    });
    const {
      moveOffsetNorth: north,
      moveOffsetSouth: south,
      moveOffsetEast: east,
      moveOffsetWest: west,
      resetOffset: reset,
    } = useLocation();
    north();
    south();
    east();
    west();
    reset();
    expect(moveOffsetNorth).toHaveBeenCalled();
    expect(moveOffsetSouth).toHaveBeenCalled();
    expect(moveOffsetEast).toHaveBeenCalled();
    expect(moveOffsetWest).toHaveBeenCalled();
    expect(resetOffset).toHaveBeenCalled();
  });
});
