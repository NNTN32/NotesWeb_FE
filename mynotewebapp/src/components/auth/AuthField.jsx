import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
export default function AuthField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <span className="auth-input-wrap">
        <input
          id={id}
          name={name}
          type={type === "password" && visible ? "text" : type}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          maxLength={type === "password" ? 256 : 254}
        />
        {type === "password" && (
          <button
            type="button"
            aria-label={`${visible ? "Hide" : "Show"} ${label.toLocaleLowerCase("en")}`}
            aria-pressed={visible}
            className="ws-icon-button"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </span>
    </div>
  );
}
