// advice.mjs
// Gets a random tip from AdviceSlip and pops it up.

// 1. Grab a tip from the web
async function fetchAdvice() {
  try {
    const res = await fetch('https://api.adviceslip.com/advice', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Bad response');
    const data = await res.json();
    alert(`💡 Advice: ${data.slip.advice}`);
  } catch {
    alert('Couldn’t get advice. Try again later.');
  }
}

// 2. Hook it to the “Get Advice” button
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('get-advice-btn');
  if (btn) btn.addEventListener('click', fetchAdvice);
});

export { fetchAdvice };