import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import AuthForm from "../../components/AuthForm";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      // Mock login - replace with actual API call
      const userData = {
        id: 1,
        email: formData.email,
        name: "User"
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
      placeholder: "Nhập mật khẩu",
      required: true,
      autoComplete: "current-password"
    }
  ];

  return (
    <AuthForm
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại"
      icon={FaSignInAlt}
      submitText="Đăng nhập"
      submitLoadingText="Đang đăng nhập..."
      fields={fields}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      linkConfig={{
        text: "Chưa có tài khoản?",
        linkText: "Đăng ký ngay",
        to: "/register"
      }}
    />
  );
}
