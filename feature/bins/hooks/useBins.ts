import { useQuery } from '@tanstack/react-query';
import { Bin } from '@/types/Bin';
import api from '@/lib/api';
import useLocation from '@/feature/map/hooks/useLocation';

const disableFetchingBins = false;

export default function useBins() {
  const { location } = useLocation();
  const binsUrl =
    location && location[0] && location[1]
      ? `/bins/?latitude=${location[0]}&longitude=${location[1]}`
      : null;

  return useQuery<Bin[]>({
    queryKey: ['bins'],
    queryFn: async () => {
      if (!binsUrl) return null;
      try {
        const response = await api.get(binsUrl);
        return response.data;
      } catch (error) {
        console.error('Error fetching bins:', error);
        throw error;
      }
    },
    enabled: !!binsUrl && !disableFetchingBins,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}
