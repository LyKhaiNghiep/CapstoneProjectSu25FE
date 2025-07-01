import useSWR from "swr";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";

export interface Assignment {
  assignmentId: string;
  assignmentName: string;
  description?: string;
  timesPerDay?: number;
  status?: string;
  schedulesNavigation?: any[];
  schedules?: any[];
}

export function useAssignments() {
  const { data, error, isLoading, mutate } = useSWR<Assignment[]>(
    API_URLS.ASSIGNMENTS.GET_ALL,
    swrFetcher
  );



  return {
    assignments: data || [],
    isLoading,
    error,
    mutate,
  };
} 