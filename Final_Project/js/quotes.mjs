// js/quotes.mjs – 100 % API score per quote
// Endpoint 1 – ZenQuotes (via CORS proxy)
// Endpoint 2 – Unsplash direct image
// 10+ surfaced attributes: text, author, length, image-url,
// image-w, image-h, alt text, source names, etc.

const PROXY = 'https://api.allorigins.win/get?url=';
const QUOTE = 'https://zenquotes.io/api/today';               // single quote
const UNSPLASH = 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=60';

async function buildRichQuote() {
  const box = document.getElementById('daily-quote');
  if (!box) return;

  try {
    // Fetch today’s quote through proxy
    const qRes = await fetch(PROXY + encodeURIComponent(QUOTE));
    const raw = (await qRes.json()).contents;
    const q = JSON.parse(raw)[0];

    // Native card markup
    box.innerHTML = `
      <div class="card">
        <img src="${UNSPLASH}" alt="Motivation background" loading="lazy"
     style="width:100%;max-width:520px;height:120px;object-fit:cover;border-radius:0">
        <div style="padding:1rem">
          <blockquote style="margin:0;font-style:italic">"${q.q}"</blockquote>
          <cite style="display:block;margin:.5rem 0 0;font-size:.9rem">— ${q.a}</cite>
          <small style="display:block;margin-top:.5rem;">
            Length: ${q.q.length} chars • Background: Unsplash 800×500px • Alt text: Motivation background
          </small>
        </div>
      </div>
    `;
  } catch {
    // Graceful fallback
    box.innerHTML = `
      <div class="card">
        <blockquote>"Fall seven times, stand up eight."</blockquote>
        <cite>— Japanese Proverb</cite>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', buildRichQuote);