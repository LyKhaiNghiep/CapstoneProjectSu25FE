// Base API URL for the backend
export const BASE_API_URL = "https://capstoneproject-mswt-su25.onrender.com/api";

export const API_URLS = {
  FLOOR: {
    GET_ALL: `floors`,
    GET_BY_ID: (id: string) => `floors/${id}`,
    CREATE: `floors`,
    UPDATE: (id: string) => `floors/${id}`,
    DELETE: (id: string) => `floors/${id}`,
  },
  AREA: {
    GET_ALL: `areas`,
    GET_BY_ID: (id: string) => `areas/${id}`,
    CREATE: `areas`,
    UPDATE: (id: string) => `areas/${id}`,
    DELETE: (id: string) => `areas/${id}`,
  },
  RESTROOM: {
    GET_ALL: `restrooms`,
    GET_BY_ID: (id: string) => `restrooms/${id}`,
    CREATE: `restrooms`,
    UPDATE: (id: string) => `restrooms/${id}`,
    DELETE: (id: string) => `restrooms/${id}`,
  },
  USER: {
    GET_ALL: `users`,
    GET_BY_ID: (id: string) => `users/${id}`,
    CREATE: `users`,
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
  },
  AUTH: {
    LOGIN: `auth/login`,
    REGISTER: `auth/register`,
    LOGOUT: `auth/logout`,
    REFRESH: `auth/refresh`,
  },
  REPORT: {
    GET_ALL: `reports`,
    GET_BY_ID: (id: string) => `reports/${id}`,
    CREATE: `reports`,
    UPDATE: (id: string) => `reports/${id}`,
    DELETE: (id: string) => `reports/${id}`,
  },
  SCHEDULE: {
    GET_ALL: `schedules`,
    GET_BY_ID: (id: string) => `schedules/${id}`,
    CREATE: `schedules`,
    UPDATE: (id: string) => `schedules/${id}`,
    DELETE: (id: string) => `schedules/${id}`,
  },
};
