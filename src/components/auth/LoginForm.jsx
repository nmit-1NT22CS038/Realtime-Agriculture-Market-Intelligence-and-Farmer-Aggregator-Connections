import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";

const COLOR_PRIMARY = "bg-green-600";
const COLOR_PRIMARY_HOVER = "hover:bg-green-700";

const AuthPageWrapper = ({ children, title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm p-6 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-green-600 transition text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
        <h2 className={`text-2xl font-bold text-green-800 text-center`}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Check email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageWrapper title="Welcome Back">
      <p className="text-sm text-gray-500 text-center -mt-4">Sign in to access your dashboard</p>
      <form onSubmit={handleLogin} className="space-y-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition duration-300 ${COLOR_PRIMARY} ${COLOR_PRIMARY_HOVER} ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")} className="text-green-600 hover:text-green-700 font-bold transition">
          Sign up
        </button>
      </p>
    </AuthPageWrapper>
  );
};

export default LoginForm;
