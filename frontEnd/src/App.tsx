import { useState, useEffect } from "react";
import SplashScreen from "./components/auth/SplashScreen";
import LoginScreen from "./components/auth/LoginScreen";
import { PersonalDetailsScreen } from "./components/auth/PersonalDetailsScreen";
import { EmergencyMedicalScreen } from "./components/profile/EmergencyMedicalScreen";
import { ResetPasswordScreen } from "./components/auth/ResetPasswordScreen";
import { VerifyPasswordScreen } from "./components/auth/VerifyPasswordScreen";
import { PasswordResetSuccessScreen } from "./components/auth/PasswordResetSuccessScreen";
import {GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, } from "firebase/auth";
import { auth } from "./lib/firebase";
import { apiFetch } from "./lib/api";
import { HomeScreen } from "./components/core/HomeScreen";
import { RiskAnalysisScreen } from "./components/core/RiskAnalysisScreen";
import { RoutinePreparednessScreen } from "./components/core/RoutinePreparednessScreen";
import { PreparednessCompleteScreen } from "./components/core/PreparednessCompleteScreen";
import { NotificationCenterScreen } from "./components/core/NotificationCenterScreen";
import { UserProfileScreen } from "./components/core/UserProfileScreen";
import { EditPhoneNumberScreen } from "./components/contact/EditPhoneNumberScreen";
import { VerifyPhoneNumberScreen } from "./components/contact/VerifyPhoneNumberScreen";
import { PhoneUpdateSuccessScreen } from "./components/contact/PhoneUpdateSuccessScreen";
import { EditEmailAddressScreen } from "./components/contact/EditEmailAddressScreen";
import { VerifyEmailAddressScreen } from "./components/contact/VerifyEmailAddressScreen";
import { EmailUpdateSuccessScreen } from "./components/contact/EmailUpdateSuccessScreen";
import { EditHomeAddressScreen } from "./components/contact/EditHomeAddressScreen";
import { HomeAddressUpdateSuccessScreen } from "./components/contact/HomeAddressUpdateSuccessScreen";
import { MedicalSpecialNeedsScreen } from "./components/profile/MedicalSpecialNeedsScreen";
import { MedicalProfileSuccessScreen } from "./components/profile/MedicalProfileSuccessScreen";
import { AddDependentIdentityScreen } from "./components/dependent/AddDependentIdentityScreen";
import { AddDependentTriageScreen } from "./components/dependent/AddDependentTriageScreen";
import { AddDependentMedicalScreen } from "./components/dependent/AddDependentMedicalScreen";
import { AddDependentSuccessScreen } from "./components/dependent/AddDependentSuccessScreen";
import { EncryptionLoadingModal } from "./components/shared/EncryptionLoadingModal";
import { DependentProfileScreen } from "./components/dependent/DependentProfileScreen";
import { EditDependentHub } from "./components/dependent/EditDependentHub";
import { EditDependentSuccessScreen } from "./components/dependent/EditDependentSuccessScreen";
import { AppSettingsScreen } from "./components/core/AppSettingsScreen";
import { HelpSupportScreen } from "./components/core/HelpSupportScreen";
import type { AiRisk, JpsNearbyStation } from "./types/banjirsense";

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
  | "homeAddressUpdateSuccess"
  | "editMedicalProfile"
  | "medicalProfileSuccess"
  | "addDependentStep1"
  | "addDependentStep2"
  | "addDependentStep3"
  | "addDependentSuccess"
  | "dependentProfile"
  | "editDependent"
  | "editDependentSuccess"
  | "appSettings"
  | "helpSupport";

  //For user dependents management
type DependentRecord = {
  id: string;
  fullName: string;
  relationship: string;
  triageTag: string;
  nricNumber: string;
  allergies: string;
  medicalHistory: string;
  criticalMedications: string;
  bloodType: string;
  createdAt?: any;
  updatedAt?: any;
};

async function apiListDependents() {
  const res = await apiFetch<{ ok: boolean; dependents: DependentRecord[] }>("/dependents");
  return res.dependents || [];
}

async function apiCreateDependent(payload: Omit<DependentRecord, "id">) {
  const res = await apiFetch<{ ok: boolean; dependent: DependentRecord }>("/dependents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.dependent;
}

async function apiUpdateDependent(id: string, payload: Partial<Omit<DependentRecord, "id">>) {
  const res = await apiFetch<{ ok: boolean; dependent: DependentRecord }>(`/dependents/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.dependent;
}

//user profile data types
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

interface CurrentDependentData {
  fullName: string;
  relationship: string;
  nricNumber: string;
  triageTag: string;
  allergies: string;
  medicalHistory: string;
  criticalMedications: string;
  bloodType: string;
}

function App() {

  
  const [homeAi, setHomeAi] = useState<AiRisk | null>(null);
  const [homeJps, setHomeJps] = useState<JpsNearbyStation | null>(null);
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<{lat:number; lng:number} | null>(null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [personalDetailsData, setPersonalDetailsData] = useState<PersonalDetailsData | null>(null);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [updatedEmailAddress, setUpdatedEmailAddress] = useState("");
  const [updatedHomeAddress, setUpdatedHomeAddress] = useState("");
  const [medicalProfileData, setMedicalProfileData] = useState({
    allergies: "",
    medicalHistory: "",
    bloodType: "",
  });
  const [currentDependentData, setCurrentDependentData] = useState<Partial<CurrentDependentData>>({});
  const [isEncryptionLoading, setIsEncryptionLoading] = useState(false);
  const [selectedDependentId, setSelectedDependentId] = useState<string | null>(null);
  const [dependents, setDependents] = useState([
    {
      id: '1',
      fullName: 'Salmah binti Hamid',
      relationship: 'Mother',
      triageTag: 'elderly',
      nricNumber: '540212105882',
      allergies: 'Penicillin, Shellfish',
      medicalHistory: 'Hypertension, Requires Wheelchair for long distance',
      bloodType: 'A+',
      criticalMedications: 'Amlodipine (5mg Daily)',
    },
  ]);
  const syncDependentsFromBackend = async () => {
  try {
    const items = await apiListDependents();
    if (items.length > 0) {
      setDependents(items as any); // keep your existing dependents state shape
    }
  } catch (e) {
    console.warn("Dependents sync failed (keeping local):", e);
  }
};
  const [meProfile, setMeProfile] = useState<any | null>(null);
  const syncProfileFromBackend = async () => {
  try {
    const res = await apiFetch<{ ok: boolean; profile: any }>("/me");
    setMeProfile(res.profile || null);
  } catch (e) {
    console.warn("Profile sync failed (keeping local UI defaults):", e);
  }
};

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
    setCurrentScreen("home");
    setTimeout(loadHomeData, 0);

  };


  const handleLoginSubmit = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    const verify = await apiFetch("/auth/verify", { method: "POST" });
    console.log("✅ Backend verify:", verify);

    setCurrentScreen("home");
    setTimeout(loadHomeData, 0);


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

  //Get user's location with browser geolocation API
  const getBrowserLocation = () =>
  new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // Load home screen data (AI risk + JPS stations) when entering home screen
  const loadHomeData = async () => {
    setHomeLoading(true);
    setHomeError(null);

    try {
      let lat = 3.1390;
      let lng = 101.6869;

      try {
        const loc = await getBrowserLocation();
        lat = loc.lat;
        lng = loc.lng;
      } catch (err) {
        console.warn("Geolocation failed, using fallback KL", err);
      }

      const [ai, jps] = await Promise.allSettled([
        apiFetch<any>("/predict-flood", {
          method: "POST",
          body: JSON.stringify({ lat, lng }),
        }),
        apiFetch<any>(`/gov/jps/nearby?lat=${lat}&lng=${lng}&radiusKm=30`),
      ]);

      setUserLoc({ lat, lng });

      // AI
      if (ai.status === "fulfilled") {
        setHomeAi({
          riskLevel: ai.value.riskLevel || ai.value.risk || "LOW",
          hoursAhead: ai.value.hoursAhead,
          riskScore: ai.value.riskScore,
          summary: ai.value.summary,
          tipsBM: ai.value.tipsBM,
        });
      } else {
        setHomeAi(null);
      }

      // JPS
      if (jps.status === "fulfilled") {
        const station =
          jps.value?.station ||
          jps.value?.stations?.[0] ||
          jps.value?.[0] ||
          null;

        setHomeJps(station ? {
              id: station.id ?? undefined,
              name: station.name ?? undefined,
              state: station.state ?? undefined,
              district: station.district ?? undefined,
              lat: station.lat ?? undefined,
              lng: station.lng ?? undefined,
              status: station.status ?? undefined,
              updatedAt: station.updatedAt ?? undefined,
              distanceKm: station.distanceKm ?? undefined,
              waterLevelM: station.waterLevelM ?? null,
              rainfall: station.rainfall ?? null,
            } : null);
      } else {
        setHomeJps(null);
      }
    } catch (e: any) {
      setHomeError(e?.message || "Failed to load home data");
    } finally {
      setHomeLoading(false);
    }
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
  setTimeout(syncProfileFromBackend, 0); 
  setTimeout(syncDependentsFromBackend, 0); 
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
        setCurrentScreen("profile");
        setTimeout(syncProfileFromBackend, 0);
        setTimeout(syncDependentsFromBackend, 0); 
        break;
      default:
        setCurrentScreen(screen as AppScreen);
    }
  };

  const handleAddDependent = () => {
    console.log("Add dependent clicked");
    setCurrentDependentData({});
    setCurrentScreen("addDependentStep1");
  };

  const handleAddDependentStep1Back = () => {
    setCurrentScreen("profile");
  };

  const handleAddDependentStep1Next = (data: {
    fullName: string;
    relationship: string;
    nricNumber: string;
  }) => {
    console.log("Step 1 completed:", data);
    setCurrentDependentData((prev) => ({ ...prev, ...data }));
    setCurrentScreen("addDependentStep2");
  };

  const handleAddDependentStep2Back = () => {
    setCurrentScreen("addDependentStep1");
  };

  const handleAddDependentStep2Next = (data: { triageTag: string }) => {
    console.log("Step 2 completed:", data);
    setCurrentDependentData((prev) => ({ ...prev, ...data }));
    setCurrentScreen("addDependentStep3");
  };

  const handleAddDependentStep3Back = () => {
    setCurrentScreen("addDependentStep2");
  };

  const handleAddDependentStep3Next = (data: {
    allergies: string;
    criticalMedications: string;
    medicalHistory: string;
    bloodType: string;
  }) => {
    console.log("Step 3 completed:", data);
    const updatedData = { ...currentDependentData, ...data };
        (async () => {
      try {
        // only create if we have the minimum required fields
        if (
          updatedData.fullName &&
          updatedData.relationship &&
          updatedData.nricNumber &&
          updatedData.triageTag
        ) {
          await apiCreateDependent({
            fullName: updatedData.fullName,
            relationship: updatedData.relationship,
            nricNumber: updatedData.nricNumber,
            triageTag: updatedData.triageTag,
            allergies: updatedData.allergies || "None",
            medicalHistory: updatedData.medicalHistory || "None",
            criticalMedications: updatedData.criticalMedications || "None",
            bloodType: updatedData.bloodType || "",
          } as any);

          // refresh list (but keep local if it fails)
          await syncDependentsFromBackend();
        }
      } catch (e) {
        console.warn("Create dependent failed (keeping local):", e);
      }
    })();

    setCurrentDependentData(updatedData);
    
    // Show encryption loading modal
    setIsEncryptionLoading(true);
    
    // Simulate encryption and sync (4 second auto-complete)
    setTimeout(() => {
      setIsEncryptionLoading(false);
      setCurrentScreen("addDependentSuccess");
    }, 4000);
    
    // TODO: Firebase integration here - save dependent to Firestore with SHA-256 encryption
    console.log("Dependent payload ready for sync:", updatedData);
  };

  const handleAddDependentSuccessReturn = () => {
    setCurrentDependentData({});
    setCurrentScreen("profile");
  };

  const handleAddDependentSuccessAddAnother = () => {
    setCurrentDependentData({});
    setCurrentScreen("addDependentStep1");
  };

  const handleAddDependentNavigate = (screen: string) => {
    handleProfileNavigate(screen);
  };

  const handleEditDependent = (dependentId: string) => {
    console.log("View dependent profile:", dependentId);
    const dependent = dependents.find(d => d.id === dependentId);
    if (dependent) {
      setSelectedDependentId(dependentId);
      setCurrentScreen("dependentProfile");
    }
  };

  const handleDependentProfileEdit = () => {
    if (selectedDependentId) {
      setCurrentScreen("editDependent");
    }
  };

  const handleDependentProfileBack = () => {
    setCurrentScreen("profile");
    setSelectedDependentId(null);
  };

  const handleEditDependentBack = () => {
    setCurrentScreen("dependentProfile");
  };

  const handleEditDependentSave = (data: {
    dependentName: string;
    relationship: string;
    nricNumber: string;
    triageTag: string;
    allergies: string;
    medicalHistory: string;
    bloodType: string;
    criticalMedications: string;
  }) => {
    if (selectedDependentId) {
      // Update dependent in list
      setDependents(prev => 
        prev.map(d => d.id === selectedDependentId 
          ? {
              ...d,
              fullName: data.dependentName,
              relationship: data.relationship,
              nricNumber: data.nricNumber,
              triageTag: data.triageTag,
              allergies: data.allergies,
              medicalHistory: data.medicalHistory,
              bloodType: data.bloodType,
              criticalMedications: data.criticalMedications,
            }
          : d
        )
      );

        (async () => {
      try {
        await apiUpdateDependent(selectedDependentId, {
          fullName: data.dependentName,
          relationship: data.relationship,
          nricNumber: data.nricNumber,
          triageTag: data.triageTag,
          allergies: data.allergies,
          medicalHistory: data.medicalHistory,
          bloodType: data.bloodType,
          criticalMedications: data.criticalMedications,
        });

        await syncDependentsFromBackend();
      } catch (e) {
        console.warn("Update dependent failed (keeping local):", e);
      }
    })();
      
      // Show encryption loading modal
      setIsEncryptionLoading(true);
      
      setTimeout(() => {
        setIsEncryptionLoading(false);
        setCurrentScreen("editDependentSuccess");
      }, 4000);
      
      console.log("Dependent updated:", data);
    }

    
  };

  const handleEditDependentSuccessBack = () => {
    setSelectedDependentId(null);
    setCurrentScreen("profile");
  };

  const handleDependentNavigate = (screen: string) => {
    handleProfileNavigate(screen);
  };

  const handleProfileSettings = () => {
    console.log("Profile settings clicked");
    setCurrentScreen("appSettings");
  };

  const handleProfileHelp = () => {
    console.log("Help clicked");
    setCurrentScreen("helpSupport");
  };

  const handleAppSettingsBack = () => {
    setCurrentScreen("profile");
  };

  const handleHelpSupportBack = () => {
    setCurrentScreen("profile");
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

  const handleEditMedicalProfileClick = () => {
    console.log("Edit medical profile clicked");
    setCurrentScreen("editMedicalProfile");
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

  const handleEditMedicalProfileBack = () => {
    setCurrentScreen("profile");
  };

  const handleEditMedicalProfileSave = (data: {
    allergies: string;
    medicalHistory: string;
    bloodType: string;
  }) => {
    console.log("Updating medical profile:", data);
    setMedicalProfileData(data);
    // TODO: Firebase integration - update medical profile data
    setCurrentScreen("medicalProfileSuccess");
  };

  const handleMedicalProfileSuccessRedirect = () => {
    console.log("Redirecting to profile after medical update");
    setCurrentScreen("profile");
  };

  const handleMedicalProfileNavigate = (screen: string) => {
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
          ai={homeAi}
          jps={homeJps}
          isLoading={homeLoading}
          error={homeError}
          onRefresh={loadHomeData}
        />
      )}
      {currentScreen === "profile" && (
        <UserProfileScreen
          profile={meProfile} 
          dependents={dependents.map(d => ({
            id: d.id,
            fullName: d.fullName,
            relationship: d.relationship,
            triageTag: d.triageTag,
          }))}
          onEditEmailAddress={handleEditEmailClick}
          onEditPhoneNumber={handleEditPhoneClick}
          onEditHomeAddress={handleEditHomeAddressClick}
          onEditMedicalProfile={handleEditMedicalProfileClick}
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
          <RiskAnalysisScreen
            onClose={handleCloseRiskAnalysis}
            ai={homeAi}
            jps={homeJps}
          />
        )}
      {currentScreen === "routinePreparedness" && (
        <RoutinePreparednessScreen
          onBack={handleRoutinePreparednessBack}
          onSubmit={handleRoutinePreparednessSubmit}
          ai={homeAi} 
          userLoc={userLoc}
         
        />
      )}
      {currentScreen === "preparednessComplete" && (
        <PreparednessCompleteScreen onBackToHome={handlePreparednessCompleteBack}
        ai={homeAi}
         />
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
      {currentScreen === "editMedicalProfile" && (
        <MedicalSpecialNeedsScreen
          onBack={handleEditMedicalProfileBack}
          onSave={handleEditMedicalProfileSave}
          onNavigate={handleMedicalProfileNavigate}
          initialAllergies={medicalProfileData.allergies}
          initialMedicalHistory={medicalProfileData.medicalHistory}
          initialBloodType={medicalProfileData.bloodType}
        />
      )}
      {currentScreen === "medicalProfileSuccess" && (
        <MedicalProfileSuccessScreen
          onNavigate={handleMedicalProfileNavigate}
          onRedirectComplete={handleMedicalProfileSuccessRedirect}
        />
      )}
      {currentScreen === "addDependentStep1" && (
        <AddDependentIdentityScreen
          onBack={handleAddDependentStep1Back}
          onNext={handleAddDependentStep1Next}
          onNavigate={handleAddDependentNavigate}
        />
      )}
      {currentScreen === "addDependentStep2" && (
        <AddDependentTriageScreen
          onBack={handleAddDependentStep2Back}
          onNext={handleAddDependentStep2Next}
          onNavigate={handleAddDependentNavigate}
        />
      )}
      {currentScreen === "addDependentStep3" && (
        <>
          <EncryptionLoadingModal
            isOpen={isEncryptionLoading}
            onComplete={() => setIsEncryptionLoading(false)}
          />
          <AddDependentMedicalScreen
            onBack={handleAddDependentStep3Back}
            onNext={handleAddDependentStep3Next}
            onNavigate={handleAddDependentNavigate}
          />
        </>
      )}
      {currentScreen === "addDependentSuccess" && (
        <AddDependentSuccessScreen
          dependentName={currentDependentData.fullName || "Your Dependent"}
          onReturn={handleAddDependentSuccessReturn}
          onAddAnother={handleAddDependentSuccessAddAnother}
          onNavigate={handleAddDependentNavigate}
        />
      )}
      {currentScreen === "dependentProfile" && selectedDependentId && (() => {
        const dependent = dependents.find(d => d.id === selectedDependentId);
        return dependent ? (
          <DependentProfileScreen
            dependentName={dependent.fullName}
            relationship={dependent.relationship}
            triageTag={dependent.triageTag}
            nricNumber={dependent.nricNumber}
            allergies={dependent.allergies}
            medicalHistory={dependent.medicalHistory}
            bloodType={dependent.bloodType}
            criticalMedications={dependent.criticalMedications}
            onBack={handleDependentProfileBack}
            onEdit={() => handleDependentProfileEdit()}
            onNavigate={handleDependentNavigate}
          />
        ) : null;
      })()}
      {currentScreen === "editDependent" && selectedDependentId && (() => {
        const dependent = dependents.find(d => d.id === selectedDependentId);
        return dependent ? (
          <>
            <EncryptionLoadingModal
              isOpen={isEncryptionLoading}
              onComplete={() => setIsEncryptionLoading(false)}
            />
            <EditDependentHub
              dependentName={dependent.fullName}
              relationship={dependent.relationship}
              nricNumber={dependent.nricNumber}
              triageTag={dependent.triageTag}
              allergies={dependent.allergies}
              medicalHistory={dependent.medicalHistory}
              bloodType={dependent.bloodType}
              criticalMedications={dependent.criticalMedications}
              onBack={handleEditDependentBack}
              onSave={handleEditDependentSave}
              onNavigate={handleDependentNavigate}
            />
          </>
        ) : null;
      })()}
      {currentScreen === "editDependentSuccess" && selectedDependentId && (() => {
        const dependent = dependents.find(d => d.id === selectedDependentId);
        return dependent ? (
          <EditDependentSuccessScreen
            dependentName={dependent.fullName}
            onBackClick={handleEditDependentSuccessBack}
          />
        ) : null;
      })()}
      {currentScreen === "appSettings" && (
        <AppSettingsScreen
          onBack={handleAppSettingsBack}
          onNavigate={handleProfileNavigate}
        />
      )}
      {currentScreen === "helpSupport" && (
        <HelpSupportScreen
          onBack={handleHelpSupportBack}
          onNavigate={handleProfileNavigate}
        />
      )}
    </>
  );
}

export default App;
