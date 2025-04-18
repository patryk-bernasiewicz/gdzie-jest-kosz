import { useQuery } from "@tanstack/react-query";
import useLocation from "./useLocation";
import { Bin } from "@/types/Bin";

const disableFetchingBins = false;

export default function useBins() {
  const { location } = useLocation();
  const binsUrl =
    location && location[0] && location[1]
      ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/bins/?latitude=${location[0]}&longitude=${location[1]}`
      : null;

  return useQuery<Bin[]>({
    queryKey: ["bins"],
    queryFn: async () => {
      if (!binsUrl) return null;
      try {
        const response = await fetch(binsUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching bins:", error);
        throw error;
      }
    },
    enabled: !!binsUrl && !disableFetchingBins,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}
