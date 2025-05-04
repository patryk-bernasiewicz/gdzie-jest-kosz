import { RefObject, useEffect } from 'react';
import WebView from 'react-native-webview';

/**
 * Custom hook that injects JavaScript into a WebView when a bin is marked as invalid,
 * clearing the previously selected position
 * @param mapViewRef - reference to the WebView component
 * @param isBinMarkedInvalid - boolean indicating whether a bin has been marked as invalid
 * @param callback - optional callback function that is called after the injection
 * @returns {void}
 */
export default function useBinMarkedInvalidEffect(
  mapViewRef: RefObject<WebView>,
  isBinMarkedInvalid: boolean | null,
  callback?: () => void
): void {
  useEffect(() => {
    if (!isBinMarkedInvalid) {
      return;
    }

    if (mapViewRef.current) {
      const injectedJs = /*js*/ `
        if (window.clearSelectedPos) {
          window.clearSelectedPos();
        }
      `;

      mapViewRef.current.injectJavaScript(injectedJs);
    }

    callback?.();
  }, [isBinMarkedInvalid, mapViewRef, callback]);
}
