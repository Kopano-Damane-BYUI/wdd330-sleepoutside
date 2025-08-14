// js/nav.mjs
'use strict';

// Toggle Mobile Menu
// js/nav.mjs
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");

    // Toggle icon between ☰ and ✕
    toggleBtn.innerHTML = nav.classList.contains("open") ? '&times;' : '&#9776;';
  });
});


// Wayfinding: Set 'active' class based on current page
const currentPath = window.location.pathname.split('/').pop(); // e.g., "log.html"
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  const linkPath = link.getAttribute('href');
  if (linkPath === currentPath) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
