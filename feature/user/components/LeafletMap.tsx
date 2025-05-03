import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import useBins from '@/feature/bins/hooks/useBins';
import useBinsWithDistance from '@/feature/bins/hooks/useBinsWithDistance';
import useCreateBin from '@/feature/bins/hooks/useCreateBin';
import useMarkInvalidBin from '@/feature/bins/hooks/useMarkInvalidBin';
import useNearestBin from '@/feature/bins/hooks/useNearestBin';
import { Bin } from '@/feature/bins/types';
import createLeafletHtml from '@/feature/map/utils/createLeafletHtml';

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
  const [mapLoaded, setMapLoaded] = useState(false);
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

  const leafletHtml = useRef<string>();
  const [htmlReady, setHtmlReady] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mapSelectedBins, setMapSelectedBins] = useState<Bin['id'][]>([]);

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
    console.log(`bin id ${binId} marked as invalid`);
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

  useEffect(() => {
    if (isBinCreated) {
      setContextMenuPos(null);
      setSelectedPos(null);
      setMapSelectedBins([]);

      if (mapViewRef.current) {
        const injectedJs = /*js*/ `
          if (window.clearSelectedPos) {
            window.clearSelectedPos();
          }
        `;

        mapViewRef.current.injectJavaScript(injectedJs);
      }
    }
  }, [isBinCreated]);

  useEffect(() => {
    if (isBinMarkedInvalid) {
      setContextMenuPos(null);
      setSelectedPos(null);
      setMapSelectedBins([]);

      if (mapViewRef.current) {
        const injectedJs = /*js*/ `
          if (window.clearSelectedPos) {
            window.clearSelectedPos();
          }
        `;

        mapViewRef.current.injectJavaScript(injectedJs);
      }
    }
  }, [isBinMarkedInvalid]);

  useEffect(() => {
    if (mapViewRef.current) {
      const injectedJs = /*js*/ `
        if (window.updateMapPosition) {
          window.updateMapPosition(${latitude}, ${longitude});
        }
      `;

      mapViewRef.current.injectJavaScript(injectedJs);
    }

    if (latitude && longitude && !leafletHtml.current) {
      const html = createLeafletHtml(latitude, longitude);
      leafletHtml.current = html;
      setHtmlReady(true);
    }
  }, [setHtmlReady, latitude, longitude]);

  useEffect(() => {
    if (mapLoaded && mapViewRef.current) {
      const injectedJs = /*js*/ `
        if (window.updateBins) {
          window.updateBins(${JSON.stringify(binsWithDistance)});
        }
      `;

      mapViewRef.current.injectJavaScript(injectedJs);
    }
  }, [mapLoaded, binsWithDistance]);

  useEffect(() => {
    if (mapLoaded && nearestBin && mapViewRef.current) {
      const injectedJs = /*js*/ `
        if (window.markClosestBin) {
          window.markClosestBin(${nearestBin.id});
        }
      `;
      mapViewRef.current.injectJavaScript(injectedJs);
    }
  }, [mapLoaded, nearestBin]);

  if (!latitude || !longitude) {
    return <Text>Map is not available</Text>;
  }

  return (
    <Pressable onPress={() => setContextMenuPos(null)} style={styles.container}>
      <View style={styles.container}>
        {!htmlReady ? (
          <Text>Loading map...</Text>
        ) : (
          <WebView
            source={{ html: leafletHtml.current as string }}
            style={styles.webview}
            javaScriptEnabled
            ref={mapViewRef}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'maploaded') {
                  setMapLoaded(true);
                } else if (data.type === 'log') {
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
            }}
            webviewDebuggingEnabled
          />
        )}
        <MapContextMenu
          screenX={contextMenuPos?.x}
          screenY={contextMenuPos?.y}
          isOpen={!!contextMenuPos}
          onCreateBin={handleCreateBin}
          disabled={isCreatingBin || isMarkingBinInvalid || !selectedPos}
          selectedBinIds={mapSelectedBins}
          onMarkInvalidBin={handleMarkInvalidBin}
        />
        <BinsList bins={binsWithDistance} />
        <OffsetControls />
        <NearestBinInformation nearestBin={nearestBin} direction={nearestBinDirection} />
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
