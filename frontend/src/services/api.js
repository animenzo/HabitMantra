import axios from "axios";

/**
 * Main API instance (for normal requests)
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

/**
 * Separate instance for refresh token
 * (NO interceptors to avoid infinite loop)
 */
const refreshAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

/**
 * Attach access token on every request
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle expired token (401)
 */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshAPI.post("/auth/refresh");

        const newToken = res.data.token;
        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);

      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/home";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
