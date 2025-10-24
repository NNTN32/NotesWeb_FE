import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import FormField from "./FormField";

/**
 * Reusable AuthForm component with enhanced animations
 * @param {Object} props - Component props
 * @param {string} props.title - Form title
 * @param {string} props.subtitle - Form subtitle
 * @param {string} props.icon - Icon component
 * @param {string} props.submitText - Submit button text
 * @param {string} props.submitLoadingText - Loading text
 * @param {Array} props.fields - Array of field configurations
 * @param {Function} props.onSubmit - Submit handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Object} props.linkConfig - Link configuration for navigation
 */
export default function AuthForm({
  title,
  subtitle,
  icon: Icon,
  submitText,
  submitLoadingText,
  fields = [],
  onSubmit,
  isLoading = false,
  error = "",
  linkConfig = {}
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [fieldFocus, setFieldFocus] = useState({});
  const [formData, setFormData] = useState({});
  const [showPasswords, setShowPasswords] = useState({});

  // Initialize form data and field focus state
  useEffect(() => {
    const initialFormData = {};
    const initialFieldFocus = {};
    const initialShowPasswords = {};
    
    fields.forEach(field => {
      initialFormData[field.name] = field.value || "";
      initialFieldFocus[field.name] = false;
      if (field.type === "password") {
        initialShowPasswords[field.name] = false;
      }
    });
    
    setFormData(initialFormData);
    setFieldFocus(initialFieldFocus);
    setShowPasswords(initialShowPasswords);
  }, [fields]);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (fieldName) => {
    setFieldFocus(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFieldFocus(prev => ({ ...prev, [fieldName]: false }));
  };

  const handleTogglePassword = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getFieldIcon = (field) => {
    switch (field.name) {
      case "email":
        return FaEnvelope;
      case "password":
      case "confirmPassword":
        return FaLock;
      case "name":
        return FaUser;
      default:
        return null;
    }
  };

  const isFieldValid = (field) => {
    const value = formData[field.name];
    if (!value) return false;
    
    switch (field.name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "password":
        return value.length >= 6;
      case "confirmPassword":
        return value === formData.password;
      default:
        return value.length > 0;
    }
  };

  return (
    <div className="auth-pattern-bg min-h-screen flex items-center justify-center px-4 py-8">
      {/* Enhanced Floating geometric shapes with animation */}
      <div className="floating-shape animate-float-1"></div>
      <div className="floating-shape animate-float-2"></div>
      <div className="floating-shape animate-float-3"></div>
      <div className="floating-shape animate-float-4"></div>
      <div className="floating-shape animate-float-5"></div>
      
      <div className={`w-full max-w-md relative z-10 transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Enhanced Header with animation */}
        <div className="text-center mb-8">
          <div className={`mx-auto w-20 h-20 bg-gradient-to-r from-terracotta to-brass rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
          }`}>
            <Icon className="text-white text-3xl" />
          </div>
          <div className={`mx-auto h-1 w-16 bg-gradient-to-r from-terracotta to-brass rounded-full mb-6 transform transition-all duration-700 delay-200 ${
            isVisible ? 'scale-x-100' : 'scale-x-0'
          }`} />
          <h1 className={`text-4xl font-bold text-gray-900 mb-3 transform transition-all duration-500 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {title}
          </h1>
          <p className={`text-gray-700 text-lg transform transition-all duration-500 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {subtitle}
          </p>
        </div>

        {/* Enhanced Form with glassmorphism effect */}
        <div className={`bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl text-red-700 text-sm animate-shake">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, index) => (
              <FormField
                key={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(field.name)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                required={field.required}
                autoComplete={field.autoComplete}
                label={field.label}
                icon={getFieldIcon(field)}
                isFocused={fieldFocus[field.name]}
                showPassword={showPasswords[field.name]}
                onTogglePassword={() => handleTogglePassword(field.name)}
                showValidation={field.showValidation}
                isValid={isFieldValid(field)}
              />
            ))}

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-terracotta to-brass text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-terracotta/25 focus:ring-4 focus:ring-brass/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    {submitLoadingText}
                  </>
                ) : (
                  <>
                    <Icon className="mr-3" />
                    {submitText}
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brass to-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Enhanced Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-6 text-sm text-gray-500 font-medium">hoặc</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Enhanced Navigation Link */}
          {linkConfig.text && linkConfig.to && (
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                {linkConfig.text}{" "}
                <Link 
                  to={linkConfig.to} 
                  className="text-terracotta hover:text-brass font-bold underline decoration-2 underline-offset-4 transition-all duration-300 hover:decoration-brass hover:underline-offset-2"
                >
                  {linkConfig.linkText}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
