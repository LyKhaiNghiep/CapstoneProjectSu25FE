import useSWR from "swr";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import { Restroom } from "@/config/models/restroom.model";
import { IBaseResponse } from "@/config/models/types";

export function useRestrooms() {
  const { data, error, isLoading, mutate } = useSWR<IBaseResponse<Restroom>>(
    API_URLS.RESTROOM.GET_ALL,
    swrFetcher
  );

  const createRestroom = async (
    newRestroom: Omit<Restroom, "restroomId" | "schedules">
  ) => {
    try {
      const response = await swrFetcher(API_URLS.RESTROOM.CREATE, {
        method: "POST",
        body: JSON.stringify(newRestroom),
      });
      mutate();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateRestroom = async (
    id: string,
    updatedData: Partial<Omit<Restroom, "restroomId" | "schedules">>
  ) => {
    try {
      const response = await swrFetcher(API_URLS.RESTROOM.UPDATE(id), {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      mutate();
      return response;
    } catch (error) {
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
