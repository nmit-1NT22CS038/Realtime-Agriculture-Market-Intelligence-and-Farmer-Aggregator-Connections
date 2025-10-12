import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import LandingPage from "./components/LandingPage";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";

// ✅ Import Firebase setup
import { auth, db } from "./config/firebaseConfig";

const App = () => {
  const [view, setView] = useState("home");

  const showNotification = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  const renderPage = () => {
    switch (view) {
      case "login":
        return <LoginForm auth={auth} db={db} setView={setView} showNotification={showNotification} />;
      case "signup":
        return <SignUpForm auth={auth} db={db} setView={setView} showNotification={showNotification} />;
      case "dashboard":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Welcome to AgriLink Dashboard 🌾</h1>
            <button
              onClick={() => setView("home")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Go Back to Home
            </button>
          </div>
        );
      default:
        return <LandingPage setView={setView} />;
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      {renderPage()}
    </div>
  );
};

export default App;
