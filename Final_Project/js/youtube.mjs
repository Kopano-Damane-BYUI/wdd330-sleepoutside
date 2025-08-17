// youtube.mjs
// Loads karate tutorial videos from YouTube.

const API_KEY = 'AIzaSyDONcCz6uU44Z4zPyG1UypWp6_XX1ovf4H8';
const topics  = ['kicks', 'kata', 'sparring', 'blocks', 'punches'];

// 1. Make one small video card
function makeCard(video) {
  const card = document.createElement('div');
  card.className = 'video-preview';
  card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" rel="noopener">
      <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
      <p>${video.snippet.title}</p>
      <small>${video.snippet.channelTitle}</small>
    </a>`;
  return card;
}

// 2. Ask YouTube for up to 4 videos on one topic
async function fetchVideos(topic) {
  try {
    const q   = encodeURIComponent(`karate ${topic} tutorial`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${q}&maxResults=4&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('YouTube error');
    return (await res.json()).items || [];
  } catch {
    return []; // fail silently
  }
}

// 3. Build one section per topic and drop it on the page
async function loadYouTubeVideos() {
  const box = document.getElementById('youtube-videos');
  if (!box) return;
  box.innerHTML = '';

  let loadedAny = 0;
  for (const topic of topics) {
    const videos = await fetchVideos(topic);

    const section = document.createElement('div');
    section.className = 'video-category';
    section.innerHTML = `<h4>Karate ${topic.charAt(0).toUpperCase()}${topic.slice(1)} Tutorials</h4>`;

    if (videos.length === 0) {
      section.innerHTML += '<p>No videos found.</p>';
    } else {
      const row = document.createElement('div');
      row.className = 'video-row';
      videos.forEach(v => row.appendChild(makeCard(v)));
      section.appendChild(row);
      loadedAny++;
    }
    box.appendChild(section);
  }

  if (!loadedAny) {
    box.innerHTML = '<p>YouTube videos are temporarily unavailable.</p>';
  }
}

// 4. Run when the page loads
document.addEventListener('DOMContentLoaded', () => loadYouTubeVideos().catch(() => {}));