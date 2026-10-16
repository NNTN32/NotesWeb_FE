import { useEffect, useState } from "react";
import { retrySeconds } from "../../lib/rateLimit.js";

export function useRetryCountdown(deadline) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!deadline) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(() => {
      tick();
      if (!retrySeconds(deadline)) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  return retrySeconds(deadline, now);
}
