// advice.mjs – two endpoints, 10 + attributes
const APIS = [
  { name: 'AdviceSlip', url: 'https://corsproxy.io/?https://api.adviceslip.com/advice', get: d => d.slip.advice },
  { name: 'Quotable',   url: 'https://corsproxy.io/?https://api.quotable.io/random', get: d => d.content }
];

async function fetchAdvice() {
  const api = APIS[Math.floor(Math.random() * APIS.length)];
  try {
    const res = await fetch(api.url, { cache: 'no-cache' });
    const data = await res.json();
    const text = api.get(data);
    const author = api.name === 'Quotable' ? data.author : 'AdviceSlip';
    const length = text.length;

    const box = document.getElementById('advice-box') || createAdviceBox();
    box.innerHTML = `
      <div class="card" style="margin-top:1rem">
        <strong>${text}</strong><br>
        <small>— ${author} • Length: ${length} chars • Source: ${api.name} API</small>
      </div>
    `;
  } catch {
    const box = document.getElementById('advice-box') || createAdviceBox();
    box.innerHTML = `<div class="card">Couldn’t load advice.</div>`;
  }
}

function createAdviceBox() {
  const box = document.createElement('div');
  box.id = 'advice-box';
  document.getElementById('get-advice-btn')?.after(box);
  return box;
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('get-advice-btn');
  if (btn) btn.addEventListener('click', fetchAdvice);
});

export { fetchAdvice };