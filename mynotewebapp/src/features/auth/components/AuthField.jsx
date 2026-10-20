import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import IconButton from "../../../components/ui/IconButton";
import { ENTER, staggerStyle } from "../../../lib/motion";

export default function AuthField({ id, label, type = "text", index = 0, ...inputProps }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <div className={`field ${ENTER.rise}`} style={staggerStyle(index + 1)}>
      <label htmlFor={id}>{label}</label>
      <span className="auth-input">
        <input
          id={id}
          className="input"
          type={isPassword && visible ? "text" : type}
          maxLength={isPassword ? 256 : 254}
          required
          {...inputProps}
        />
        {isPassword && (
          <IconButton
            label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
            icon={visible ? FiEyeOff : FiEye}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          />
        )}
      </span>
    </div>
  );
}
