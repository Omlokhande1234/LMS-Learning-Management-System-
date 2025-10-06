import axios from "axios";

// If VITE_API_URL is provided (e.g., production), use it.
// Otherwise default to "/api" so Vite dev server proxy can forward to backend.
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
