export function abortableDelay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

// Transport injection keeps the asynchronous backend contract independently testable.
export function createAuthApi(client, { delay = abortableDelay, attempts = 30 } = {}) {
  return {
    async login({ username, password }, { signal } = {}) {
      signal = AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(45000)]);
      const queued = await client.post("/auth/login", { username, password }, { signal });
      const sessionId = queued.data?.sessionId;
      if (typeof sessionId !== "string" || !sessionId) {
        throw new Error("Invalid sign-in response. Please try again.");
      }
      for (let attempt = 0; attempt < attempts; attempt++) {
        signal?.throwIfAborted();
        const result = await client.get(`/auth/login/result/${encodeURIComponent(sessionId)}`, { signal });
        const status = String(result.data?.status || "").toUpperCase();
        if (status === "SUCCESS" && typeof result.data.accessToken === "string") return result.data;
        if (result.status !== 202 && status !== "PENDING") {
          throw new Error("Sign-in was unsuccessful. Please check your username and password.");
        }
        if (attempt < attempts - 1) await delay(1000, signal);
      }
      throw new Error("Sign-in could not be confirmed. Check your credentials and try again.");
    },
    async register({ username, email, password }, { signal } = {}) {
      await client.post("/auth/register", { username, email, password, role: "USER" }, { signal });
    },
    async refresh() {
      const result = await client.post("/auth/refresh");
      if (typeof result.data?.accessToken !== "string") throw new Error("Invalid session response.");
      return result.data;
    },
    async logout() {
      await client.post("/auth/logout");
    },
  };
}
