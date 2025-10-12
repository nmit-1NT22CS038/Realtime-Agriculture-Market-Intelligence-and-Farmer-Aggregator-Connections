import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
//import Footer from "./components/Footer";

const App = ({ auth, db, showNotification }) => {
  const [view, setView] = useState("landing");

  const renderView = () => {
    switch (view) {
      case "landing":
        return <LandingPage setView={setView} />;
      case "login":
        return (
          <LoginForm
            auth={auth}
            setView={setView}
            showNotification={showNotification}
          />
        );
      case "signup":
        return (
          <SignUpForm
            auth={auth}
            db={db}
            setView={setView}
            showNotification={showNotification}
          />
        );
      default:
        return <LandingPage setView={setView} />;
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col">
      <div className="flex-grow">{renderView()}</div>
    </div>
  );
};

export default App;
