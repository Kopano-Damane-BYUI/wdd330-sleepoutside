// js/dashboard.mjs

// Load belts data from local JSON file
async function fetchBelts() {
  try {
    const response = await fetch('data/belts.json');
    if (!response.ok) throw new Error('Failed to load belt data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching belts:', error);
    return [];
  }
}

// Get stored training logs
function getTrainingLogs() {
  const logs = localStorage.getItem('trainingLogs');
  return logs ? JSON.parse(logs) : [];
}

// Calculate total time trained (minutes)
function getTotalTime(logs) {
  return logs.reduce((total, session) => total + (session.duration || 0), 0);
}

// Count total sessions logged
function getSessionsCount(logs) {
  return logs.length;
}

// Calculate progress toward next belt based on completed techniques
// For simplicity: assume each technique completed equals one session logged of that type
// belts.json structure expected:
// [
//   {
//     "belt": "White",
//     "requirements": {
//        "kicks": 5,
//        "kata": 3,
//        "sparring": 2
//      }
//   },
//   ...
// ]

function calculateProgress(logs, belts, currentBelt = 'White') {
  const beltIndex = belts.findIndex(b => b.belt === currentBelt);
  if (beltIndex === -1 || beltIndex === belts.length - 1) {
    // No next belt or last belt reached
    return { progressPercent: 100, nextBelt: null };
  }

  const nextBelt = belts[beltIndex + 1];
  const requirements = nextBelt.requirements;

  // Count completed techniques from logs
  const counts = {};
  logs.forEach(log => {
    if (!counts[log.type]) counts[log.type] = 0;
    counts[log.type]++;
  });

  // Calculate completion percent based on requirements
  let totalReq = 0;
  let totalDone = 0;
  for (const [technique, reqCount] of Object.entries(requirements)) {
    totalReq += reqCount;
    totalDone += Math.min(counts[technique] || 0, reqCount);
  }

  const progressPercent = totalReq ? Math.round((totalDone / totalReq) * 100) : 0;
  return { progressPercent, nextBelt: nextBelt.belt };
}

// Render recent sessions in a table
function renderRecentSessions(logs) {
  const tableBody = document.getElementById('recent-sessions-body');
  if (!tableBody) return;

  // Show latest 10 sessions sorted descending by date
  const sortedLogs = logs
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  tableBody.innerHTML = ''; // clear existing

  if (sortedLogs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">No training sessions logged yet.</td></tr>';
    return;
  }

  sortedLogs.forEach(session => {
    const tr = document.createElement('tr');

    const dateTd = document.createElement('td');
    dateTd.textContent = new Date(session.date).toLocaleDateString();

    const typeTd = document.createElement('td');
    typeTd.textContent = session.type;

    const durationTd = document.createElement('td');
    durationTd.textContent = `${session.duration} min`;

    const notesTd = document.createElement('td');
    notesTd.textContent = session.notes || '-';

    tr.append(dateTd, typeTd, durationTd, notesTd);
    tableBody.appendChild(tr);
  });
}

// Update dashboard stats: total time, sessions count, belt progress bar
function updateDashboardStats(totalMinutes, sessionsCount, progressPercent, nextBelt) {
  const totalTimeEl = document.getElementById('total-time-trained');
  const sessionsCountEl = document.getElementById('sessions-completed');
  const progressBarEl = document.getElementById('belt-progress-bar');
  const progressTextEl = document.getElementById('belt-progress-text');
  const nextBeltEl = document.getElementById('next-belt-name');

  if (totalTimeEl) {
    // Display total time in hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    totalTimeEl.textContent = `${hours}h ${minutes}m`;
  }

  if (sessionsCountEl) {
    sessionsCountEl.textContent = sessionsCount;
  }

  if (progressBarEl) {
    progressBarEl.style.width = `${progressPercent}%`;
    progressBarEl.setAttribute('aria-valuenow', progressPercent);
  }

  if (progressTextEl) {
    progressTextEl.textContent = `${progressPercent}% Complete`;
  }

  if (nextBeltEl) {
    nextBeltEl.textContent = nextBelt || 'Max belt reached';
  }
}

async function initDashboard() {
  const logs = getTrainingLogs();

  // Ideally, current belt should come from user profile, default to "White"
  const currentBelt = 'White';

  const belts = await fetchBelts();

  const totalMinutes = getTotalTime(logs);
  const sessionsCount = getSessionsCount(logs);
  const { progressPercent, nextBelt } = calculateProgress(logs, belts, currentBelt);

  renderRecentSessions(logs);
  updateDashboardStats(totalMinutes, sessionsCount, progressPercent, nextBelt);
}

document.addEventListener('DOMContentLoaded', initDashboard);
