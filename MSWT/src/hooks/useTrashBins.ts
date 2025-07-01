import useSWR from "swr";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";

export interface TrashBin {
  trashBinId: string;
  trashBinName: string;
  location?: string;
  capacity?: number;
  type?: string;
  areaId?: string;
  floorId?: string;
}

export function useTrashBins() {
  const { data, error, isLoading, mutate } = useSWR<TrashBin[]>(
    API_URLS.TRASHBIN.GET_ALL, // Using existing API URL
    swrFetcher
  );

  return {
    trashBins: data || [],
    isLoading,
    error,
    mutate,
  };
} 