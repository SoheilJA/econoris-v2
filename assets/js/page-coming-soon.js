/**
 * Econoris — page-coming-soon.js
 * Shared script for the 4 lightweight "coming soon" pages.
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    runAnimations();
  });

  function runAnimations() {
    const E = window.ECONORIS;
    const gsap = window.gsap;
    if (!gsap) return;
    const startHero = () => { if (E.heroReveal) E.heroReveal('[data-hero-title]'); };
    if (document.getElementById('preloader')) {
      document.addEventListener('econoris:preloader-done', startHero, { once: true });
      setTimeout(startHero, 3500);
    } else setTimeout(startHero, 200);
  }
})();
