// js/profile.mjs

const STORAGE_KEY = 'karateUserProfile';

// Default profile data structure
const defaultProfile = {
  name: '',
  beltLevel: '',
  preferredStyles: [], // e.g., ['kata', 'sparring']
  notificationsEnabled: false,
  reminderTimes: [], // e.g., ['18:00', '20:30']
};

// Load profile from localStorage or return default
export function loadProfile() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.warn('Failed to parse user profile, resetting.');
      saveProfile(defaultProfile);
      return defaultProfile;
    }
  }
  return defaultProfile;
}

// Save profile to localStorage
export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Update profile fields partially and save
export function updateProfile(updates) {
  const profile = loadProfile();
  const newProfile = { ...profile, ...updates };
  saveProfile(newProfile);
  return newProfile;
}

// Clear profile (for logout/reset if needed)
export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
