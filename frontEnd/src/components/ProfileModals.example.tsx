// Integration Example: User Profile with Edit Modals
// This shows how to extend the UserProfileScreen with edit functionality

import React, { useState } from 'react';
import { UserProfileScreen } from './UserProfileScreen';

interface EditProfileModalProps {
  isOpen: boolean;
  userData: UserData;
  onClose: () => void;
  onSave: (data: UserData) => void;
  isLoading?: boolean;
}

interface UserData {
  name: string;
  nric: string;
  phone: string;
  email: string;
  address: string;
  allergies: string;
  medicalHistory: string;
  bloodType: string;
}

interface DependentData {
  id: string;
  name: string;
  relationship: string;
  badges: string[];
  dateOfBirth?: string;
}

/**
 * Example: Edit Profile Modal Component
 * This would be a separate modal component that handles editing user profiles
 */
export const EditProfileModal = ({
  isOpen,
  userData,
  onClose,
  onSave,
  isLoading = false,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState(userData);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="w-full md:w-96 bg-white rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* NRIC */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              NRIC *
            </label>
            <input
              type="text"
              value={formData.nric}
              onChange={(e) =>
                setFormData({ ...formData, nric: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              disabled
            />
            <p className="text-xs text-slate-400 mt-1">NRIC cannot be modified</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Home Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Medical Section */}
          <hr className="my-6" />
          <h3 className="text-lg font-bold text-slate-900">Medical Information</h3>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Allergies
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
              placeholder="e.g., Penicillin, Peanuts"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Medical History */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Medical History
            </label>
            <input
              type="text"
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              placeholder="e.g., Asthma, Hypertension"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Blood Type
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Blood Type</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Example: Add Dependent Modal Component
 */
export const AddDependentModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DependentData) => void;
  isLoading?: boolean;
}) => {
  const [formData, setFormData] = useState<DependentData>({
    id: Date.now().toString(),
    name: '',
    relationship: '',
    badges: [],
  });

  const vulnerabilityOptions = [
    { label: 'Elderly (60+)', value: 'elderly', color: 'orange' },
    { label: 'Child (<12)', value: 'child', color: 'green' },
    { label: 'OKU (Physical)', value: 'oku-physical', color: 'purple' },
    { label: 'OKU (Mental)', value: 'oku-mental', color: 'purple' },
    { label: 'Requires Medication', value: 'requires-meds', color: 'blue' },
    { label: 'Requires Mobility Aid', value: 'mobility-aid', color: 'red' },
    { label: 'Hearing Impaired', value: 'hearing-impaired', color: 'blue' },
    { label: 'Vision Impaired', value: 'vision-impaired', color: 'blue' },
  ];

  const relationshipOptions = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Grandparent',
    'Grandchild',
    'Extended Family',
    'Caregiver',
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.relationship) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="w-full md:w-96 bg-white rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Add Dependent</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Relationship *
            </label>
            <select
              value={formData.relationship}
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Relationship</option>
              {relationshipOptions.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Vulnerability Tags */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Special Needs & Vulnerabilities
            </label>
            <div className="space-y-2">
              {vulnerabilityOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.badges.includes(option.label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          badges: [...formData.badges, option.label],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          badges: formData.badges.filter(
                            (b) => b !== option.label
                          ),
                        });
                      }
                    }}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <span className="text-sm font-medium text-slate-900">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.relationship}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Dependent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Example: Extended App Component with Modal State
 */
export function ExtendedProfileApp() {
  const [currentScreen, setCurrentScreen] = useState('profile');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Example user data
  const [userData, setUserData] = useState<UserData>({
    name: 'Amirul Hafiz bin Ramli',
    nric: '920512-10-5433',
    phone: '+60 12-345 6789',
    email: 'amirul.hafiz@email.com',
    address: 'No. 24, Jalan Teluk Gadung 27/93, Seksyen 27, Shah Alam',
    allergies: '',
    medicalHistory: '',
    bloodType: '',
  });

  const handleSaveProfile = async (updatedData: UserData) => {
    setIsLoading(true);
    try {
      // TODO: Save to Firebase
      console.log('Saving profile:', updatedData);
      setUserData(updatedData);
      setShowEditProfileModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDependent = async (dependentData: DependentData) => {
    setIsLoading(true);
    try {
      // TODO: Save to Firebase
      console.log('Adding dependent:', dependentData);
      setShowAddDependentModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentScreen === 'profile') {
    return (
      <>
        <UserProfileScreen
          onEditProfile={() => setShowEditProfileModal(true)}
          onAddDependent={() => setShowAddDependentModal(true)}
          onEditDependent={(id: string) => console.log('Edit dependent:', id)}
          onSettings={() => console.log('Settings')}
          onHelp={() => console.log('Help')}
          onLogout={() => setCurrentScreen('login')}
          onNavigate={(screen: string) => setCurrentScreen(screen as any)}
        />
        
        <EditProfileModal
          isOpen={showEditProfileModal}
          userData={userData}
          onClose={() => setShowEditProfileModal(false)}
          onSave={handleSaveProfile}
          isLoading={isLoading}
        />

        <AddDependentModal
          isOpen={showAddDependentModal}
          onClose={() => setShowAddDependentModal(false)}
          onSave={handleAddDependent}
          isLoading={isLoading}
        />
      </>
    );
  }

  // Other screens...
  return null;
}

export default ExtendedProfileApp;
