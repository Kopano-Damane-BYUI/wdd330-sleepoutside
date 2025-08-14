// js/reminders.mjs

import { loadProfile, updateProfile } from './profile.mjs';

const notificationsToggle = document.getElementById('notifications-toggle');
const reminderList = document.getElementById('reminder-list');
const newReminderTime = document.getElementById('new-reminder-time');
const addReminderBtn = document.getElementById('add-reminder-btn');

function renderReminders(reminders) {
  if (!reminders || reminders.length === 0) {
    reminderList.textContent = 'No reminders set.';
    return;
  }
  reminderList.innerHTML = '';
  reminders.forEach(time => {
    const div = document.createElement('div');
    div.textContent = time;
    reminderList.appendChild(div);
  });
}

function loadReminders() {
  const profile = loadProfile();
  notificationsToggle.checked = profile.notificationsEnabled || false;
  renderReminders(profile.reminderTimes || []);
}

function saveReminders(reminderTimes) {
  updateProfile({ reminderTimes });
}

function saveNotifications(enabled) {
  updateProfile({ notificationsEnabled: enabled });
}

notificationsToggle.addEventListener('change', (e) => {
  saveNotifications(e.target.checked);
});

addReminderBtn.addEventListener('click', () => {
  const time = newReminderTime.value;
  if (!time) {
    alert('Please select a valid time.');
    return;
  }
  const profile = loadProfile();
  const reminders = profile.reminderTimes || [];
  if (reminders.includes(time)) {
    alert('Reminder time already added.');
    return;
  }
  reminders.push(time);
  reminders.sort();
  saveReminders(reminders);
  renderReminders(reminders);
  newReminderTime.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
  loadReminders();
});
