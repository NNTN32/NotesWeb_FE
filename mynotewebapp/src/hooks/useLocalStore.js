import { useCallback, useEffect, useRef, useState } from "react";

// Dữ liệu chỉ được ghi khi người dùng thay đổi, không ghi đè bản lỗi lúc khởi động.
export function useLocalStore(key, initialValue, validate) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { value: initialValue, error: "" };
      const value = JSON.parse(raw);
      if (!validate(value)) throw new Error("Invalid local data");
      return { value, error: "" };
    } catch {
      return {
        value: initialValue,
        error:
          "Không thể đọc dữ liệu đã lưu. Dữ liệu cũ chưa bị ghi đè; hãy sao lưu trước khi chỉnh sửa.",
      };
    }
  });
  const current = useRef(state.value);
  const update = useCallback(
    (valueOrUpdater) => {
      const value =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(current.current)
          : valueOrUpdater;
      let error = "";
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        error =
          "Trình duyệt không thể lưu dữ liệu. Thay đổi hiện chỉ nằm trong bộ nhớ; hãy sao chép nội dung trước khi rời trang.";
      }
      current.current = value;
      setState({ value, error });
      return !error;
    },
    [key],
  );

  useEffect(() => {
    const sync = (event) => {
      if (event.key !== key || event.newValue === null) return;
      try {
        const value = JSON.parse(event.newValue);
        if (!validate(value)) return;
        current.current = value;
        setState({ value, error: "" });
      } catch {
        /* Bỏ qua dữ liệu không hợp lệ từ tab khác. */
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, validate]);

  return [state.value, update, state.error];
}
