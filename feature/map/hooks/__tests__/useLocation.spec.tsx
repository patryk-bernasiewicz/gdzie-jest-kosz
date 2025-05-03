import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as LocationService from 'expo-location';
import { Provider } from 'jotai';
import Toast from 'react-native-toast-message';

import locationOffsetAtom from '../../store/locationOffset.atom';
import useLocation from '../useLocation';

jest.mock('expo-location');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockSetAtom = jest.fn();

// Helper to wrap hook with Jotai Provider
const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request location permission and set location if granted', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (LocationService.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (LocationService.watchPositionAsync as jest.Mock).mockResolvedValue({ remove: jest.fn() });

    const { result } = renderHook(() => useLocation(), { wrapper: wrapper as any });
    await act(async () => {
      await waitFor(() => !result.current.isLoading);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.location).toEqual([1, 2]);
  });

  it('should show error toast if permission is denied', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });
    const { result } = renderHook(() => useLocation(), { wrapper: wrapper as any });
    await act(async () => {
      await waitFor(() => !result.current.isLoading);
    });
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', text1: expect.any(String) })
    );
    expect(result.current.isLoading).toBe(false);
  });

  it('should show error toast if location cannot be established', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (LocationService.getCurrentPositionAsync as jest.Mock).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useLocation(), { wrapper: wrapper as any });
    await act(async () => {
      await waitFor(() => !result.current.isLoading);
    });
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', text1: expect.any(String) })
    );
    expect(result.current.isLoading).toBe(false);
  });

  it('should move offset north, south, east, and west', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (LocationService.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (LocationService.watchPositionAsync as jest.Mock).mockResolvedValue({ remove: jest.fn() });

    const { result } = renderHook(() => useLocation(), { wrapper: wrapper as any });
    await waitFor(() => !result.current.isLoading);
    act(() => {
      result.current.moveOffsetNorth();
      result.current.moveOffsetSouth();
      result.current.moveOffsetEast();
      result.current.moveOffsetWest();
      result.current.resetOffset();
    });
    // No assertion here, but ensures no errors are thrown
  });
});
