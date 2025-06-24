export interface Area {
  areaId: string;
  areaName: string;
  description?: string;
}

export interface Floor {
  floorId: string;
  floorNumber: string;
  description?: string;
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
  floor?: Floor;
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
