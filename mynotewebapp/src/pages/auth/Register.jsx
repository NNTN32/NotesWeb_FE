import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import AuthForm from "../../components/AuthForm";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError("");

    try {
      // Simple validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Mật khẩu xác nhận không khớp");
      }

      if (formData.password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - replace with actual API call
      const userData = {
        id: 1,
        email: formData.email,
        name: formData.name
      };
      
      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      type: "text",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên của bạn",
      required: true,
      autoComplete: "name",
      showValidation: true
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Nhập email của bạn",
      required: true,
      autoComplete: "email",
      showValidation: true
    },
    {
      name: "password",
      type: "password",
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu (ít nhất 6 ký tự)",
      required: true,
      autoComplete: "new-password"
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Xác nhận mật khẩu",
      placeholder: "Nhập lại mật khẩu",
      required: true,
      autoComplete: "new-password",
      showValidation: true
    }
  ];

  return (
    <AuthForm
      title="Đăng ký"
      subtitle="Tạo tài khoản mới để bắt đầu"
      icon={FaUserPlus}
      submitText="Đăng ký"
      submitLoadingText="Đang đăng ký..."
      fields={fields}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      linkConfig={{
        text: "Đã có tài khoản?",
        linkText: "Đăng nhập ngay",
        to: "/login"
      }}
    />
  );
}