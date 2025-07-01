export interface ScheduleDetails {
  scheduleDetailId: string;
  scheduleId: string;
  description: string;
  date: string;
  status: string;
  supervisorId: string;
  rating: string;
  workerId: string;
  evidenceImage?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  isBackup?: boolean | null;
  backupForUserId?: string | null;
  schedule: {
    scheduleId: string;
    scheduleName: string;
    areaId: string;
    assignmentId: string;
    startDate: string;
    endDate: string;
    trashBinId: string;
    restroomId: string;
    scheduleType: string;
    shiftId: string;
    // Enhanced names
    areaName?: string;
    restroomNumber?: string;
    assignmentName?: string;
    shiftName?: string;
    trashBinName?: string;
  };
  
  // Related information for display
  workerName?: string;
  supervisorName?: string;
  backupForUserName?: string;
  taskType?: string;
}

export interface ICreateScheduleDetailsRequest {
  scheduleId: string;
  description: string;
  date: string;
  status: string;
  supervisorId: string;
  rating: string;
  workerId: string;
  evidenceImage?: string;
  startTime?: string;
  endTime?: string;
  isBackup?: boolean;
  backupForUserId?: string;
}

export interface IUpdateScheduleDetailsRequest {
  description?: string;
  date?: string;
  status?: string;
  supervisorId?: string;
  rating?: string;
  workerId?: string;
  evidenceImage?: string;
  startTime?: string;
  endTime?: string;
  isBackup?: boolean;
  backupForUserId?: string;
} 