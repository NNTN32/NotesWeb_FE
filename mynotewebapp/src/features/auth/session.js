let session = null;
const listeners = new Set();
export const subscribeSession = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getSession = () => session;
export const getAccessToken = () => session?.accessToken;

// Claims are display metadata only. The backend verifies signatures and permissions.
export function sessionFromToken(accessToken) {
  if (typeof accessToken !== "string") throw new Error("Missing access token.");
  let claims;
  try {
    const payload = accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), (character) => character.charCodeAt(0));
    claims = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error("Invalid account response. Please sign in again.");
  }
  if (typeof claims.sub !== "string" || !claims.sub ||
      typeof claims.userId !== "string" || !claims.userId || claims.type !== "Access" ||
      !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  return { accessToken, expiresAt: claims.exp * 1000,
    user: { id: claims.userId, username: claims.sub, name: claims.sub } };
}
export function setSession(value) {
  session = value;
  listeners.forEach((listener) => listener());
}
