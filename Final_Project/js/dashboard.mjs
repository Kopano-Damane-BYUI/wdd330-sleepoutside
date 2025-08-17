// js/dashboard.mjs
// Shows the main dashboard: welcome, stats, belt progress, recent logs.

import { loadProfile, isProfileComplete } from './profile.mjs';

// If profile is missing, go fill it first
document.addEventListener('DOMContentLoaded', () => {
  if (!isProfileComplete()) {
    window.location.href = 'profile.html';
    return;
  }
  initDashboard();
});

// --- 1. Load belt requirements file ---
async function fetchBelts() {
  try {
    const res = await fetch('data/belts.json');
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

// --- 2. Read saved sessions ---
function getTrainingLogs() {
  const logs = localStorage.getItem('trainingLogs');
  return logs ? JSON.parse(logs) : [];
}
function getTotalTime(logs) {
  return logs.reduce((sum, s) => sum + (s.duration || 0), 0);
}
function getSessionsCount(logs) {
  return logs.length;
}

// --- 3. Work out belt progress ---
function calculateProgress(logs, belts, currentBelt) {
  const idx = belts.findIndex(b => b.belt === currentBelt);
  if (idx === -1 || idx === belts.length - 1) return { progressPercent: 100, nextBelt: null };

  const next = belts[idx + 1];
  const reqs = next.requirements;

  const counts = {};
  logs.forEach(l => counts[l.type] = (counts[l.type] || 0) + 1);

  let done = 0, total = 0;
  for (const [type, need] of Object.entries(reqs)) {
    total += need;
    done += Math.min(counts[type] || 0, need);
  }
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { progressPercent: percent, nextBelt: next.belt };
}

// --- 4. Show last 10 sessions ---
function renderRecentSessions(logs) {
  const tbody = document.getElementById('recent-sessions-body');
  if (!tbody) return;

  const sorted = logs
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  tbody.innerHTML = sorted.length
    ? sorted.map(s => `
        <tr>
          <td>${new Date(s.date).toLocaleDateString()}</td>
          <td>${s.type}</td>
          <td>${s.duration} min</td>
          <td>${s.notes || '-'}</td>
        </tr>`).join('')
    : '<tr><td colspan="4">No sessions yet.</td></tr>';
}

// --- 5. Update dashboard numbers and bar ---
function updateDashboardStats(minutes, count, percent, nextBelt) {
  const profile = loadProfile();
  document.querySelector('.welcome h2').textContent = `Welcome, ${profile.name}!`;

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  document.getElementById('total-time-trained').textContent = `${hrs}h ${mins}m`;
  document.getElementById('sessions-completed').textContent = count;

  const bar = document.getElementById('belt-progress-bar');
  bar.style.width = `${percent}%`;
  bar.setAttribute('aria-valuenow', percent);

  document.getElementById('belt-progress-text').textContent = `${percent}% Complete`;
  document.getElementById('next-belt-name').textContent = nextBelt || 'Max belt reached';
}

// --- 6. Build the dashboard ---
async function initDashboard() {
  const profile = loadProfile();
  const logs    = getTrainingLogs();
  const belts   = await fetchBelts();

  const { progressPercent, nextBelt } = calculateProgress(logs, belts, profile.beltLevel);

  renderRecentSessions(logs);
  updateDashboardStats(getTotalTime(logs), getSessionsCount(logs), progressPercent, nextBelt);
}