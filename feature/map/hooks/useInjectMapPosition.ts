import { RefObject, useEffect } from 'react';
import WebView from 'react-native-webview';

export default function useInjectMapPosition(
  mapViewRef: RefObject<WebView>,
  latitude?: number | null,
  longitude?: number | null
): void {
  useEffect(() => {
    if (!mapViewRef.current || !latitude || !longitude) {
      return;
    }

    const injectedJs = /*js*/ `
      if (window.updateMapPosition) {
        window.updateMapPosition(${latitude}, ${longitude});
      }
    `;

    mapViewRef.current.injectJavaScript(injectedJs);
  }, [latitude, longitude, mapViewRef]);
}
