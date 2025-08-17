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

// 2. Active menu highlight
function highlightCurrentPage() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === current || (!current && link.href.includes('index.html'))) {
      link.classList.add('active');
    }
  });
}

// 3. Mobile menu toggle
function initMobileMenuToggle() {
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.innerHTML = nav.classList.contains('open') ? '×' : '☰';
  });
}

// 4. Kick everything off
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  highlightCurrentPage();
  initMobileMenuToggle();
});