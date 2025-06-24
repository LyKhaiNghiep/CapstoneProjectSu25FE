import useSWR from "swr";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import { Restroom, RestroomCreateRequest, RestroomUpdateRequest } from "@/config/models/restroom.model";
import { IBaseResponse } from "@/config/models/types";

export function useRestrooms() {
  const { data, error, isLoading, mutate } = useSWR<IBaseResponse<Restroom>>(
    API_URLS.RESTROOM.GET_ALL,
    swrFetcher
  );

  const createRestroom = async (newRestroom: RestroomCreateRequest) => {
    try {
      const response = await swrFetcher(API_URLS.RESTROOM.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRestroom),
      });
      mutate();
      return response;
    } catch (error) {
      console.error("Error creating restroom:", error);
      throw error;
    }
  };

  const updateRestroom = async (id: string, updatedData: RestroomUpdateRequest) => {
    try {
      const response = await swrFetcher(API_URLS.RESTROOM.UPDATE(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      mutate();
      return response;
    } catch (error) {
      console.error("Error updating restroom:", error);
      throw error;
    }
  };

  const deleteRestroom = async (id: string) => {
    try {
      await swrFetcher(API_URLS.RESTROOM.DELETE(id), {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      console.error("Error deleting restroom:", error);
      throw error;
    }
  };

  return {
    restrooms: data?.$values ?? [],
    isLoading,
    error,
    createRestroom,
    updateRestroom,
    deleteRestroom,
    mutate,
  };
}

// Hook to fetch areas for dropdown
export function useAreas() {
  const { data, error, isLoading } = useSWR<IBaseResponse<any>>(
    API_URLS.AREA.GET_ALL,
    swrFetcher
  );

  return {
    areas: data?.$values ?? [],
    isLoading,
    error,
  };
}

// Hook to fetch floors for dropdown
export function useFloors() {
  const { data, error, isLoading } = useSWR<IBaseResponse<any>>(
    API_URLS.FLOOR.GET_ALL,
    swrFetcher
  );

  return {
    floors: data?.$values ?? [],
    isLoading,
    error,
  };
}
