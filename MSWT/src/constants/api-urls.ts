// Base API URL for the backend
export const BASE_API_URL =
  "https://capstoneproject-mswt-su25.onrender.com/api";

export const API_URLS = {
  // User management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong userService.js
  // Backend xử lý authentication trực tiếp trong login endpoint
  USER: {
    GET_ALL: `users`,
    GET_BY_ID: (id: string) => `users/${id}`,
    CREATE: `users`,
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
    LOGIN: `users/login`, // Backend xử lý login và trả về token
    REGISTER: `users/register`, // Backend xử lý register
  },

  // Floor management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useFloor.ts
  FLOOR: {
    GET_ALL: `floors`,
    GET_BY_ID: (id: string) => `floors/${id}`,
    CREATE: `floors`,
    UPDATE: (id: string) => `floors/${id}`,
    DELETE: (id: string) => `floors/${id}`,
  },

  // Area management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useArea.ts
  AREA: {
    GET_ALL: `areas`,
    GET_BY_ID: (id: string) => `areas/${id}`,
    CREATE: `areas`,
    UPDATE: (id: string) => `areas/${id}`,
    DELETE: (id: string) => `areas/${id}`,
  },

  // Restroom management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useRestroom.ts
  RESTROOM: {
    GET_ALL: `restrooms`,
    GET_BY_ID: (id: string) => `restrooms/${id}`,
    CREATE: `restrooms`,
    UPDATE: (id: string) => `restrooms/${id}`,
    DELETE: (id: string) => `restrooms/${id}`,
  },

  // Schedule management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useRestroom.ts
  SCHEDULE: {
    GET_ALL: `schedules`,
    GET_BY_ID: (id: string) => `schedules/${id}`,
    CREATE: `schedules`,
    UPDATE: (id: string) => `schedules/${id}`,
    DELETE: (id: string) => `schedules/${id}`,
  },

  // Schedule Details management endpoints
  SCHEDULE_DETAILS: {
    GET_ALL: `scheduledetails`,
    GET_BY_ID: (id: string) => `scheduledetails/${id}`,
    GET_BY_SCHEDULE_ID: (scheduleId: string) => `scheduledetails/schedule/${scheduleId}`,
    CREATE: `scheduledetails`,
    UPDATE: (id: string) => `scheduledetails/${id}`,
    DELETE: (id: string) => `scheduledetails/${id}`,
  },

  // Shifts management endpoints
  SHIFTS: {
    GET_ALL: `shifts`,
    GET_BY_ID: (id: string) => `shifts/${id}`,
    CREATE: `shifts`,
    UPDATE: (id: string) => `shifts/${id}`,
    DELETE: (id: string) => `shifts/${id}`,
  },

  // Assignments management endpoints
  ASSIGNMENTS: {
    GET_ALL: `assignments`, // Correct plural form from Swagger
    GET_BY_ID: (id: string) => `assignments/${id}`,
    CREATE: `assignments`,
    UPDATE: (id: string) => `assignments/${id}`,
    DELETE: (id: string) => `assignments/${id}`,
  },

  // TrashBin management endpoints
  TRASHBIN: {
    GET_ALL: `trashbins`,
    GET_BY_ID: (id: string) => `trashbins/${id}`,
    CREATE: `trashbins`,
    UPDATE: (id: string) => `trashbins/${id}`,
    DELETE: (id: string) => `trashbins/${id}`,
  },

  // Report management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong ReportManagement.jsx
  REPORT: {
    GET_ALL: `reports`, // GET /api/reports - Báo cáo tổng
    GET_WITH_ROLE: `reports/with-role`, // GET /api/reports/with-role - Filter theo role
    GET_BY_ID: (id: string) => `reports/${id}`,
    CREATE: `reports`,
    CREATE_LEADER: `reports/leader`, // POST /api/reports/leader - Tạo báo cáo cho Leader
    UPDATE: (id: string) => `reports/${id}`,
    DELETE: (id: string) => `reports/${id}`,
  },
};
