
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthHeader from "../components/Auth/AuthHeader";
import LoginForm from "../components/Auth/LoginForm";
import DarkModeToggle from "../components/Auth/DarkModeToggle";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <DarkModeToggle />
      
      <div className="w-full max-w-md space-y-8">
        <AuthHeader 
          title="Welcome to NeuroShare"
          subtitle="Sign in to your account"
        />
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
