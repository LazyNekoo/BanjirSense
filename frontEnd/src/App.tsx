import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import { PersonalDetailsScreen } from "./components/PersonalDetailsScreen";
import { EmergencyMedicalScreen } from "./components/EmergencyMedicalScreen";
import { ResetPasswordScreen } from "./components/ResetPasswordScreen";
import { VerifyPasswordScreen } from "./components/VerifyPasswordScreen";
import { PasswordResetSuccessScreen } from "./components/PasswordResetSuccessScreen";
import { HomeScreen } from "./components/HomeScreen";
import { RiskAnalysisScreen } from "./components/RiskAnalysisScreen";
import { RoutinePreparednessScreen } from "./components/RoutinePreparednessScreen";
import { PreparednessCompleteScreen } from "./components/PreparednessCompleteScreen";
import { NotificationCenterScreen } from "./components/NotificationCenterScreen";
import { UserProfileScreen } from "./components/UserProfileScreen";
import { EditPhoneNumberScreen } from "./components/EditPhoneNumberScreen";
import { VerifyPhoneNumberScreen } from "./components/VerifyPhoneNumberScreen";
import { PhoneUpdateSuccessScreen } from "./components/PhoneUpdateSuccessScreen";
import { EditEmailAddressScreen } from "./components/EditEmailAddressScreen";
import { VerifyEmailAddressScreen } from "./components/VerifyEmailAddressScreen";
import { EmailUpdateSuccessScreen } from "./components/EmailUpdateSuccessScreen";
import { EditHomeAddressScreen } from "./components/EditHomeAddressScreen";
import { HomeAddressUpdateSuccessScreen } from "./components/HomeAddressUpdateSuccessScreen";

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
  | "profile"
  | "notifications"
  | "riskAnalysis"
  | "routinePreparedness"
  | "preparednessComplete"
  | "editPhoneNumber"
  | "verifyPhoneNumber"
  | "phoneUpdateSuccess"
  | "editEmailAddress"
  | "verifyEmailAddress"
  | "emailUpdateSuccess"
  | "editHomeAddress"
  | "homeAddressUpdateSuccess";

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
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [updatedEmailAddress, setUpdatedEmailAddress] = useState("");
  const [updatedHomeAddress, setUpdatedHomeAddress] = useState("");

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
    setCurrentScreen("home");
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
    console.log("Sending verification code to:", email);
    setResetPasswordEmail(email);
    setIsResettingPassword(true);
    
    // TODO: Firebase integration - sendPasswordResetEmail(email)
    // Simulate API call
    setTimeout(() => {
      setIsResettingPassword(false);
      setCurrentScreen("verifyPassword");
    }, 1500);
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

  const handleOpenProfile = () => {
    setCurrentScreen("profile");
  };

  const handleProfileNavigate = (screen: string) => {
    switch (screen) {
      case "home":
        setCurrentScreen("home");
        break;
      case "map":
        // TODO: Implement map navigation
        console.log("Map navigation");
        break;
      case "updates":
        setCurrentScreen("notifications");
        break;
      case "profile":
        // Already on profile
        break;
      default:
        setCurrentScreen(screen as AppScreen);
    }
  };

  const handleAddDependent = () => {
    console.log("Add dependent clicked");
    // TODO: Open add dependent modal/screen
  };

  const handleEditDependent = (dependentId: string) => {
    console.log("Edit dependent:", dependentId);
    // TODO: Open edit dependent modal/screen
  };

  const handleProfileSettings = () => {
    console.log("Profile settings clicked");
    // TODO: Open settings screen
  };

  const handleProfileHelp = () => {
    console.log("Help clicked");
    // TODO: Open help screen
  };

  const handleProfileLogout = () => {
    console.log("Logout clicked");
    setCurrentScreen("login");
  };

  const handleEditPhoneClick = () => {
    console.log("Edit phone number clicked");
    setCurrentScreen("editPhoneNumber");
  };

  const handleEditEmailClick = () => {
    console.log("Edit email address clicked");
    setCurrentScreen("editEmailAddress");
  };

  const handleEditHomeAddressClick = () => {
    console.log("Edit home address clicked");
    setCurrentScreen("editHomeAddress");
  };

  const handleEditPhoneNumberBack = () => {
    setCurrentScreen("profile");
  };

  const handleEditPhoneNumberVerify = (phoneNumber: string) => {
    console.log("Verifying phone number:", phoneNumber);
    setUpdatedPhoneNumber(phoneNumber);
    // TODO: Firebase integration - send OTP to phone number
    setCurrentScreen("verifyPhoneNumber");
  };

  const handleVerifyPhoneNumberBack = () => {
    setCurrentScreen("editPhoneNumber");
  };

  const handleVerifyPhoneNumberConfirm = (code: string) => {
    console.log("OTP verification code:", code);
    // TODO: Firebase integration - verify OTP and update phone number
    setCurrentScreen("phoneUpdateSuccess");
  };

  const handlePhoneUpdateSuccessRedirect = () => {
    console.log("Redirecting to profile after phone update");
    setCurrentScreen("profile");
  };

  const handlePhoneUpdateNavigate = (screen: string) => {
    handleProfileNavigate(screen);
  };

  const handleEditEmailAddressBack = () => {
    setCurrentScreen("profile");
  };

  const handleEditEmailAddressSave = (email: string) => {
    console.log("Verifying email address:", email);
    setUpdatedEmailAddress(email);
    // TODO: Firebase integration - send email verification link/code
    setCurrentScreen("verifyEmailAddress");
  };

  const handleVerifyEmailAddressBack = () => {
    setCurrentScreen("editEmailAddress");
  };

  const handleVerifyEmailAddressConfirm = (code: string) => {
    console.log("Email verification code:", code);
    // TODO: Firebase integration - verify code and update email address
    setCurrentScreen("emailUpdateSuccess");
  };

  const handleEmailUpdateSuccessRedirect = () => {
    console.log("Redirecting to profile after email update");
    setCurrentScreen("profile");
  };

  const handleEmailUpdateNavigate = (screen: string) => {
    handleProfileNavigate(screen);
  };

  const handleEditHomeAddressBack = () => {
    setCurrentScreen("profile");
  };

  const handleEditHomeAddressSave = (address: string) => {
    console.log("Updating home address:", address);
    setUpdatedHomeAddress(address);
    // TODO: Firebase integration - update address with map/location payload
    setCurrentScreen("homeAddressUpdateSuccess");
  };

  const handleHomeAddressUpdateSuccessRedirect = () => {
    console.log("Redirecting to profile after home address update");
    setCurrentScreen("profile");
  };

  const handleHomeAddressNavigate = (screen: string) => {
    handleProfileNavigate(screen);
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
          onOpenProfile={handleOpenProfile}
        />
      )}
      {currentScreen === "profile" && (
        <UserProfileScreen
          onEditEmailAddress={handleEditEmailClick}
          onEditPhoneNumber={handleEditPhoneClick}
          onEditHomeAddress={handleEditHomeAddressClick}
          onAddDependent={handleAddDependent}
          onEditDependent={handleEditDependent}
          onSettings={handleProfileSettings}
          onHelp={handleProfileHelp}
          onLogout={handleProfileLogout}
          onNavigate={handleProfileNavigate}
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
      {currentScreen === "editPhoneNumber" && (
        <EditPhoneNumberScreen
          onBack={handleEditPhoneNumberBack}
          onVerify={handleEditPhoneNumberVerify}
          onNavigate={handlePhoneUpdateNavigate}
        />
      )}
      {currentScreen === "verifyPhoneNumber" && (
        <VerifyPhoneNumberScreen
          onBack={handleVerifyPhoneNumberBack}
          onConfirm={handleVerifyPhoneNumberConfirm}
          onNavigate={handlePhoneUpdateNavigate}
          phoneNumber={updatedPhoneNumber}
        />
      )}
      {currentScreen === "phoneUpdateSuccess" && (
        <PhoneUpdateSuccessScreen
          onNavigate={handlePhoneUpdateNavigate}
          onRedirectComplete={handlePhoneUpdateSuccessRedirect}
        />
      )}
      {currentScreen === "editEmailAddress" && (
        <EditEmailAddressScreen
          onBack={handleEditEmailAddressBack}
          onSave={handleEditEmailAddressSave}
          onNavigate={handleEmailUpdateNavigate}
        />
      )}
      {currentScreen === "verifyEmailAddress" && (
        <VerifyEmailAddressScreen
          onBack={handleVerifyEmailAddressBack}
          onConfirm={handleVerifyEmailAddressConfirm}
          onNavigate={handleEmailUpdateNavigate}
          email={updatedEmailAddress}
        />
      )}
      {currentScreen === "emailUpdateSuccess" && (
        <EmailUpdateSuccessScreen
          onNavigate={handleEmailUpdateNavigate}
          onRedirectComplete={handleEmailUpdateSuccessRedirect}
        />
      )}
      {currentScreen === "editHomeAddress" && (
        <EditHomeAddressScreen
          onBack={handleEditHomeAddressBack}
          onSave={handleEditHomeAddressSave}
          onNavigate={handleHomeAddressNavigate}
          initialAddress={updatedHomeAddress || undefined}
        />
      )}
      {currentScreen === "homeAddressUpdateSuccess" && (
        <HomeAddressUpdateSuccessScreen
          onNavigate={handleHomeAddressNavigate}
          onRedirectComplete={handleHomeAddressUpdateSuccessRedirect}
        />
      )}
    </>
  );
}

export default App;
