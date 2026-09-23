/* ─────────────────────────────────────────────
   portfolio.js
   ───────────────────────────────────────────── */

(() => {
  /* ── 1. Theme toggle ───────────────────────
     Reads the saved preference from localStorage,
     applies it on load, and wires up the button.
  ─────────────────────────────────────────── */
  const root    = document.documentElement;
  const btn     = document.getElementById('theme-toggle');
  const DARK    = 'dark';
  const LIGHT   = 'light';

  // Apply saved theme immediately to avoid flash
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;

  function currentTheme() {
    return root.dataset.theme ||
      (window.matchMedia('(prefers-color-scheme:dark)').matches ? DARK : LIGHT);
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    btn.textContent = theme === DARK ? '☀' : '☾';
  }

  // Set initial button label & icon
  applyTheme(currentTheme());

  btn.addEventListener('click', () => {
    applyTheme(currentTheme() === DARK ? LIGHT : DARK);
  });


  /* ── 2. Navbar scroll behaviour ────────────
     Adds .scrolled to the header once the user
     scrolls past the hero, giving it a thin
     bottom border so it separates from content.
  ─────────────────────────────────────────── */
  const header = document.querySelector('header.nav');

  const heroObserver = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0 }
  );
  heroObserver.observe(document.querySelector('section.hero'));


  /* ── 3. Active nav link ─────────────────────
     Watches each section and marks the matching
     nav link as .active while it's in view.
  ─────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('nav.links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));


  /* ── 4. Scroll-in animations ────────────────
     Sections (except the hero, which already has
     CSS keyframe animations) start invisible and
     fade + rise into view when they enter the
     viewport.
  ─────────────────────────────────────────── */
  const fadeTargets = document.querySelectorAll(
    'section:not(.hero), .tile'
  );

  // Set initial hidden state
  fadeTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target); // animate once
      });
    },
    { threshold: 0.12 }
  );

  fadeTargets.forEach(el => fadeObserver.observe(el));

})();
