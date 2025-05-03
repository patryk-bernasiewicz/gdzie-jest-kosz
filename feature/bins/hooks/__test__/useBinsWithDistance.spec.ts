import { renderHook } from '@testing-library/react-native';

import useLocation from '../../../map/hooks/useLocation';
import { Bin } from '../../types';
import useBinsWithDistance from '../useBinsWithDistance';

// Mock useLocation (correct path)
jest.mock('../../../map/hooks/useLocation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

function mockUseLocation({
  location = null,
  isLoading = false,
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
    moveOffsetNorth: jest.fn(),
    moveOffsetSouth: jest.fn(),
    moveOffsetEast: jest.fn(),
    moveOffsetWest: jest.fn(),
    resetOffset: jest.fn(),
  });
}

describe('useBinsWithDistance', () => {
  it('returns null if location is not available', () => {
    mockUseLocation({ location: null });
    const { result } = renderHook(() => useBinsWithDistance([]));
    expect(result.current).toBeNull();
  });

  it('returns an empty array if bins is empty and location is available', () => {
    mockUseLocation({ location: [52.1, 21.0] });
    const { result } = renderHook(() => useBinsWithDistance([]));
    expect(result.current).toEqual([]);
  });

  it('calculates distance if bin is close enough', () => {
    mockUseLocation({ location: [52.1, 21.0] });
    const bins: Bin[] = [
      { id: 1, latitude: 52.1005, longitude: 21.0005 } as Bin,
      { id: 2, latitude: 53.0, longitude: 22.0 } as Bin,
    ];
    const { result } = renderHook(() => useBinsWithDistance(bins));
    expect(result.current).toHaveLength(2);
    expect(result.current?.[0].distance).not.toBeNull();
    expect(result.current?.[1].distance).toBeNull();
  });

  it('handles null bins correctly', () => {
    mockUseLocation({ location: [52.1, 21.0] });
    const { result } = renderHook(() => useBinsWithDistance(undefined));
    expect(result.current).toEqual([]);
  });

  it('applies location offset to distance calculation', () => {
    // User is at [52.1, 21.0], offset moves them north by 0.001
    mockUseLocation({ location: [52.101, 21.0] });
    const bins: Bin[] = [{ id: 1, latitude: 52.1005, longitude: 21.0 } as Bin];
    const { result } = renderHook(() => useBinsWithDistance(bins));
    // The distance should be small but not zero
    expect(result.current?.[0].distance).toBeGreaterThan(0);
  });

  it('returns null distance for bins with missing coordinates', () => {
    mockUseLocation({ location: [52.1, 21.0] });
    const bins: Bin[] = [
      { id: 1, latitude: undefined as any, longitude: 21.0 } as Bin,
      { id: 2, latitude: 52.1, longitude: undefined as any } as Bin,
    ];
    const { result } = renderHook(() => useBinsWithDistance(bins));
    expect(result.current?.[0].distance).toBeNull();
    expect(result.current?.[1].distance).toBeNull();
  });

  it('returns zero distance for bin at user location', () => {
    mockUseLocation({ location: [52.1, 21.0] });
    const bins: Bin[] = [{ id: 1, latitude: 52.1, longitude: 21.0 } as Bin];
    const { result } = renderHook(() => useBinsWithDistance(bins));
    expect(result.current?.[0].distance).toBe(0);
  });
});
