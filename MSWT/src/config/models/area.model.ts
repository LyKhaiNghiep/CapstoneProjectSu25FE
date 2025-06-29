export interface ICreateAreaRequest {
  floorId: string;
  description: string;
  status: string;
  roomBegin: string;
  roomEnd: string;
  areaName: string;
}

export interface IUpdateAreaRequest {
  description: string;
  status: string;
  roomBegin: string;
  roomEnd: string;
  areaName: string;
}
