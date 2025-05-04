import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as LocationService from 'expo-location';
import { Provider } from 'jotai';
import Toast from 'react-native-toast-message';

import useLocation from '../useLocation';

jest.mock('expo-location');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

describe('useLocation', () => {
  let queryClient: import('@tanstack/react-query').QueryClient;
  let QueryClientProvider: typeof import('@tanstack/react-query').QueryClientProvider;
  let wrapperWithQuery: ({ children }: { children: React.ReactNode }) => JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ QueryClientProvider } = require('@tanstack/react-query'));
    queryClient = new (require('@tanstack/react-query').QueryClient)();
    wrapperWithQuery = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <Provider>{children}</Provider>
      </QueryClientProvider>
    );
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
  });

  it('should request location permission and set location if granted', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (LocationService.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (LocationService.watchPositionAsync as jest.Mock).mockResolvedValue({ remove: jest.fn() });

    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.location).toEqual([1, 2]);
  });

  it('should show error toast if permission is denied', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });
    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
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
    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
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

    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    result.current.moveOffsetNorth();
    result.current.moveOffsetSouth();
    result.current.moveOffsetEast();
    result.current.moveOffsetWest();
    result.current.resetOffset();
    // No assertion here, but ensures no errors are thrown
  });
});
