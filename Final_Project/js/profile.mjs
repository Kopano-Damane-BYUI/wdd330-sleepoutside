// js/profile.mjs

const STORAGE_KEY = 'karateUserProfile'; // localStorage key we use to save / load

// Default values when nothing has been saved yet: Name, belt color, list Prif stiles,
// Reminder on or off, List of reminder times, and whether profile form if filled
const defaultProfile = {
  name: '',                 
  beltLevel: '',            
  preferredStyles: [],      
  notificationsEnabled: false, 
  reminderTimes: [],        
  profileComplete: false    
};

// Reads profile object **from localStorage**
export function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProfile;               // nothing saved yet
  try {
    return JSON.parse(raw);                      // whatever saved in the local storage to JSON
  } catch {
    console.warn('Corrupt profile in localStorage, resetting to default.');
    saveProfile(defaultProfile);
    return defaultProfile;
  }
}

// Saves profile object **to localStorage**
export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Updates only the fields I pass in **in localStorage**
export function updateProfile(updates) {
  const profile = loadProfile();                 // read from localStorage
  const newProfile = { ...profile, ...updates }; // merge changes
  saveProfile(newProfile);                       // write back to localStorage
  return newProfile;
}

// Deletes the profile completely **from localStorage**
export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

// Quick check: is the profile filled? (reads **from localStorage**)
export function isProfileComplete() {
  const p = loadProfile();
  return p.profileComplete && p.name && p.beltLevel;
}


// Runs only on profile.html
// When profile form. Pre fill data from local-s
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profile-form');
  if (!form) return; // skip if not on profile page

  // Pre-fill form with data **already in localStorage**
  const profile = loadProfile();
  form.name.value = profile.name;
  form.beltLevel.value = profile.beltLevel;
  profile.preferredStyles.forEach(style => {
    const cb = form.querySelector(`input[value="${style}"]`);
    if (cb) cb.checked = true;
  });

  // Save the completed form **to localStorage**
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    const updated = {
      name: data.get('name'),
      beltLevel: data.get('beltLevel'),
      preferredStyles: [...form.querySelectorAll('input[name="style"]:checked')].map(cb => cb.value),
      notificationsEnabled: profile.notificationsEnabled, // keep current value
      reminderTimes: profile.reminderTimes,               // keep current value
      profileComplete: true                               // mark form as done
    };

    saveProfile(updated);               // write to localStorage
    window.location.href = 'index.html'; // go to dashboard
  });
});