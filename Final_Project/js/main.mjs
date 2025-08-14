// js/main.mjs

// Lazy load images with Intersection Observer
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    images.forEach(img => observer.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver support
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Fetch and display motivational quote of the day
async function loadMotivationalQuote() {
  const quoteContainer = document.querySelector('.motivational-quote blockquote');
  const citeContainer = document.querySelector('.motivational-quote cite');

  if (!quoteContainer || !citeContainer) return;

  try {
    const response = await fetch('https://zenquotes.io/api/today'); // ZenQuotes API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    // API returns an array with one object
    if (data && data[0]) {
      quoteContainer.textContent = `"${data[0].q}"`;
      citeContainer.textContent = `— ${data[0].a}`;
    }
  } catch (error) {
    quoteContainer.textContent = '"Consistency is the key to progress."';
    citeContainer.textContent = '— Karate Training Tracker';
    console.error('Failed to load quote:', error);
  }
}

// Highlight current page nav item
function highlightCurrentPage() {
  const currentPath = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href === 'index.html' && currentPath === '')) {
      link.classList.add('active');
    }
  });
}

// Initialize mobile menu toggle button (extra safety)
function initMobileMenuToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggleBtn.innerHTML = nav.classList.contains('open') ? '&times;' : '&#9776;';
  });
}

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  loadMotivationalQuote();
  highlightCurrentPage();
  initMobileMenuToggle();
});
