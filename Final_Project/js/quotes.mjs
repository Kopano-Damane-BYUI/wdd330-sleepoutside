// js/quotes.mjs

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const QUOTE_API_URL = 'https://zenquotes.io/api/today';

async function fetchDailyQuote() {
  try {
    const response = await fetch(PROXY_URL + QUOTE_API_URL);
    if (!response.ok) throw new Error('Failed to fetch quote');

    const data = await response.json();

    // ZenQuotes API returns an array with one quote object
    const quoteObj = data[0];
    return {
      text: quoteObj.q,
      author: quoteObj.a,
    };
  } catch (error) {
    // Silently handle failure without logging to the console
    return null;
  }
}

export async function displayDailyQuote() {
  const container = document.getElementById('daily-quote');
  if (!container) return;

  const quote = await fetchDailyQuote();

  if (quote) {
    container.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <cite>— ${quote.author}</cite>
    `;
  } else {
    container.innerHTML = `
      <blockquote>"Stay motivated and keep pushing forward!"</blockquote>
      <cite>— Karate Tracker</cite>
    `;
  }
}

document.addEventListener('DOMContentLoaded', displayDailyQuote);
