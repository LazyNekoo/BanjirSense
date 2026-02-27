export type UserProfile = {
  uid: string;
  fullName?: string;
  icNumber?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  emergencyMedical?: {
    allergies?: string;
    medicalHistory?: string;
    bloodType?: string;
  };
  createdAt?: any;
  updatedAt?: any;
};

export type Dependent = {
  id: string;
  fullName?: string;
  relationship?: string;
  triageTag?: string;
  nricNumber?: string;
  allergies?: string;
  medicalHistory?: string;
  bloodType?: string;
  criticalMedications?: string;
  createdAt?: any;
  updatedAt?: any;
};