// js/quotes.mjs
// Fetches one daily motivational quote and shows it on the page.

const PROXY = 'https://api.allorigins.win/get?url=';
const QUOTE_API = 'https://zenquotes.io/api/today';

async function getQuote() {
  try {
    const res = await fetch(PROXY + encodeURIComponent(QUOTE_API));
    if (!res.ok) throw new Error('Network error');

    const payload = await res.json();
    const data = JSON.parse(payload.contents); // [{q, a}]
    return { text: data[0].q, author: data[0].a };
  } catch {
    return { text: 'Stay motivated and keep training!', author: 'Karate Tracker' };
  }
}

export async function displayDailyQuote() {
  const box = document.getElementById('daily-quote');
  if (!box) return;

  const quote = await getQuote();
  box.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <cite>— ${quote.author}</cite>
  `;
}

document.addEventListener('DOMContentLoaded', displayDailyQuote);