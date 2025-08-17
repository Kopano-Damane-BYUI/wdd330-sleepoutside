// js/log.mjs
//  Karate Training Session Logger
//  Purpose: Store each practice session (date, type, duration, notes)
//           so the dashboard can display progress and stats.

import { isProfileComplete } from './profile.mjs';

//  Guard: Force profile completion before logging
document.addEventListener('DOMContentLoaded', () => {
  if (!isProfileComplete()) {
    window.location.href = 'profile.html';
    return;
  }
  initTrainingLogForm();
});

//  1. Read saved training sessions (array of objects)
//      Key: "trainingLogs"
//      Value: [{ date: "2025-08-18", type: "kicks", duration: 30, notes: "..." }, ...]
function getTrainingLogs() {
  const logs = localStorage.getItem('trainingLogs');
  return logs ? JSON.parse(logs) : [];
}

//  2. Save the updated training-session array back to localStorage
function saveTrainingLogs(logs) {
  localStorage.setItem('trainingLogs', JSON.stringify(logs));
}

//  3. Validate the training-session object before saving
//      - date    : required (HTML5 date input)
//      - type    : must be selected from <select> (kicks, kata, sparring, etc.)
//      - duration: positive integer minutes
function validateFormData(data) {
  if (!data.date) return 'Pick a date.';
  if (!data.type) return 'Pick a training type.';
  if (!data.duration || data.duration <= 0) return 'Enter minutes (positive).';
  return null;
}


//  4. Reset the <form> to defaults after successful save
//      - Clear all fields
//      - Default date to today for the next session
function resetForm(form) {
  form.reset();
  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.valueAsDate = new Date();
}

//  5. Display inline feedback inside #form-message
//      - Green for success
//      - Red for validation errors or API failures
function showMessage(message, isError = false) {
  const box = document.getElementById('form-message');
  if (!box) return;
  box.textContent = message;
  box.style.color = isError ? 'red' : 'green';
}

//  * LOG AND SAVE SESSIONS
//      - Prevent page reload
//      - Build session object from form values
//      - Validate → save → feedback → reset
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

//  7. Wire the form on the /log.html page
//      - Auto-fill date to today
//      - Listen for submit
function initTrainingLogForm() {
  const form = document.getElementById('training-log-form');
  if (!form) return;
  const dateInput = form.querySelector('#date');
  if (dateInput && !dateInput.value) dateInput.valueAsDate = new Date();
  form.addEventListener('submit', handleFormSubmit);
}

//  8. Public helpers for dashboard & export
export {
  getTrainingLogs,
  saveTrainingLogs,
  validateFormData,
  resetForm,
  showMessage,
  handleFormSubmit,
  initTrainingLogForm
};