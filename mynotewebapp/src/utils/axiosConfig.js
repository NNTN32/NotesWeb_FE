import axios from "axios";
import { getAccessToken } from "../features/auth/session.js";

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
export default client;
