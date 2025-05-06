import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as LocationService from 'expo-location';
import React from 'react';
import Toast from 'react-native-toast-message';

import useLocation from '../useLocation';
import { useLocationOffsetStore } from '../useLocation';

jest.mock('expo-location');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const offsetMove = 20 / 111_111;

describe('useLocation', () => {
  let queryClient: import('@tanstack/react-query').QueryClient;
  let QueryClientProvider: typeof import('@tanstack/react-query').QueryClientProvider;
  let wrapperWithQuery: ({ children }: { children: React.ReactNode }) => React.ReactElement;

  const initialStoreState = useLocationOffsetStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useLocationOffsetStore.setState(initialStoreState, true);

    ({ QueryClientProvider } = require('@tanstack/react-query'));
    queryClient = new (require('@tanstack/react-query').QueryClient)();
    wrapperWithQuery = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (LocationService.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (LocationService.watchPositionAsync as jest.Mock).mockImplementation(() => ({
      remove: jest.fn(),
    }));
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
  });

  it('should request location permission and set location if granted', async () => {
    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.location).toEqual([1, 2]));

    expect(result.current.isLoading).toBe(false);
  });

  it('should show error toast if permission is denied', async () => {
    (LocationService.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });
    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', text1: 'Brak dostępu do lokalizacji.' })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.location).toBeNull();
  });

  it('should show error toast if location cannot be established', async () => {
    (LocationService.getCurrentPositionAsync as jest.Mock).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', text1: 'Błąd lokalizacji' })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.location).toBeNull();
  });

  it('should move offset north, south, east, and west and update location accordingly', async () => {
    const { result } = renderHook(() => useLocation(), { wrapper: wrapperWithQuery as any });

    await waitFor(() => expect(result.current.location).toEqual([1, 2]));
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.moveOffsetNorth();
    });
    await waitFor(() => expect(result.current.location).toEqual([1 + offsetMove, 2]));

    act(() => {
      result.current.moveOffsetSouth();
    });
    await waitFor(() => expect(result.current.location).toEqual([1, 2]));

    act(() => {
      result.current.moveOffsetEast();
    });
    await waitFor(() => expect(result.current.location).toEqual([1, 2 + offsetMove]));

    act(() => {
      result.current.moveOffsetWest();
    });
    await waitFor(() => expect(result.current.location).toEqual([1, 2]));

    act(() => {
      result.current.resetOffset();
    });
    await waitFor(() => expect(result.current.location).toEqual([1, 2]));
  });
});
