function header(headers, name) {
  return headers?.get?.(name) ?? Object.entries(headers || {})
    .find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
}

export function retryDeadline(headers, now = Date.now()) {
  const value = String(header(headers, "Retry-After") ?? "").trim();
  let milliseconds;
  if (/^\d+$/.test(value)) milliseconds = Number(value) * 1000;
  else if (/^[A-Za-z]{3}, /.test(value)) {
    const serverNow = Date.parse(header(headers, "Date"));
    milliseconds = Date.parse(value) - (Number.isFinite(serverNow) ? serverNow : now);
  }
  // Cloudflare may omit the header; use a short local wait, never an automatic retry.
  if (!Number.isFinite(milliseconds) || !Number.isSafeInteger(now + milliseconds)) milliseconds = 30000;
  return now + Math.max(0, milliseconds);
}

export const retrySeconds = (deadline, now = Date.now()) => Math.max(0, Math.ceil((deadline - now) / 1000));
export const formatRetryWait = (seconds) => seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
