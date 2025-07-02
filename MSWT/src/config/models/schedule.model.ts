import { Area } from "./restroom.model";
import { Floor } from "./floor.model";

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
  // Related entity information for display
  area?: Area;
  floor?: Floor;
  scheduleName?: string;
  areaName?: string;
  restroomName?: string;
  trashBinName?: string;
  shiftName?: string;
  assignmentName?: string;
}

export interface ICreateScheduleRequest {
  areaId: string;
  scheduleName: string;
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