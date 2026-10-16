import axios from "axios";
import { getAccessToken } from "../features/auth/session.js";
import { retryDeadline } from "./rateLimit.js";

// Same-origin requests send the HttpOnly rotation cookie without exposing it to JS.
const client = axios.create({ baseURL: "/api", timeout: 15000 });
client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.url.startsWith("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// A 403 may mean insufficient permissions; do not redirect or clear the session.
client.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 429) error.retryAt = retryDeadline(error.response.headers);
  // Propagate throttling to the UI; never replay credential submissions here.
  return Promise.reject(error);
});
export default client;
