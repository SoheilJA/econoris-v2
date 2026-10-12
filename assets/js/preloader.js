/**
 * Econoris — preloader.js
 * Capsule-fill preloader with progress tied to actual page load + bubbles + particle burst + wipe reveal.
 * Skips on subsequent visits within the same session (sessionStorage) when preloaderSessionOnly is true.
 */
(function () {
  const cfg = window.ECONORIS_CONFIG;
  if (!cfg) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipThisVisit = cfg.preloaderSessionOnly && sessionStorage.getItem('econoris_preloaded') === '1';

  // If we should skip — remove any preloader markup
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('preloader');
    if (!el || skipThisVisit) {
      if (el) el.remove();
      return;
    }

    if (reduced) {
      // Simple fade for reduced motion
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s';
        el.style.opacity = '0';
        setTimeout(() => { el.remove(); }, 600);
      }, 400);
      return;
    }

    runFullPreloader(el);
  });

  function runFullPreloader(el) {
    const liquid = el.querySelector('#capLiquid');
    const liquidTop = el.querySelector('#capLiquidTop');
    const progress = el.querySelector('#preProgress');
    const bubblesHost = el.querySelector('#capBubbles');
    const wordmark = el.querySelector('#preWordmark');
    const fa = window.toFa;

    // Spawn bubbles
    for (let i = 0; i < 12; i++) {
      const b = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const cx = 35 + Math.random() * 50;
      const r = 1.5 + Math.random() * 3;
      b.setAttribute('cx', cx);
      b.setAttribute('cy', 200);
      b.setAttribute('r', r);
      b.setAttribute('fill', '#fff');
      b.setAttribute('opacity', '0.7');
      b.style.animation = `bubble-rise ${1.4 + Math.random() * 1.6}s ease-in ${Math.random() * 2}s infinite`;
      bubblesHost.appendChild(b);
    }

    const minDur = cfg.preloader.min;
    const maxDur = cfg.preloader.max;
    const start = performance.now();

    // Build progress: max(loadTime, minDur) but capped at maxDur
    let target = 100;
    let loadComplete = false;
    let loadAt = null;

    function onComplete() {
      loadComplete = true;
      loadAt = performance.now() - start;
    }
    if (document.readyState === 'complete') onComplete();
    else window.addEventListener('load', onComplete, { once: true });

    function tick(now) {
      const t = now - start;
      const denom = loadComplete ? Math.max(loadAt, minDur) : minDur;
      let p = Math.min(100, (t / denom) * 100);

      // If load is complete and we passed minDur, jump toward 100
      if (loadComplete && t > loadAt) {
        const overshoot = (t - loadAt) / 400;
        p = Math.max(p, Math.min(100, 100 - (1 - overshoot) * 100));
      }

      // Liquid fill (inverted: starts at bottom, fills upward as p increases)
      const fillH = (p / 100) * 180;
      const yTop = 200 - fillH;
      liquid.setAttribute('height', fillH);
      liquid.setAttribute('y', yTop);
      liquidTop.setAttribute('height', fillH);
      liquidTop.setAttribute('y', yTop);

      // Progress number (Persian digits)
      progress.textContent = fa(Math.floor(p));

      if (p >= 100) {
        // Capsule cracks open → wordmark → wipe
        setTimeout(() => {
          // Particle burst via GSAP if available, else CSS
          if (window.gsap) {
            // Move wordmark up
            gsap.to(wordmark, { opacity: 1, y: -40, duration: 0.7, ease: 'power3.out' });
            gsap.to(el.querySelector('svg'), { scale: 1.4, opacity: 0, duration: 0.6, ease: 'back.in(2)' });
            // Burst particles
            const burst = document.createElement('div');
            burst.style.cssText = 'position:absolute; left:50%; top:50%; pointer-events:none; z-index:5;';
            el.appendChild(burst);
            const colors = ['#FF4FA3', '#7C4DFF', '#00D4C2', '#FFB938', '#2F6BFF'];
            for (let i = 0; i < 24; i++) {
              const p = document.createElement('div');
              p.style.cssText = `position:absolute; width:8px; height:8px; border-radius:9999px; background:${colors[i%colors.length]}; left:0; top:0;`;
              burst.appendChild(p);
              const ang = (i / 24) * Math.PI * 2;
              gsap.to(p, { x: Math.cos(ang) * 220, y: Math.sin(ang) * 220, opacity: 0, duration: 0.9, ease: 'power2.out' });
            }
          }

          setTimeout(() => {
            // Diagonal split-curtain wipe
            el.style.transition = 'transform 0.9s cubic-bezier(0.76,0,0.24,1), opacity 0.6s 0.4s';
            el.style.transform = 'translateY(-100%) skewY(-3deg)';
            el.style.opacity = '0';
            setTimeout(() => {
              el.remove();
              sessionStorage.setItem('econoris_preloaded', '1');
              document.dispatchEvent(new CustomEvent('econoris:preloader-done'));
            }, 950);
          }, 750);
        }, 200);
        return;
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
