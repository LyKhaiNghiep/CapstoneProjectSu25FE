import { Area } from "@/config/models/restroom.model";
import { IBaseResponse } from "@/config/models/types";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import useSWR from "swr";
import { ICreateAreaRequest } from "@/config/models/area.model";

// Hook to fetch areas for dropdown
export function useAreas() {
  const { data, error, isLoading, mutate } = useSWR<IBaseResponse<Area>>(
    API_URLS.AREA.GET_ALL,
    swrFetcher
  );

  const createAsync = async (request: ICreateAreaRequest) => {
    try {
      const response = await swrFetcher(API_URLS.AREA.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      mutate();
      return response;
    } catch (error) {
      console.error("Error creating area:", error);
      throw error;
    }
  };

  return {
    areas: data?.$values ?? [],
    isLoading,
    error,
    createAsync,
  };
}
