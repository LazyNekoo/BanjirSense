import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import { PersonalDetailsScreen } from "./components/PersonalDetailsScreen";
import { EmergencyMedicalScreen } from "./components/EmergencyMedicalScreen";
import { ResetPasswordScreen } from "./components/ResetPasswordScreen";
import { VerifyPasswordScreen } from "./components/VerifyPasswordScreen";
import { PasswordResetSuccessScreen } from "./components/PasswordResetSuccessScreen";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./lib/firebase";
import { apiFetch } from "./lib/api";

import { HomeScreen } from "./components/HomeScreen";
import { RiskAnalysisScreen } from "./components/RiskAnalysisScreen";
import { RoutinePreparednessScreen } from "./components/RoutinePreparednessScreen";
import { PreparednessCompleteScreen } from "./components/PreparednessCompleteScreen";
import { NotificationCenterScreen } from "./components/NotificationCenterScreen";


type AppScreen =
  | "splash"
  | "login"
  | "personalDetails"
  | "emergencyMedical"
  | "registrationComplete"
  | "resetPassword"
  | "verifyPassword"
  | "passwordResetSuccess"
  | "home"
  | "notifications"
  | "riskAnalysis"
  | "routinePreparedness"
  | "preparednessComplete";

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
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    // Auto-transition to login screen after 2.5 seconds
    const timer = setTimeout(() => {
      setCurrentScreen("login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    // prove backend can read token
    const verify = await apiFetch<{
      ok: boolean;
      uid: string;
      email: string | null;
      profileExists: boolean;
      profile: any;
    }>("/auth/verify", { method: "POST" });

    console.log("✅ Backend verify:", verify);

    // later: navigate to home/map screen
    // setCurrentScreen("home");
  };


  const handleLoginSubmit = async (email: string, password: string) => {

    await signInWithEmailAndPassword(auth, email, password);

    const verify = await apiFetch("/auth/verify", { method: "POST" });
    console.log("✅ Backend verify:", verify);

    // later: setCurrentScreen("home");

  };

  const handleRegisterClick = () => {
    console.log("Register clicked - navigating to registration");
    // Navigation to registration screen
    setCurrentScreen("personalDetails");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked - navigating to password reset");
    setCurrentScreen("resetPassword");
  };

  const handleResetPasswordBack = () => {
    console.log("Going back from reset password screen");
    setCurrentScreen("login");
  };

  const handleResetPasswordSendCode = async (email: string) => {
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsResettingPassword(false);
      setCurrentScreen("passwordResetSuccess"); // skip verify screen
    } catch (e: any) {
      setIsResettingPassword(false);
      throw e;
    }
  };

  const handleVerifyPasswordBack = () => {
    console.log("Going back from verify password screen");
    setCurrentScreen("resetPassword");
  };

  const handlePasswordReset = async (_newPassword: string) => {
    console.log("Resetting password");
    setIsResettingPassword(true);
    
    // TODO: Firebase integration - confirmPasswordReset(resetToken, newPassword)
    // Simulate API call
    setTimeout(() => {
      setIsResettingPassword(false);
      setCurrentScreen("passwordResetSuccess");
    }, 1500);
  };

  const handlePasswordResetSuccess = () => {
    console.log("Password reset success - returning to login");
    setResetPasswordEmail("");
    setCurrentScreen("login");
  };

  const handlePersonalDetailsBack = () => {
    console.log("Going back from personal details");
    setCurrentScreen("login");
  };

  const handlePersonalDetailsNext = async (data: any) => {
    // data includes password + confirmPassword from UI
    const { password, confirmPassword, ...profile } = data;

    if (!password || password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // 1) Create Firebase user
    await createUserWithEmailAndPassword(auth, profile.email, password);

    // 2) Save profile to backend (secure, uid comes from token)
    await apiFetch("/me", {
      method: "PUT",
      body: JSON.stringify({
        identityType: profile.identityType,
        icNumber: profile.icNumber || null,
        passportNumber: profile.passportNumber || null,
        countryOfOrigin: profile.countryOfOrigin || null,
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
      }),
    });

    setPersonalDetailsData(profile);
    setCurrentScreen("emergencyMedical");
  };

  const handleEmergencyMedicalBack = () => {
    console.log("Going back from emergency & medical");
    setCurrentScreen("personalDetails");
  };

  const handleEmergencyMedicalComplete = async (data: EmergencyMedicalData) => {
    // store as part of user profile (simplest)
    await apiFetch("/me", {
      method: "PUT",
      body: JSON.stringify({
        emergencyMedical: {
          hasDisability: data.hasDisability,
          hasYoungChildren: data.hasYoungChildren,
          bloodType: data.bloodType,
          allergies: data.allergies,
          medicalHistory: data.medicalHistory,
        },
      }),
    });

    setCurrentScreen("registrationComplete");
  };

  const handleViewDetailedAnalysis = () => {
    setCurrentScreen("riskAnalysis");
  };

  const handleOpenNotifications = () => {
    setCurrentScreen("notifications");
  };

  const handleCloseNotifications = () => {
    setCurrentScreen("home");
  };

  const handleCloseRiskAnalysis = () => {
    setCurrentScreen("home");
  };

  const handleOpenRoutinePreparedness = () => {
    setCurrentScreen("routinePreparedness");
  };

  const handleRoutinePreparednessBack = () => {
    setCurrentScreen("home");
  };

  const handleRoutinePreparednessSubmit = () => {
    setCurrentScreen("preparednessComplete");
  };

  const handlePreparednessCompleteBack = () => {
    setCurrentScreen("home");
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
      {currentScreen === "resetPassword" && (
        <ResetPasswordScreen
          onBack={handleResetPasswordBack}
          onSendCode={handleResetPasswordSendCode}
          isLoading={isResettingPassword}
        />
      )}
      {currentScreen === "verifyPassword" && (
        <VerifyPasswordScreen
          onBack={handleVerifyPasswordBack}
          onSuccess={handlePasswordReset}
          email={resetPasswordEmail}
          isLoading={isResettingPassword}
        />
      )}
      {currentScreen === "passwordResetSuccess" && (
        <PasswordResetSuccessScreen onContinue={handlePasswordResetSuccess} />
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
      {currentScreen === "home" && (
        <HomeScreen
          onViewDetailedAnalysis={handleViewDetailedAnalysis}
          onViewRoutineChecklist={handleOpenRoutinePreparedness}
          onOpenNotifications={handleOpenNotifications}
        />
      )}
      {currentScreen === "notifications" && (
        <NotificationCenterScreen onBack={handleCloseNotifications} />
      )}
      {currentScreen === "riskAnalysis" && (
        <RiskAnalysisScreen onClose={handleCloseRiskAnalysis} />
      )}
      {currentScreen === "routinePreparedness" && (
        <RoutinePreparednessScreen
          onBack={handleRoutinePreparednessBack}
          onSubmit={handleRoutinePreparednessSubmit}
        />
      )}
      {currentScreen === "preparednessComplete" && (
        <PreparednessCompleteScreen onBackToHome={handlePreparednessCompleteBack} />
      )}
    </>
  );
}

export default App;
