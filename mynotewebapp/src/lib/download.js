/** Turns any title into a safe file name (letters, numbers, spaces, - and _). */
export function safeFileName(name, fallback = "note") {
  const cleaned = name.replace(/[^\p{L}\p{N} _-]/gu, "").trim().slice(0, 80);
  return cleaned || fallback;
}

export function downloadText(fileName, text) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
