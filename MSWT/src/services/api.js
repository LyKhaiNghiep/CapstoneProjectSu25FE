import axios from 'axios';

// Lấy biến môi trường
const BASE_URL   = import.meta.env.VITE_API_URL;
const TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Thêm interceptor request (nếu cần token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Thêm interceptor response (bắt lỗi chung)
api.interceptors.response.use(
  res => res,
  err => {
    // Ví dụ: tự động redirect khi 401
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
