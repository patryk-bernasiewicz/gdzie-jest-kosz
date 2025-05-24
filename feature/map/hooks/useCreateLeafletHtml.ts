import { useEffect, useState } from 'react';

import createLeafletHtml from '@/feature/map/utils/createLeafletHtml';

/**
 * Custom hook that generates the initial HTML string for a Leaflet map,
 * centered at the provided latitude and longitude coordinates
 * @param latitude - latitude for the map center
 * @param longitude - longitude for the map center
 * @returns initial HTML string for the Leaflet map, or `null` if the coordinates are not provided.
 */
export default function useCreateLeafletHtml(
  latitude?: number | null,
  longitude?: number | null
): string | null {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (html || !latitude || !longitude) {
      return;
    }

    setHtml(createLeafletHtml(latitude, longitude));
  }, [html, latitude, longitude]);

  return html;
}
