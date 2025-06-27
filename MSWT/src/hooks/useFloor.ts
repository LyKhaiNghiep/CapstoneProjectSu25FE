import { IBaseResponse } from "@/config/models/types";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import useSWR from "swr";
import { Floor } from "../config/models/floor.model";

// Hook to fetch floors for dropdown
export function useFloors() {
  const { data, error, isLoading } = useSWR<Floor[]>(
    API_URLS.FLOOR.GET_ALL,
    swrFetcher
  );

  return {
    floors: data ?? [],
    isLoading,
    error,
  };
}
