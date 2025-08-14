// js/log.mjs

// Get existing training logs from localStorage or return empty array
function getTrainingLogs() {
  const logs = localStorage.getItem('trainingLogs');
  return logs ? JSON.parse(logs) : [];
}

// Save updated training logs array to localStorage
function saveTrainingLogs(logs) {
  localStorage.setItem('trainingLogs', JSON.stringify(logs));
}

// Validate form data and return error message or null if valid
function validateFormData(data) {
  if (!data.date) return 'Please enter the date of training.';
  if (!data.type) return 'Please select a training type.';
  if (!data.duration || isNaN(data.duration) || data.duration <= 0)
    return 'Please enter a valid duration.';
  return null;
}

// Reset form fields and set date to today
function resetForm(form) {
  form.reset();
  const dateInput = form.querySelector('#date');
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }
}

// Show feedback message in the form message div
function showMessage(message, isError = false) {
  const messageDiv = document.getElementById('form-message');
  if (!messageDiv) return;

  messageDiv.textContent = message;
  messageDiv.style.color = isError ? 'var(--color-error, #a30000)' : 'var(--color-primary)';
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const formData = {
    date: form.date.value,
    type: form.type.value,
    duration: parseInt(form.duration.value, 10),
    notes: form.notes.value.trim(),
  };

  // Validate inputs
  const error = validateFormData(formData);
  if (error) {
    showMessage(error, true);
    return;
  }

  // Append new log to stored logs
  const logs = getTrainingLogs();
  logs.push(formData);
  saveTrainingLogs(logs);

  showMessage('Training session logged successfully!');
  resetForm(form);
}

// Initialize form listeners and set default date
function initTrainingLogForm() {
  const form = document.getElementById('training-log-form');
  if (!form) return;

  // Set today's date as default
  const dateInput = form.querySelector('#date');
  if (dateInput && !dateInput.value) {
    dateInput.valueAsDate = new Date();
  }

  form.addEventListener('submit', handleFormSubmit);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTrainingLogForm();
});

// ** EXPORTS **
export { getTrainingLogs, saveTrainingLogs, validateFormData, resetForm, showMessage, handleFormSubmit, initTrainingLogForm };
