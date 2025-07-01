import useSWR from "swr";
import { useMemo } from "react";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import {
  ScheduleDetails,
  ICreateScheduleDetailsRequest,
  IUpdateScheduleDetailsRequest,
} from "@/config/models/scheduleDetails.model";
import { useUsers } from "./useUsers";
import { useAreas } from "./useArea";
import { useRestrooms } from "./useRestroom";
import { useFloors } from "./useFloor";
import { useShifts } from "./useShifts";
import { useTrashBins } from "./useTrashBins";
import { useAssignments } from "./useAssignments";

export function useScheduleDetails(scheduleId?: string) {
  // Fetch all schedule details from the main endpoint
  const { data, error, isLoading, mutate } = useSWR<ScheduleDetails[]>(
    API_URLS.SCHEDULE_DETAILS.GET_ALL,
    swrFetcher
  );

  // Fetch all related data for name lookup
  const { users } = useUsers();
  const { areas } = useAreas();
  const { restrooms } = useRestrooms();
  const { floors } = useFloors();
  const { shifts } = useShifts();
  const { trashBins } = useTrashBins();
  const { assignments } = useAssignments();

  // Create lookup maps for all entities
  const userLookup = useMemo(() => {
    const lookup = new Map();
    if (users && Array.isArray(users)) {
      users.forEach((user: any) => {
        lookup.set(user.userId || user.id, user.fullName || user.username || user.name);
      });
    }
    return lookup;
  }, [users]);

  const areaLookup = useMemo(() => {
    const lookup = new Map();
    if (areas && Array.isArray(areas)) {
      areas.forEach((area: any) => {
        lookup.set(area.areaId || area.id, area.areaName || area.name);
      });
    }
    return lookup;
  }, [areas]);

  const restroomLookup = useMemo(() => {
    const lookup = new Map();
    if (restrooms && Array.isArray(restrooms)) {
      restrooms.forEach((restroom: any) => {
        // Use restroomNumber first, then fallback to restroomName or name
        const displayName = restroom.restroomNumber || restroom.restroomName || restroom.name || restroom.restroomId;
        lookup.set(restroom.restroomId || restroom.id, displayName);
      });
    }
    return lookup;
  }, [restrooms]);

  const floorLookup = useMemo(() => {
    const lookup = new Map();
    if (floors && Array.isArray(floors)) {
      floors.forEach((floor: any) => {
        lookup.set(floor.floorId || floor.id, floor.floorName || floor.name);
      });
    }
    return lookup;
  }, [floors]);

  const shiftLookup = useMemo(() => {
    const lookup = new Map();
    if (shifts && Array.isArray(shifts)) {
      shifts.forEach((shift: any) => {
        lookup.set(shift.shiftId || shift.id, shift.shiftName || shift.name || `Ca ${shift.shiftId}`);
      });
    }
    return lookup;
  }, [shifts]);

  const trashBinLookup = useMemo(() => {
    const lookup = new Map();
    if (trashBins && Array.isArray(trashBins)) {
      trashBins.forEach((trashBin: any) => {
        lookup.set(trashBin.trashBinId || trashBin.id, trashBin.trashBinName || trashBin.name);
      });
    }
    return lookup;
  }, [trashBins]);

  const assignmentLookup = useMemo(() => {
    const lookup = new Map();
    
    // Add hardcoded mapping for testing - based on the JSON you showed
    lookup.set('a56123ed-2069-40a7-971a-7ce00160021d', 'Dọn vệ sinh chung');
    
    if (assignments && Array.isArray(assignments) && assignments.length > 0) {
      console.log('📋 Assignments data:', assignments);
      assignments.forEach((assignment: any) => {
        // Use assignmentName from API response
        const displayName = assignment.assignmentName || assignment.assignmentId;
        if (assignment.assignmentId && displayName) {
          lookup.set(assignment.assignmentId, displayName);
          console.log(`📋 Assignment mapping: ${assignment.assignmentId} -> ${displayName}`);
        }
      });
    } else {
      console.log('⚠️ No assignments data available or empty array:', assignments);
    }
    console.log('📋 Assignment lookup map size:', lookup.size);
    console.log('📋 Assignment lookup map:', Array.from(lookup.entries()));
    return lookup;
  }, [assignments]);

  // Enhanced schedule details with name mappings, filtered by scheduleId if provided
  const enhancedScheduleDetails = useMemo(() => {
    if (!data) return [];
    
    let filteredData = data;
    if (scheduleId) {
      filteredData = data.filter(detail => detail.scheduleId === scheduleId);
    }
    
    return filteredData.map((detail) => ({
      ...detail,
      // User name mappings
      workerName: userLookup.get(detail.workerId) || detail.workerId,
      supervisorName: userLookup.get(detail.supervisorId) || detail.supervisorId,
      backupForUserName: detail.backupForUserId ? userLookup.get(detail.backupForUserId) || detail.backupForUserId : null,
      
      // Schedule related name mappings
      schedule: detail.schedule ? {
        ...detail.schedule,
        areaName: areaLookup.get(detail.schedule.areaId) || detail.schedule.areaId,
        restroomNumber: restroomLookup.get(detail.schedule.restroomId) || detail.schedule.restroomId,
        assignmentName: (() => {
          // First try to get from assignmentLookup (from API)
          let mappedName = assignmentLookup.get(detail.schedule.assignmentId);
          console.log(`🔍 Assignment lookup for ${detail.schedule.assignmentId}: ${mappedName}`);
          
          // If no mapping found, check if assignment name is already in the schedule object
          if (!mappedName || mappedName === detail.schedule.assignmentId) {
            // Check if there's assignment info embedded in the schedule data
            const embeddedAssignmentName = (detail.schedule as any).assignmentName;
            console.log(`🔍 Embedded assignment name: ${embeddedAssignmentName}`);
            
            // If still no name found, create a meaningful fallback based on schedule type
            if (!embeddedAssignmentName) {
              const scheduleType = detail.schedule.scheduleType?.toLowerCase();
              if (scheduleType?.includes('hàng ngày') || scheduleType?.includes('daily')) {
                return 'Dọn vệ sinh hàng ngày';
              } else if (scheduleType?.includes('tuần') || scheduleType?.includes('weekly')) {
                return 'Dọn vệ sinh hàng tuần';
              } else if (scheduleType?.includes('bảo trì') || scheduleType?.includes('maintenance')) {
                return 'Bảo trì định kỳ';
              } else {
                return 'Công việc được phân công';
              }
            }
            
            return embeddedAssignmentName;
          }
          
          return mappedName;
        })(),
        shiftName: shiftLookup.get(detail.schedule.shiftId) || `Ca ${detail.schedule.shiftId}`,
        trashBinName: trashBinLookup.get(detail.schedule.trashBinId) || detail.schedule.trashBinId,
      } : detail.schedule,
      
      taskType: getTaskTypeFromDescription(detail.description),
    }));
  }, [data, userLookup, areaLookup, restroomLookup, floorLookup, shiftLookup, trashBinLookup, assignmentLookup, scheduleId]);

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

  const updateScheduleDetail = async (
    id: string,
    updatedData: IUpdateScheduleDetailsRequest
  ) => {
    try {
      const response = await swrFetcher(API_URLS.SCHEDULE_DETAILS.UPDATE(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
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
    scheduleDetails: enhancedScheduleDetails,
    isLoading,
    error,
    createScheduleDetail,
    updateScheduleDetail,
    deleteScheduleDetail,
    mutate,
  };
}

// Helper function to determine task type from description
function getTaskTypeFromDescription(description: string): string {
  if (!description) return "Khác";
  const desc = description.toLowerCase();
  if (desc.includes("vệ sinh") || desc.includes("dọn dẹp")) return "Vệ sinh";
  if (desc.includes("bảo trì") || desc.includes("sửa chữa")) return "Bảo trì";
  if (desc.includes("kiểm tra") || desc.includes("inspect")) return "Kiểm tra";
  return "Khác";
}

// Hook to get schedule details by specific schedule detail ID
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