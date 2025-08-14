// advice.mjs

async function fetchAdvice() {
  try {
    const response = await fetch('https://api.adviceslip.com/advice', {
      cache: 'no-cache' // to avoid cached responses
    });
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    alert(`💡 Advice: "${data.slip.advice}"`);
  } catch (error) {
    console.error('Failed to fetch advice:', error);
    alert('Failed to get advice. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const adviceBtn = document.getElementById('get-advice-btn');
  if (adviceBtn) {
    adviceBtn.addEventListener('click', fetchAdvice);
  }
});

export { fetchAdvice };