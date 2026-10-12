/**
 * Econoris — page-contact.js
 * Signal/connection SVG background animation, form chips, validation,
 * success animation, copy-to-clipboard, OSM iframe lazy load.
 */
(function () {
  const C = window.ECONORIS_CONFIG;
  const T = window.ECONORIS_CONTENT.fa;
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    buildSignalBackground();
    injectChips();
    setupForm();
    setupCopy();
    setupMap();
    runAnimations();
  });

  /* ---------- Signal background ---------- */
  function buildSignalBackground() {
    const lines = document.getElementById('signalLines');
    const nodes = document.getElementById('signalNodes');
    if (!lines || !nodes) return;
    // Generate nodes
    const N = 14;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const x = 100 + Math.random() * 1240;
      const y = 100 + Math.random() * 700;
      pts.push({ x, y });
      nodes.innerHTML += `<circle cx="${x}" cy="${y}" r="3" fill="#00D4C2"><animate attributeName="r" values="3;6;3" dur="${2 + Math.random() * 3}s" repeatCount="indefinite"/></circle>`;
    }
    // Connect random pairs
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (Math.random() < 0.3) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 350) {
            lines.innerHTML += `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}" stroke="url(#sigGrad)" stroke-width="1" opacity="0.4">
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur="${3 + Math.random() * 3}s" repeatCount="indefinite"/>
            </line>`;
          }
        }
      }
    }
  }

  /* ---------- Request chips ---------- */
  function injectChips() {
    const host = document.getElementById('requestChips');
    if (!host) return;
    host.innerHTML = T.contact.requestTypes.map((rt, i) => `
      <button type="button" class="chip" data-chip="${i}">
        <span class="chip__check"></span>
        ${rt}
      </button>
    `).join('');
    host.querySelectorAll('[data-chip]').forEach(c => {
      c.addEventListener('click', () => c.classList.toggle('on'));
    });
  }

  /* ---------- Form validation + submit ---------- */
  function setupForm() {
    const form = document.getElementById('consultFormEl');
    if (!form) return;
    const submitLabel = form.querySelector('[data-submit-label]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Honeypot
      if (form.elements.website.value) return;

      let valid = true;
      const fullName = form.elements.fullName;
      const phone = form.elements.phone;
      const errs = form.querySelectorAll('[data-error]');

      errs.forEach(e => e.classList.add('hidden'));

      if (!fullName.value.trim()) {
        const err = form.querySelector('[data-error="fullName"]');
        if (err) err.classList.remove('hidden');
        valid = false;
      }
      if (!/^09\d{9}$/.test(phone.value)) {
        const err = form.querySelector('[data-error="phone"]');
        if (err) err.classList.remove('hidden');
        valid = false;
      }

      if (!valid) return;

      // Loading state
      submitLabel.textContent = 'در حال ارسال…';
      form.querySelector('button[type=submit]').disabled = true;

      setTimeout(() => {
        // Hide form, show success
        form.style.display = 'none';
        const success = document.getElementById('successState');
        success.classList.remove('hidden');

        // Confetti of tiny hexagons
        if (window.gsap && !window.ECONORIS.reduced) {
          const colors = ['#FF4FA3', '#7C4DFF', '#00D4C2', '#FFB938', '#2F6BFF'];
          for (let i = 0; i < 20; i++) {
            const hex = document.createElement('div');
            hex.style.cssText = `position:absolute; left:50%; top:50%; width:10px; height:10px; pointer-events:none; background:${colors[i%colors.length]}; clip-path: polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);`;
            success.appendChild(hex);
            const ang = (i / 20) * Math.PI * 2;
            window.gsap.to(hex, {
              x: Math.cos(ang) * 180, y: Math.sin(ang) * 180,
              rotation: 360, opacity: 0, duration: 1.2, ease: 'power2.out',
            });
          }
        }

        // Call stub
        const selected = Array.from(document.querySelectorAll('[data-chip].on')).map(c => c.textContent.trim());
        const payload = {
          fullName: fullName.value,
          phone: phone.value,
          email: form.elements.email.value,
          message: form.elements.message.value,
          requestTypes: selected,
        };
        // eslint-disable-next-line no-console
        console.log('[Econoris] Consultation request (stub):', payload);
        if (typeof window.submitConsultationRequest === 'function') {
          window.submitConsultationRequest(payload);
        }
      }, 1200);
    });
  }

  /* ---------- Copy to clipboard ---------- */
  function setupCopy() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const what = btn.dataset.copy;
        let text = '';
        if (what === 'address') text = document.getElementById('addressText').textContent;
        if (what === 'phone') text = C.phone;
        try {
          await navigator.clipboard.writeText(text);
          const original = btn.innerHTML;
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5L20 7"/></svg> کپی شد`;
          setTimeout(() => { btn.innerHTML = original; }, 1800);
        } catch (e) {}
      });
    });
  }

  /* ---------- Lazy-load OSM iframe ---------- */
  function setupMap() {
    const btn = document.getElementById('loadMapBtn');
    const frame = document.getElementById('osmFrame');
    if (!btn || !frame) return;
    btn.addEventListener('click', () => {
      frame.classList.remove('hidden');
      frame.innerHTML = `<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=59.5,36.25,59.7,36.4&layer=mapnik&marker=36.31,59.6" class="w-full h-full" loading="lazy" style="border:0;"></iframe>`;
      btn.style.display = 'none';
    });
  }

  /* ---------- Animations ---------- */
  function runAnimations() {
    const E = window.ECONORIS;
    const gsap = window.gsap;
    if (!gsap) return;
    const startHero = () => {
      if (E.heroReveal) E.heroReveal('[data-hero-title]');
    };
    if (document.getElementById('preloader')) {
      document.addEventListener('econoris:preloader-done', startHero, { once: true });
      setTimeout(startHero, 3500);
    } else setTimeout(startHero, 200);
  }
})();
