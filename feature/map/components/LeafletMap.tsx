import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import useBins from '@/feature/bins/hooks/useBins';
import useBinsWithDistance from '@/feature/bins/hooks/useBinsWithDistance';
import useCreateBin from '@/feature/bins/hooks/useCreateBin';
import useMarkInvalidBin from '@/feature/bins/hooks/useMarkInvalidBin';
import useNearestBin from '@/feature/bins/hooks/useNearestBin';
import { Bin } from '@/feature/bins/types';
import DebugOnly from '@/ui/components/debug/DebugOnly';

import useBinCreatedEffect from '../hooks/useBinCreatedEffect';
import useBinMarkedInvalidEffect from '../hooks/useBinMarkedInvalidEffect';
import useCreateLeafletHtml from '../hooks/useCreateLeafletHtml';
import useInjectBins from '../hooks/useInjectBins';
import useInjectMapPosition from '../hooks/useInjectMapPosition';
import useMarkClosestBin from '../hooks/useMarkClosestBin';
import MapContextMenu from './MapContextMenu';
import NearestBinInformation from './NearestBinInformation';
import BinsList from './debug/BinsList';
import OffsetControls from './debug/OffsetControls';

type LeafletMapProps = {
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number;
};

const logsDisabled = false;

export default function LeafletMap({ latitude, longitude }: LeafletMapProps) {
  const mapViewRef = useRef<WebView>(null);
  const bins = useBins();

  const binsWithDistance = useBinsWithDistance(bins.data);
  const { nearestBin, nearestBinDirection } = useNearestBin(binsWithDistance);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const {
    mutate: mutateCreateBin,
    isPending: isCreatingBin,
    isSuccess: isBinCreated,
  } = useCreateBin();
  const {
    mutate: markInvalidBin,
    isPending: isMarkingBinInvalid,
    isSuccess: isBinMarkedInvalid,
  } = useMarkInvalidBin();

  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mapSelectedBins, setMapSelectedBins] = useState<Bin['id'][]>([]);

  const leafletHtml = useCreateLeafletHtml(latitude, longitude);

  // Hooks communicating with the WebView using injected JS
  useInjectBins(mapViewRef, !!leafletHtml);
  useMarkClosestBin(mapViewRef, !!leafletHtml);
  useInjectMapPosition(mapViewRef, latitude, longitude);

  // Hooks to handle user interactions with the map
  useBinCreatedEffect(mapViewRef, isBinCreated, () => {
    setContextMenuPos(null);
    setSelectedPos(null);
    setMapSelectedBins([]);
  });
  useBinMarkedInvalidEffect(mapViewRef, isBinMarkedInvalid, () => {
    setContextMenuPos(null);
    setSelectedPos(null);
    setMapSelectedBins([]);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logWebViewMessage = (...messages: any[]) => {
    if (!logsDisabled) {
      console.log('WebView message: ', ...messages);
    }
  };

  const handleCreateBin = () => {
    if (isCreatingBin || !selectedPos) return;
    mutateCreateBin(selectedPos);
  };

  const handleConfirmInvalidBin = (binId: number) => {
    if (isMarkingBinInvalid) return;
    markInvalidBin(binId);
  };

  const handleMarkInvalidBin = (binId: number) => {
    Alert.alert('Potwierdź akcję', `Czy chcesz oznaczyć kosz ID: ${binId} jako nieaktualny?`, [
      {
        text: 'Tak',
        onPress: () => handleConfirmInvalidBin(binId),
      },
      {
        text: 'Nie',
        style: 'cancel',
      },
    ]);
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'log') {
        logWebViewMessage('event in WebView: ', data.message);
      } else if (data.type === 'contextmenu') {
        setContextMenuPos(data.screenPos);
        setSelectedPos([data.latlng.lat, data.latlng.lng]);
        if (data.selectedBins) {
          setMapSelectedBins(data.selectedBins);
        }
      }
      logWebViewMessage('event in WebView: ', data);
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
  };

  if (!latitude || !longitude || !leafletHtml) {
    return (
      <>
        <Text>Map is not available</Text>
        <DebugOnly>
          <Text>latitude: {latitude}</Text>
          <Text>longitude: {longitude}</Text>
          <Text>isHtmlReady: {leafletHtml ? 'true' : 'false'}</Text>
        </DebugOnly>
      </>
    );
  }

  return (
    <Pressable onPress={() => setContextMenuPos(null)} style={styles.container}>
      <View style={styles.container}>
        <WebView
          source={{ html: leafletHtml }}
          style={styles.webview}
          javaScriptEnabled
          ref={mapViewRef}
          onMessage={handleWebViewMessage}
          webviewDebuggingEnabled
        />
        <MapContextMenu
          screenX={contextMenuPos?.x}
          screenY={contextMenuPos?.y}
          isOpen={!!contextMenuPos}
          onCreateBin={handleCreateBin}
          disabled={isCreatingBin || isMarkingBinInvalid || !selectedPos}
          selectedBinIds={mapSelectedBins}
          onMarkInvalidBin={handleMarkInvalidBin}
        />
        <NearestBinInformation nearestBin={nearestBin} direction={nearestBinDirection} />
        <DebugOnly>
          <BinsList bins={binsWithDistance} />
          <OffsetControls />
        </DebugOnly>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
});
