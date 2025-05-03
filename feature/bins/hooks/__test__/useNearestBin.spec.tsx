import useLocation from '../../../map/hooks/useLocation';
import useNearestBin from '../useNearestBin';
import { renderHook } from '@testing-library/react-native';

import getNearestBin from '@/lib/getNearestBin';
import { BinWithDistance } from '@/types/BinWithDistance';

// Mock useLocation
jest.mock('../useLocation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock getNearestBin
jest.mock('@/lib/getNearestBin', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useNearestBin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockLocation(location: [number, number] | null) {
    (useLocation as jest.Mock).mockReturnValue({ location });
  }

  it('returns nulls if location is not available', () => {
    mockLocation(null);
    const { result } = renderHook(() => useNearestBin([]));
    expect(result.current).toEqual({
      nearestBin: null,
      nearestBinDirection: null,
    });
  });

  it('returns nulls if bins array is empty', () => {
    mockLocation([52.1, 21.0]);
    const { result } = renderHook(() => useNearestBin([]));
    expect(result.current).toEqual({
      nearestBin: null,
      nearestBinDirection: null,
    });
  });

  it('returns nulls if bins is undefined', () => {
    mockLocation([52.1, 21.0]);
    const { result } = renderHook(() => useNearestBin(undefined));
    expect(result.current).toEqual({
      nearestBin: null,
      nearestBinDirection: null,
    });
  });

  it('returns the nearest bin and direction if location and bins are available', () => {
    mockLocation([52.1, 21.0]);
    const bins = [
      {
        id: 1,
        latitude: 52.1005,
        longitude: 21.0005,
        distance: 10,
        type: 'bin' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        latitude: 53.0,
        longitude: 22.0,
        distance: null,
        type: 'bin' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    (getNearestBin as jest.Mock).mockReturnValue(bins[0]);
    const { result } = renderHook(() => useNearestBin(bins));
    expect(result.current).toEqual({
      nearestBin: bins[0],
      nearestBinDirection: 'northeast', // 52.1005 > 52.1, 21.0005 > 21.0
    });
    expect(getNearestBin).toHaveBeenCalledWith(bins, 52.1, 21.0);
  });

  it('returns null direction if nearestBin is null', () => {
    mockLocation([52.1, 21.0]);
    const bins = [
      {
        id: 1,
        latitude: 52.1005,
        longitude: 21.0005,
        distance: 10,
        type: 'bin' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    (getNearestBin as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useNearestBin(bins));
    expect(result.current).toEqual({
      nearestBin: null,
      nearestBinDirection: null,
    });
  });

  it('returns correct direction for various positions', () => {
    mockLocation([52.1, 21.0]);
    const baseBin = {
      id: 1,
      distance: 10,
      type: 'bin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const testCases = [
      {
        bin: { ...baseBin, latitude: 52.1, longitude: 21.0 },
        expected: 'here',
      },
      {
        bin: { ...baseBin, latitude: 52.2, longitude: 21.0 },
        expected: 'north',
      },
      {
        bin: { ...baseBin, latitude: 52.0, longitude: 21.0 },
        expected: 'south',
      },
      {
        bin: { ...baseBin, latitude: 52.1, longitude: 22.0 },
        expected: 'east',
      },
      {
        bin: { ...baseBin, latitude: 52.1, longitude: 20.0 },
        expected: 'west',
      },
      {
        bin: { ...baseBin, latitude: 52.2, longitude: 22.0 },
        expected: 'northeast',
      },
      {
        bin: { ...baseBin, latitude: 52.2, longitude: 20.0 },
        expected: 'northwest',
      },
      {
        bin: { ...baseBin, latitude: 52.0, longitude: 22.0 },
        expected: 'southeast',
      },
      {
        bin: { ...baseBin, latitude: 52.0, longitude: 20.0 },
        expected: 'southwest',
      },
    ];
    for (const { bin, expected } of testCases) {
      (getNearestBin as jest.Mock).mockReturnValue(bin);
      const { result } = renderHook(() => useNearestBin([bin]));
      expect(result.current.nearestBinDirection).toBe(expected);
    }
  });
});
