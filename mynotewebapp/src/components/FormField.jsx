import { useState } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

/**
 * Reusable FormField component with enhanced animations and validation
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password)
 * @param {string} props.name - Field name
 * @param {string} props.value - Field value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onFocus - Focus handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.autoComplete - Autocomplete attribute
 * @param {string} props.label - Field label
 * @param {Object} props.icon - Icon component
 * @param {boolean} props.isFocused - Whether field is focused
 * @param {boolean} props.showPassword - Whether to show password (for password fields)
 * @param {Function} props.onTogglePassword - Toggle password visibility handler
 * @param {boolean} props.showValidation - Whether to show validation icon
 * @param {boolean} props.isValid - Whether field is valid
 * @param {number} [props.revealDelayMs] - Auth forms: staggered entrance delay (see authFormMotion.js + index.css)
 */
export default function FormField({
  type = "text",
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  required = false,
  autoComplete,
  label,
  icon: Icon,
  isFocused = false,
  showPassword = false,
  onTogglePassword,
  showValidation = false,
  isValid = false,
  className = "",
  inputId,
  revealDelayMs,
  ...props
}) {
  const fieldId = inputId ?? name;
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  
  const isPasswordField = type === "password";
  const shouldShowPassword = isPasswordField && (showPassword !== undefined ? showPassword : internalShowPassword);
  const showValidCheck = showValidation && value && isValid;
  
  const handleTogglePassword = () => {
    if (onTogglePassword) {
      onTogglePassword();
    } else {
      setInternalShowPassword(!internalShowPassword);
    }
  };

  const inputPadRight =
    isPasswordField && showValidCheck ? "pr-[4.75rem]" : "pr-12";

  const staggerStyle =
    revealDelayMs != null
      ? { "--auth-field-delay": `${revealDelayMs}ms` }
      : undefined;

  return (
    <div
      className={`group ${revealDelayMs != null ? "auth-form-field-reveal" : ""} ${className}`}
      style={staggerStyle}
    >
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-ink dark:text-paper mb-3 transition-colors group-focus-within:text-terracotta"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 transition-all duration-300 ${
                isFocused ? "text-terracotta" : "text-coffee/60 dark:text-latte/70"
              }`}
            />
          </div>
        )}

        <input
          type={isPasswordField ? (shouldShowPassword ? "text" : "password") : type}
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-12 ${inputPadRight} py-4 border-2 rounded-2xl transition-all duration-300 ease-out text-lg
            bg-sand/60 dark:bg-ink/50 text-ink dark:text-paper
            placeholder:text-coffee/60 dark:placeholder:text-latte/60
            focus:bg-white dark:focus:bg-ink/70 focus:ring-4 focus:ring-brass/25 focus:border-terracotta
            ${
              isFocused
                ? "border-terracotta shadow-lg shadow-terracotta/10 motion-safe:scale-[1.01]"
                : "border-coffee/[0.08] dark:border-white/15 hover:border-terracotta/45"
            }`}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee/60 dark:text-latte/70 hover:text-terracotta transition-all duration-300 p-1 rounded-lg hover:bg-terracotta/10 dark:hover:bg-terracotta/20"
          >
            {shouldShowPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        )}
        
        {/* Validation icon */}
        {showValidCheck && isPasswordField && (
          <div className="pointer-events-none absolute inset-y-0 right-[3.15rem] flex items-center">
            <FaCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 auth-validation-check-enter" />
          </div>
        )}
        {showValidCheck && !isPasswordField && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <FaCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 auth-validation-check-enter" />
          </div>
        )}
      </div>
    </div>
  );
}
