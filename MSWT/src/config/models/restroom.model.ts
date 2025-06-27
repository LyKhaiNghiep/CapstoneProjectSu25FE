import { Floor } from "./floor.model";

export type { Floor };

export interface Area {
  id: string;
  areaId: string;
  floorId: string;
  description: string;
  status: string;
  roomBegin: string;
  roomEnd: string;
  areaName: string;
  floor?: Floor;
}

export interface Schedule {
  scheduleId: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  userId: string;
  restroomId: string;
}

export interface Restroom {
  restroomId: string;
  restroomNumber: string;
  description: string;
  areaId: string;
  floorId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  area?: Area;
  // floor?: Floor;
  schedules?: Schedule[];
}

export interface RestroomCreateRequest {
  restroomNumber: string;
  description: string;
  areaId: string;
  floorId: string;
  status: string;
}

export interface RestroomUpdateRequest {
  restroomNumber?: string;
  description?: string;
  areaId?: string;
  floorId?: string;
  status?: string;
}
