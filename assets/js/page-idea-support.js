/**
 * Econoris — page-idea-support.js
 * Rocket launch animation + parallax stages.
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    runAnimations();
  });

  function runAnimations() {
    const E = window.ECONORIS;
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);

    const startHero = () => { if (E.heroReveal) E.heroReveal('[data-hero-title]'); };
    if (document.getElementById('preloader')) {
      document.addEventListener('econoris:preloader-done', startHero, { once: true });
      setTimeout(startHero, 3500);
    } else setTimeout(startHero, 200);

    if (!E.reduced) {
      // Rocket lifts off on scroll
      const rocket = document.getElementById('rocketBody');
      const flame = document.getElementById('rocketFlame');
      const trail = document.getElementById('rocketTrail');
      if (rocket) {
        gsap.fromTo(rocket, { y: 0 }, {
          y: -200, duration: 1, ease: 'none',
          scrollTrigger: {
            trigger: '#rocketSVG', start: 'top 70%', end: 'bottom 20%', scrub: 1,
          },
        });
        // Flame scale
        if (flame) {
          gsap.fromTo(flame, { scaleY: 0.5, opacity: 0.5 }, {
            scaleY: 1.5, opacity: 1, duration: 1, ease: 'none',
            scrollTrigger: {
              trigger: '#rocketSVG', start: 'top 70%', end: 'bottom 20%', scrub: 1,
            },
          });
        }
        // Trail
        if (trail && trail.getTotalLength) {
          const len = trail.getTotalLength();
          trail.style.strokeDasharray = len;
          trail.style.strokeDashoffset = len;
          gsap.to(trail, {
            strokeDashoffset: 0, duration: 1, ease: 'none',
            scrollTrigger: { trigger: '#rocketSVG', start: 'top 70%', end: 'bottom 20%', scrub: 1 },
          });
        }
      }

      // Twinkle stars
      gsap.to('.rocket-stars circle', {
        opacity: 0.2, duration: 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.2,
      });
    }
  }
})();
