const API_KEY = 'AIzaSyDONcCz6uU44ZzPyG1UypWp6_XX1ovf4H8';
const categories = ['kicks', 'kata', 'sparring', 'blocks', 'punches'];

// Create YouTube video cards
function createVideoCard(video) {
  const card = document.createElement('div');
  card.classList.add('video-preview');

  card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" rel="noopener noreferrer">
      <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
      <p>${video.snippet.title}</p>
      <small>${video.snippet.channelTitle}</small>
    </a>
  `;

  return card;
}

// Fetch videos by category
async function fetchYouTubeVideos(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=karate+${encodedQuery}+tutorial&maxResults=4&key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`YouTube API error: ${response.status} ${response.statusText} - ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    // Silently return empty array if request fails
    return [];
  }
}

// Render all categories
async function loadYouTubeVideos() {
  const container = document.getElementById('youtube-videos');
  if (!container) return;

  container.innerHTML = '';

  let successfulCategories = 0;

  for (const category of categories) {
    const videos = await fetchYouTubeVideos(category);

    const categorySection = document.createElement('div');
    categorySection.classList.add('video-category');

    const heading = document.createElement('h4');
    heading.textContent = `Karate ${category.charAt(0).toUpperCase() + category.slice(1)} Tutorials`;
    categorySection.appendChild(heading);

    const videoRow = document.createElement('div');
    videoRow.classList.add('video-row');

    if (videos.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = 'No videos available.';
      categorySection.appendChild(msg);
    } else {
      videos.forEach(video => {
        const card = createVideoCard(video);
        videoRow.appendChild(card);
      });
      categorySection.appendChild(videoRow);
      successfulCategories++;
    }

    container.appendChild(categorySection);
  }

  if (successfulCategories === 0) {
    const fallback = document.createElement('p');
    fallback.textContent = 'YouTube videos are temporarily unavailable. Please check back later.';
    container.appendChild(fallback);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadYouTubeVideos().catch(() => {
    // Silent catch: do not log errors to console
  });
});
