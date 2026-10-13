import client from "../../lib/httpClient.js";
import { createAuthApi } from "./authApi.js";
import { sessionFromToken, setSession } from "./session.js";

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
