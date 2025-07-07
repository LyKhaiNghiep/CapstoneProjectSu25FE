import useSWR from "swr";
import { useMemo } from "react";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import {
  ScheduleDetails,
  ICreateScheduleDetailsRequest,
  IUpdateScheduleDetailsRequest,
} from "@/config/models/scheduleDetails.model";

export function useScheduleDetails(scheduleId?: string) {
  // Fetch all schedule details from the main endpoint
  const { data, error, isLoading, mutate } = useSWR<ScheduleDetails[]>(
    API_URLS.SCHEDULE_DETAILS.GET_ALL,
    swrFetcher
  );

  // Simple filtering by scheduleId if provided
  const scheduleDetails = useMemo(() => {
    if (!data) return [];
    
    if (scheduleId) {
      return data.filter(detail => detail.scheduleId === scheduleId);
    }
    
    return data;
  }, [data, scheduleId]);

  const createScheduleDetail = async (newDetail: ICreateScheduleDetailsRequest) => {
    try {
      const response = await swrFetcher(API_URLS.SCHEDULE_DETAILS.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDetail),
      });
      mutate();
      return response;
    } catch (error) {
      console.error("Error creating schedule detail:", error);
      throw error;
    }
  };

  const createScheduleDetailForSchedule = async (
    scheduleId: string, 
    newDetail: {
      description: string;
      rating: string;
      workerId: string;
      evidenceImage?: string;
      startTime: string;
      endTime: string;
      backupForUserId?: string;
    }
  ) => {
    try {
      const detailData: ICreateScheduleDetailsRequest = {
        scheduleId: scheduleId,
        description: newDetail.description,
        date: new Date().toISOString().split('T')[0], // Current date
        status: "pending", // Default status
        supervisorId: newDetail.backupForUserId || "", // Use backupForUserId as supervisorId
        rating: newDetail.rating,
        workerId: newDetail.workerId,
        evidenceImage: newDetail.evidenceImage || "",
        startTime: newDetail.startTime,
        endTime: newDetail.endTime,
        isBackup: false,
        backupForUserId: newDetail.backupForUserId || undefined,
      };

      console.log("📝 Creating schedule detail with data:", detailData);
      
      const response = await createScheduleDetail(detailData);
      
      console.log("✅ Schedule detail created successfully:", response);
      
      return response;
    } catch (error) {
      console.error("Error creating schedule detail for schedule:", error);
      throw error;
    }
  };

  const updateScheduleDetail = async (
    id: string,
    updatedData: IUpdateScheduleDetailsRequest
  ) => {
    try {
      const response = await swrFetcher(
        API_URLS.SCHEDULE_DETAILS.UPDATE(id),
        {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        }
      );
      mutate();
      return response;
    } catch (error) {
      console.error("Error updating schedule detail:", error);
      throw error;
    }
  };

  const deleteScheduleDetail = async (id: string) => {
    try {
      await swrFetcher(API_URLS.SCHEDULE_DETAILS.DELETE(id), {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      console.error("Error deleting schedule detail:", error);
      throw error;
    }
  };

  return {
    scheduleDetails,
    isLoading,
    error,
    mutate,
    createScheduleDetail,
    createScheduleDetailForSchedule,
    updateScheduleDetail,
    deleteScheduleDetail,
  };
}

export function useScheduleDetailById(id: string) {
  const { data, error, isLoading, mutate } = useSWR<ScheduleDetails>(
    id ? API_URLS.SCHEDULE_DETAILS.GET_BY_ID(id) : null,
    swrFetcher
  );

  return {
    scheduleDetail: data,
    isLoading,
    error,
    mutate,
  };
} 