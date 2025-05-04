import { RefObject, useEffect } from 'react';
import WebView from 'react-native-webview';

import useBins from '@/feature/bins/hooks/useBins';
import useBinsWithDistance from '@/feature/bins/hooks/useBinsWithDistance';

/**
 * Custom hook that injects JavaScript into a WebView when the bins data is updated
 * @param mapViewRef - reference to the WebView component
 * @param isHtmlReady - boolean indicating whether the HTML is ready
 * @return {void}
 */
export default function useInjectBins(
  mapViewRef: RefObject<WebView | null>,
  isHtmlReady?: boolean | null
): void {
  const bins = useBins();
  const binsWithDistance = useBinsWithDistance(bins.data);

  useEffect(() => {
    if (!mapViewRef.current || !isHtmlReady || !binsWithDistance) {
      return;
    }

    const injectedJs = /*js*/ `
      if (window.updateBins) {
        window.updateBins(${JSON.stringify(binsWithDistance)});
      }
    `;

    mapViewRef.current.injectJavaScript(injectedJs);
  }, [binsWithDistance, isHtmlReady, mapViewRef]);
}
