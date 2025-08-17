// js/reminders.mjs
// Lets the user set daily training reminders.
// Stores the times and the on/off switch in the browser.

import { loadProfile, updateProfile } from './profile.mjs';

// Grab the three pieces of the page we need
const onOffSwitch   = document.getElementById('notifications-toggle');
const listBox       = document.getElementById('reminder-list');
const timeInput     = document.getElementById('new-reminder-time');
const addButton     = document.getElementById('add-reminder-btn');

// ---------- Show the saved reminders ----------
function renderReminders(times) {
  if (!times || times.length === 0) {
    listBox.textContent = 'No reminders set.';
    return;
  }
  listBox.innerHTML = '';
  times.forEach(t => {
    const div = document.createElement('div');
    div.textContent = t;
    listBox.appendChild(div);
  });
}

// ---------- Load saved settings when page opens ----------
function loadReminders() {
  const profile = loadProfile();
  onOffSwitch.checked = profile.notificationsEnabled || false;
  renderReminders(profile.reminderTimes || []);
}

// ---------- Save changes ----------
function saveReminders(times) {
  updateProfile({ reminderTimes: times });
}
function saveNotifications(enabled) {
  updateProfile({ notificationsEnabled: enabled });
}

// ---------- Handle clicks ----------
onOffSwitch.addEventListener('change', e => saveNotifications(e.target.checked));

addButton.addEventListener('click', () => {
  const time = timeInput.value;
  if (!time) {
    alert('Please pick a time.');
    return;
  }
  const profile   = loadProfile();
  const reminders = profile.reminderTimes || [];
  if (reminders.includes(time)) {
    alert('This time is already saved.');
    return;
  }
  reminders.push(time);
  reminders.sort();
  saveReminders(reminders);
  renderReminders(reminders);
  timeInput.value = ''; // clear the box
});

// ---------- Start when page loads ----------
document.addEventListener('DOMContentLoaded', loadReminders);