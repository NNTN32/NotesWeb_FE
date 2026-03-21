import { useState, useEffect, useCallback } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

/**
 * Shared auth form logic - state, validation, handlers
 * @param {Array<{ name: string, type?: string }>} fields
 * @param {(data: Record<string, string>) => void} onSubmit
 * @returns Form state and handlers for Login/Register
 */
export function useAuthForm(fields = [], onSubmit) {
  const [formData, setFormData] = useState({});
  const [fieldFocus, setFieldFocus] = useState({});
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    const initial = {};
    const focus = {};
    const pwd = {};
    fields.forEach((f) => {
      initial[f.name] = f.value ?? "";
      focus[f.name] = false;
      if (f.type === "password") pwd[f.name] = false;
    });
    setFormData(initial);
    setFieldFocus(focus);
    setShowPasswords(pwd);
  }, [fields]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFocus = useCallback((name) => {
    setFieldFocus((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((name) => {
    setFieldFocus((prev) => ({ ...prev, [name]: false }));
  }, []);

  const handleTogglePassword = useCallback((name) => {
    setShowPasswords((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const getFieldIcon = useCallback((field) => {
    if (field.name === "email") return FaEnvelope;
    if (field.name === "password" || field.name === "confirmPassword") return FaLock;
    if (field.name === "name" || field.name === "username") return FaUser;
    return null;
  }, []);

  const isFieldValid = useCallback(
    (field) => {
      const value = formData[field.name];
      if (!value) return false;
      if (field.name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (field.name === "confirmPassword") return value === formData.password;
      return value.length > 0;
    },
    [formData]
  );

  return {
    formData,
    fieldFocus,
    showPasswords,
    handleChange,
    handleFocus,
    handleBlur,
    handleTogglePassword,
    handleSubmit,
    getFieldIcon,
    isFieldValid,
  };
}
