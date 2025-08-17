// js/quotes.mjs
// Fetches one daily motivational quote and shows it on the page.

// 1. Ask ZenQuotes for today’s quote
async function getQuote() {
  try {
    // Call the API directly (works in modern browsers)
    const res = await fetch('https://zenquotes.io/api/today');
    if (!res.ok) throw new Error('No quote');
    const data = await res.json();
    return { text: data[0].q, author: data[0].a };
  } catch {
    // If anything fails, give a simple fallback
    return { text: 'Stay motivated and keep pushing forward!', author: 'Karate Tracker' };
  }
}

// 2. Put the quote into the page
export async function displayDailyQuote() {
  const box = document.getElementById('daily-quote');
  if (!box) return;
  const quote = await getQuote();
  box.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <cite>— ${quote.author}</cite>
  `;
}

// 3. Run when the page loads
document.addEventListener('DOMContentLoaded', displayDailyQuote);