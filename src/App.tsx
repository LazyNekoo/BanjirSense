import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";

type AppScreen = "splash" | "login";

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");

  useEffect(() => {
    // Auto-transition to login screen after 2.5 seconds
    const timer = setTimeout(() => {
      setCurrentScreen("login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = async () => {
    console.log("Google login initiated");
    // Firebase GoogleAuthProvider integration point
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
    // Firebase email/password authentication integration point
  };

  const handleRegisterClick = () => {
    console.log("Register clicked");
    // Navigation to registration screen
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Navigation to password reset screen
  };

  return (
    <>
      {currentScreen === "splash" && <SplashScreen />}
      {currentScreen === "login" && (
        <LoginScreen
          onGoogleLogin={handleGoogleLogin}
          onLoginSubmit={handleLoginSubmit}
          onRegisterClick={handleRegisterClick}
          onForgotPassword={handleForgotPassword}
        />
      )}
    </>
  );
}

export default App;
