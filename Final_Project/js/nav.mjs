// js/nav.mjs
// Mobile menu toggle + highlight current page

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.innerHTML = nav.classList.contains('open') ? '×' : '☰';
  });
});

// Highlight active link
const page = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === page) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});