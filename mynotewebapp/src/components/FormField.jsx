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
  ...props
}) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  
  const isPasswordField = type === "password";
  const shouldShowPassword = isPasswordField && (showPassword !== undefined ? showPassword : internalShowPassword);
  
  const handleTogglePassword = () => {
    if (onTogglePassword) {
      onTogglePassword();
    } else {
      setInternalShowPassword(!internalShowPassword);
    }
  };

  return (
    <div className={`group ${className}`}>
      <label 
        htmlFor={name} 
        className="block text-sm font-semibold text-gray-700 mb-3 transition-colors group-focus-within:text-terracotta"
      >
        {label}
      </label>
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 transition-all duration-300 ${
              isFocused ? 'text-terracotta' : 'text-gray-400'
            }`} />
          </div>
        )}
        
        {/* Input */}
        <input
          type={isPasswordField ? (shouldShowPassword ? "text" : "password") : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-lg bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-brass/20 focus:border-terracotta ${
            isFocused 
              ? 'border-terracotta shadow-lg shadow-terracotta/10' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          {...props}
        />
        
        {/* Password toggle button */}
        {isPasswordField && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-terracotta transition-all duration-300 p-1 rounded-lg hover:bg-gray-100"
          >
            {shouldShowPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        )}
        
        {/* Validation icon */}
        {showValidation && value && isValid && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <FaCheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
