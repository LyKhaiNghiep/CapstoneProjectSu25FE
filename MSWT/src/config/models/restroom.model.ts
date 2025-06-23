export interface Restroom {
  restroomId: string;
  description: string;
  areaId: string;
  status: string;
  floorId: string;
  restroomNumber: string;
  area: null | {
    // Add area type if needed
  };
  floor: null | {
    // Add floor type if needed
  };
  schedules: {
    $id: string;
    $values: any[];
  };
}
