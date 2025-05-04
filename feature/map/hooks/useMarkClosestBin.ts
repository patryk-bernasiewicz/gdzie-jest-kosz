import { RefObject, useEffect, useRef } from 'react';
import WebView from 'react-native-webview';

import useBins from '@/feature/bins/hooks/useBins';
import useBinsWithDistance from '@/feature/bins/hooks/useBinsWithDistance';
import useNearestBin from '@/feature/bins/hooks/useNearestBin';

export default function useMarkClosestBin(
  mapViewRef: RefObject<WebView | null>,
  isHtmlReady?: boolean | null
): void {
  const bins = useBins();
  const binsWithDistance = useBinsWithDistance(bins.data);
  const { nearestBin } = useNearestBin(binsWithDistance);
  const prevNearestBinId = useRef<number | null>(null);

  useEffect(() => {
    if (
      !isHtmlReady ||
      !nearestBin ||
      nearestBin.id === prevNearestBinId.current ||
      !mapViewRef.current
    ) {
      prevNearestBinId.current = null;
      return;
    }

    const injectedJs = /*js*/ `
      if (window.markClosestBin) {
        window.markClosestBin(${nearestBin.id});
      }
    `;
    mapViewRef.current.injectJavaScript(injectedJs);
    prevNearestBinId.current = nearestBin.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHtmlReady, nearestBin]);
}
