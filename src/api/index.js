import axios from "axios";

const rawApiUrl = (import.meta.env.VITE_API_URL || "https://jeru-tech-backend.vercel.app").trim();
const normalizedOrigin = rawApiUrl.replace(/\/+$/, "");
const baseUrl = normalizedOrigin.endsWith("/api")
  ? normalizedOrigin
  : `${normalizedOrigin}/api`;

const api = axios.create({
  baseURL: `${baseUrl}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export default api;
