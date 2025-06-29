import useSWR from "swr";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import {
  Schedule,
  ICreateScheduleRequest,
  IUpdateScheduleRequest,
} from "@/config/models/schedule.model";

export function useSchedules() {
  const { data, error, isLoading, mutate } = useSWR<Schedule[]>(
    API_URLS.SCHEDULE.GET_ALL,
    swrFetcher
  );

  const createSchedule = async (newSchedule: ICreateScheduleRequest) => {
    try {
      const response = await swrFetcher(API_URLS.SCHEDULE.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSchedule),
      });
      mutate();
      return response;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  };

  const updateSchedule = async (
    id: string,
    updatedData: IUpdateScheduleRequest
  ) => {
    try {
      const response = await swrFetcher(API_URLS.SCHEDULE.UPDATE(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      mutate();
      return response;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await swrFetcher(API_URLS.SCHEDULE.DELETE(id), {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  };

  return {
    schedules: data ?? [],
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    mutate,
  };
} 