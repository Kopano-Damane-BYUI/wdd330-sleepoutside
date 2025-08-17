//  YouTube integration for karate tutorials

// Your personal Google API key for the YouTube Data API v3
const API_KEY = 'AIzaSyDZJd1RIOe7FYcUOUuvj6Uc_t9lTVP1aJk';
// Real api for demo- AIzaSyDZJd1RIOe7FYcUOUuvj6Uc_t9lTVP1aJk

// Topics we want to populate with videos
const categories = ['kicks', 'kata', 'sparring', 'blocks', 'punches'];

//  build a single video card
function createVideoCard(video) {
  const card = document.createElement('div');
  card.classList.add('video-preview');

  // Wrap everything in a link so the whole card is clickable
  card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
       target="_blank" 
       rel="noopener noreferrer">
      <img src="${video.snippet.thumbnails.medium.url}" 
           alt="${video.snippet.title}">
      <p>${video.snippet.title}</p>
      <small>${video.snippet.channelTitle}</small>
    </a>
  `;

  return card;
}

//  Fetch up to 4 tutorial videos for one topic
async function fetchYouTubeVideos(query) {
  try {
    // Build the search query: “karate <query> tutorial”
    const encodedQuery = encodeURIComponent(query);
    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&type=video&q=karate+${encodedQuery}+tutorial` +
      `&maxResults=4&key=${API_KEY}`;

    const response = await fetch(url);

    // If the API call fails, read the error message if possible
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `YouTube API error: ${response.status} ${response.statusText} - ${
          errorData.error?.message || ''
        }`
      );
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    // Fail gracefully: return an empty array so nothing breaks visually
    return [];
  }
}

//  Render every category section

async function loadYouTubeVideos() {
  const container = document.getElementById('youtube-videos');
  if (!container) return; // Safety check: element may not exist

  // Clear any existing content
  container.innerHTML = '';

  let successfulCategories = 0;

  // Loop through each topic and build its section
  for (const category of categories) {
    const videos = await fetchYouTubeVideos(category);

    // Outer wrapper for this topic
    const categorySection = document.createElement('div');
    categorySection.classList.add('video-category');

    // Heading: “Karate Kicks Tutorials”, etc.
    const heading = document.createElement('h4');
    heading.textContent = `Karate ${
      category.charAt(0).toUpperCase() + category.slice(1)
    } Tutorials`;
    categorySection.appendChild(heading);

    // Horizontal scroll container for the cards
    const videoRow = document.createElement('div');
    videoRow.classList.add('video-row');

    if (videos.length === 0) {
      // No videos returned; show a friendly message
      const msg = document.createElement('p');
      msg.textContent = 'No videos available.';
      categorySection.appendChild(msg);
    } else {
      // Build and append each card
      videos.forEach(video => {
        const card = createVideoCard(video);
        videoRow.appendChild(card);
      });
      categorySection.appendChild(videoRow);
      successfulCategories++;
    }

    container.appendChild(categorySection);
  }

  // If every category failed, show a global fallback
  if (successfulCategories === 0) {
    const fallback = document.createElement('p');
    fallback.textContent =
      'YouTube videos are temporarily unavailable. Please check back later.';
    container.appendChild(fallback);
  }
}


//  Start as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Swallow any errors silently; the user will see the fallback text instead
  loadYouTubeVideos().catch(() => {});
});