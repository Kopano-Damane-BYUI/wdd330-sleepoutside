// js/log.mjs
// Lets the user log (save) each karate training session.

import { isProfileComplete } from './profile.mjs';

// Send user back if profile is missing
document.addEventListener('DOMContentLoaded', () => {
  if (!isProfileComplete()) {
    window.location.href = 'profile.html';
    return;
  }
  initTrainingLogForm();
});

// --- 1. Read saved sessions ---
function getTrainingLogs() {
  const logs = localStorage.getItem('trainingLogs');
  return logs ? JSON.parse(logs) : [];
}

// --- 2. Save sessions ---
function saveTrainingLogs(logs) {
  localStorage.setItem('trainingLogs', JSON.stringify(logs));
}

// --- 3. Check form ---
function validateFormData(data) {
  if (!data.date) return 'Pick a date.';
  if (!data.type) return 'Pick a type.';
  if (!data.duration || data.duration <= 0) return 'Enter minutes (positive).';
  return null;
}

// --- 4. Clear form ---
function resetForm(form) {
  form.reset();
  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.valueAsDate = new Date();
}

// --- 5. Show message ---
function showMessage(message, isError = false) {
  const box = document.getElementById('form-message');
  if (!box) return;
  box.textContent = message;
  box.style.color = isError ? 'red' : 'green';
}

// --- 6. Save session ---
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const session = {
    date: form.date.value,
    type: form.type.value,
    duration: parseInt(form.duration.value, 10),
    notes: form.notes.value.trim()
  };

  const error = validateFormData(session);
  if (error) {
    showMessage(error, true);
    return;
  }

  const logs = getTrainingLogs();
  logs.push(session);
  saveTrainingLogs(logs);
  showMessage('Session saved!');
  resetForm(form);
}

// --- 7. Start form ---
function initTrainingLogForm() {
  const form = document.getElementById('training-log-form');
  if (!form) return;
  const dateInput = form.querySelector('#date');
  if (dateInput && !dateInput.value) dateInput.valueAsDate = new Date();
  form.addEventListener('submit', handleFormSubmit);
}

// --- 8. Let other files use these helpers ---
export {
  getTrainingLogs,
  saveTrainingLogs,
  validateFormData,
  resetForm,
  showMessage,
  handleFormSubmit,
  initTrainingLogForm
};