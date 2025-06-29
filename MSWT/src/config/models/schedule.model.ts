export interface Schedule {
  scheduleId: string;
  areaId: string;
  assignmentId: string;
  startDate: string;
  endDate: string;
  trashBinId: string;
  restroomId: string;
  scheduleType: string;
  shiftId: string;
}

export interface ICreateScheduleRequest {
  areaId: string;
  assignmentId: string;
  startDate: string;
  endDate: string;
  trashBinId?: string;
  restroomId?: string;
  scheduleType: string;
  shiftId: string;
}

export interface IUpdateScheduleRequest {
  areaId?: string;
  assignmentId?: string;
  startDate?: string;
  endDate?: string;
  trashBinId?: string;
  restroomId?: string;
  scheduleType?: string;
  shiftId?: string;
} 