import client from "../axiosConfig.js";
import { createAuthApi } from "../../features/auth/authApi.js";
import { sessionFromToken, setSession } from "../../features/auth/session.js";

export const authApi = createAuthApi(client);
let refreshRequest;
let generation = 0;
export function invalidateSession() {
  generation++;
  setSession(null);
}
export function refreshSession() {
  if (!refreshRequest) {
    const started = generation;
    refreshRequest = authApi.refresh().then(({ accessToken }) => {
      if (started !== generation) return null;
      const session = sessionFromToken(accessToken);
      setSession(session);
      return session;
    }).finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
}
