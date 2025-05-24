import { useQuery } from '@tanstack/react-query';

import useLocation from '@/feature/map/hooks/useLocation';
import api from '@/utils/api';
import { serializeAxiosError } from '@/utils/serializeAxiosError';

import { Bin } from '../types';

const disableFetchingBins = false;

export default function useBins() {
  const { location } = useLocation();
  const [latitude, longitude] = location?.[0] && location?.[1] ? [location[0], location[1]] : [null, null];
  const binsUrl =
    latitude && longitude
      ? `/bins/?latitude=${latitude}&longitude=${longitude}`
      : null;

  return useQuery<Bin[]>({
    queryKey: ['bins', latitude, longitude],
    queryFn: async () => {
      if (!binsUrl) return null;
      try {
        const response = await api.get(binsUrl);
        return response.data;
      } catch (error) {
        console.error('Error fetching bins:', JSON.stringify(serializeAxiosError(error), null, 2));
        throw error;
      }
    },
    enabled: !!binsUrl && !disableFetchingBins,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}
