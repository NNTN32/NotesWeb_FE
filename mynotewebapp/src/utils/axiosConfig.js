import axios from 'axios';

// Use relative baseURL to work with Vite dev proxy (avoids CORS in dev)
const axiosConfig = axios.create({
  baseURL: '/api'
});

axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url ?? "";
      const isAuthSubmit =
        url.includes("/auth/login") || url.includes("/auth/register");
      if (!isAuthSubmit && (status === 401 || status === 403)) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );
export default axiosConfig;