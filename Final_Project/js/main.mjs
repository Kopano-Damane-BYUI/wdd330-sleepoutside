// js/main.mjs
// Little helpers that run on every page.

// 1. Lazy-load images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    images.forEach(img => io.observe(img));
  } else {
    images.forEach(img => { img.src = img.dataset.src; });
  }
}

// 2. Show daily quote
async function loadMotivationalQuote() {
  const quoteBox = document.querySelector('#daily-quote');
  if (!quoteBox) return;
  try {
    const res = await fetch('https://zenquotes.io/api/today');
    const data = await res.json();
    quoteBox.innerHTML = `<blockquote>"${data[0].q}"</blockquote><cite>— ${data[0].a}</cite>`;
  } catch {
    quoteBox.innerHTML = `<blockquote>"Keep training!"</blockquote><cite>— Karate Tracker</cite>`;
  }
}

// 3. Highlight the active menu link
function highlightCurrentPage() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === current || (link.href === 'index.html' && !current)) {
      link.classList.add('active');
    }
  });
}

// 4. Mobile menu toggle
function initMobileMenuToggle() {
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.innerHTML = nav.classList.contains('open') ? '×' : '☰';
  });
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  loadMotivationalQuote();
  highlightCurrentPage();
  initMobileMenuToggle();
});