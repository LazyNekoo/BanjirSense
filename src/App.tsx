import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import { PersonalDetailsScreen } from "./components/PersonalDetailsScreen";
import { EmergencyMedicalScreen } from "./components/EmergencyMedicalScreen";

type AppScreen = "splash" | "login" | "personalDetails" | "emergencyMedical" | "registrationComplete";

interface PersonalDetailsData {
  identityType: 'local' | 'international';
  icNumber?: string;
  passportNumber?: string;
  fullName: string;
  countryOfOrigin?: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface EmergencyMedicalData {
  hasDisability: boolean;
  hasYoungChildren: boolean;
  bloodType: string;
  allergies: string;
  medicalHistory: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [personalDetailsData, setPersonalDetailsData] = useState<PersonalDetailsData | null>(null);

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
    // TODO: After successful authentication, navigate to homescreen
    // For now, just log the attempt - homescreen not yet created
  };

  const handleRegisterClick = () => {
    console.log("Register clicked - navigating to registration");
    // Navigation to registration screen
    setCurrentScreen("personalDetails");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Navigation to password reset screen
  };

  const handlePersonalDetailsBack = () => {
    console.log("Going back from personal details");
    setCurrentScreen("login");
  };

  const handlePersonalDetailsNext = (data: PersonalDetailsData) => {
    console.log("Personal details completed:", data);
    // Firebase integration point - save personal details
    setPersonalDetailsData(data);
    setCurrentScreen("emergencyMedical");
  };

  const handleEmergencyMedicalBack = () => {
    console.log("Going back from emergency & medical");
    setCurrentScreen("personalDetails");
  };

  const handleEmergencyMedicalComplete = (data: EmergencyMedicalData) => {
    console.log("Emergency & medical completed:", data);
    console.log("Full registration data:", {
      personalDetails: personalDetailsData,
      emergencyMedical: data,
    });
    // Firebase integration point - complete user registration
    // Save combined data to database
    setCurrentScreen("registrationComplete");
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
      {currentScreen === "personalDetails" && (
        <PersonalDetailsScreen
          onBack={handlePersonalDetailsBack}
          onNext={handlePersonalDetailsNext}
        />
      )}
      {currentScreen === "emergencyMedical" && (
        <EmergencyMedicalScreen
          onBack={handleEmergencyMedicalBack}
          onComplete={handleEmergencyMedicalComplete}
        />
      )}
      {currentScreen === "registrationComplete" && (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 md:p-6">
          <div className="w-full max-w-[390px] h-screen md:h-[900px] md:max-h-[90vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center relative border border-slate-200">
            <div className="text-center px-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-trust-green/10 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-trust-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-dark-navy">Registration Complete</h1>
              <p className="text-slate-600 leading-relaxed">
                Your account has been successfully created. Your data is secure with government-grade encryption.
              </p>
              <button
                onClick={() => setCurrentScreen("login")}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98] transition-all mt-8"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
