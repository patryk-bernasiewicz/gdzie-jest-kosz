import { RefObject, useEffect } from 'react';
import WebView from 'react-native-webview';

/**
 * A custom hook that injects JavaScript into a WebView when a bin is created
 * @param mapViewRef - reference to the WebView component
 * @param isBinCreated - boolean indicatin whether a bin has been created
 * @param callback - optional callback function that is called after the injection
 * @returns {void}
 */
export default function useBinCreatedEffect(
  mapViewRef: RefObject<WebView>,
  isBinCreated: boolean | null,
  callback?: () => void
): void {
  useEffect(() => {
    if (!isBinCreated) {
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
  }, [callback, isBinCreated, mapViewRef]);
}
