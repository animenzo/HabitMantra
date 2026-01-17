import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true // 🔥 REQUIRED for refresh cookies
});

// attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh token logic
API.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await API.post("/auth/refresh");
        localStorage.setItem("token", res.data.token);
        original.headers.Authorization = `Bearer ${res.data.token}`;
        return API(original);
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default API;
