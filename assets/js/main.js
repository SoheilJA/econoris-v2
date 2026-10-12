/**
 * Econoris — main.js
 * Global interactions: smooth scroll, mega menu, mobile drawer, search overlay,
 * cursor spotlight, magnetic buttons, tilt cards, scroll reveals, counters,
 * marquee, scroll progress, page transitions, mobile bar hide/show.
 */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initHeaderScroll();
    initMegaMenu();
    initMobileDrawer();
    initSearchOverlay();
    initCursor();
    initMagnetic();
    initTilt();
    initSpotlight();
    initReveals();
    initCounters();
    initMarquee();
    initMobileBar();
    initBackToTop();
    initPageTransitions();
    initSmoothScroll();
    initAccordions();
  });

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const upd = () => {
      const h = document.documentElement;
      const p = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = Math.min(100, p) + '%';
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------- Header scroll behavior ---------- */
  let lastY = 0;
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 30) header.classList.add('solid');
      else header.classList.remove('solid');
      if (y > 200 && y > lastY) header.classList.add('hide');
      else header.classList.remove('hide');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mega menu ---------- */
  function initMegaMenu() {
    const trigger = document.querySelector('[data-mega-trigger]');
    const mega = document.querySelector('[data-mega]');
    const btn = document.querySelector('[data-mega-btn]');
    if (!trigger || !mega || !btn) return;
    let open = false;
    const openMega = () => { mega.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); open = true; };
    const closeMega = () => { mega.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); open = false; };
    trigger.addEventListener('mouseenter', openMega);
    trigger.addEventListener('mouseleave', () => { setTimeout(() => { if (!trigger.matches(':hover')) closeMega(); }, 150); });
    btn.addEventListener('click', (e) => { e.preventDefault(); open ? closeMega() : openMega(); });
    btn.addEventListener('focus', openMega);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMega(); });
    document.addEventListener('click', (e) => { if (!trigger.contains(e.target)) closeMega(); });
  }

  /* ---------- Mobile drawer ---------- */
  function initMobileDrawer() {
    const drawer = document.querySelector('[data-drawer]');
    if (!drawer) return;
    const openBtn = document.querySelector('[data-drawer-open]');
    const closeEls = drawer.querySelectorAll('[data-drawer-close]');
    const body = document.body;
    let isOpen = false;
    const openIt = () => {
      drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); body.classList.add('no-scroll'); isOpen = true;
      // Stagger links
      drawer.querySelectorAll('.drawer__link').forEach((l, i) => { l.style.transitionDelay = (100 + i * 60) + 'ms'; });
    };
    const closeIt = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); body.classList.remove('no-scroll'); isOpen = false; };
    if (openBtn) openBtn.addEventListener('click', openIt);
    closeEls.forEach(el => el.addEventListener('click', closeIt));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeIt(); });
  }

  /* ---------- Accordion (mobile drawer services) ---------- */
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(acc => {
      const tr = acc.querySelector('[data-accordion-trigger]');
      const ct = acc.querySelector('[data-accordion-content]');
      const ic = acc.querySelector('[data-accordion-icon]');
      if (!tr || !ct) return;
      let open = false;
      tr.addEventListener('click', () => {
        open = !open;
        if (open) {
          ct.style.maxHeight = ct.scrollHeight + 'px';
          if (ic) ic.style.transform = 'rotate(180deg)';
        } else {
          ct.style.maxHeight = '0';
          if (ic) ic.style.transform = 'rotate(0)';
        }
      });
    });
  }

  /* ---------- Search overlay ---------- */
  function initSearchOverlay() {
    const overlay = document.querySelector('[data-search]');
    const openBtn = document.querySelector('[data-search-open]');
    if (!overlay || !openBtn) return;
    const closeBtn = overlay.querySelector('[data-search-close]');
    const input = overlay.querySelector('[data-search-input]');
    const body = document.body;
    const open = () => { overlay.classList.add('open'); body.classList.add('no-scroll'); setTimeout(() => input && input.focus(), 300); };
    const close = () => { overlay.classList.remove('open'); body.classList.remove('no-scroll'); };
    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); open(); }
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }

  /* ---------- Cursor ---------- */
  function initCursor() {
    if (isTouch) return;
    const ring = document.querySelector('.cursor-ring');
    const dot = document.querySelector('.cursor-dot');
    if (!ring || !dot) return;
    let rx = 0, ry = 0, dx = 0, dy = 0, mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.5; dy += (my - dy) * 0.5;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, .magnetic, [data-magnetic], .chip, .tilt-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (isTouch) return;
    document.querySelectorAll('[data-magnetic], .magnetic').forEach(el => {
      const strength = parseFloat(el.dataset.magneticStrength || 0.35);
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Tilt cards ---------- */
  function initTilt() {
    if (isTouch) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      const max = parseFloat(card.dataset.tiltMax || 12);
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${-cx * max}deg) rotateX(${cy * max}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Spotlight on hover ---------- */
  function initSpotlight() {
    document.querySelectorAll('.spotlight').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Scroll reveals ---------- */
  function initReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          // Word masks: also stagger inner spans
          if (en.target.classList.contains('word-mask')) {
            en.target.querySelectorAll('span').forEach((sp, i) => sp.style.transitionDelay = (i * 50) + 'ms');
          }
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal, .reveal-clip, .word-mask').forEach(el => io.observe(el));
    // Word mask: split text into spans
    document.querySelectorAll('.word-mask').forEach(wm => {
      if (wm.dataset.split === 'false') return;
      const text = wm.textContent.trim();
      wm.innerHTML = '';
      text.split(' ').forEach((w, i) => {
        const span = document.createElement('span');
        span.textContent = w;
        span.style.marginInlineEnd = '0.25em';
        wm.appendChild(span);
      });
    });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    const fa = window.toFa;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1800;
        const start = performance.now();
        function step(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = Math.floor(target * eased);
          el.textContent = fa(v) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = fa(target) + suffix;
        }
        requestAnimationFrame(step);
        // Also animate ring if present
        const ring = el.closest('[data-counter-wrap]')?.querySelector('.counter-ring circle:last-child');
        if (ring) {
          const len = 2 * Math.PI * 52;
          ring.style.strokeDasharray = len;
          ring.style.strokeDashoffset = len;
          requestAnimationFrame(() => { ring.style.strokeDashoffset = 0; });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-counter]').forEach(el => io.observe(el));
  }

  /* ---------- Marquee ---------- */
  function initMarquee() {
    document.querySelectorAll('.marquee').forEach(m => {
      // Duplicate content once for seamless loop
      m.innerHTML += m.innerHTML;
    });
  }

  /* ---------- Mobile bar hide/show ---------- */
  let mbLastY = 0;
  function initMobileBar() {
    const bar = document.getElementById('mobileBar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 200 && y > mbLastY + 5) bar.classList.add('hide');
      else if (y < mbLastY - 5) bar.classList.remove('hide');
      mbLastY = y;
    }, { passive: true });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-back-to-top]');
      if (!btn) return;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Page transitions ---------- */
  function initPageTransitions() {
    // Intercept internal links for a quick wipe transition
    const wipe = document.createElement('div');
    wipe.style.cssText = `position:fixed;inset:0;z-index:99998;background:${window.ECONORIS_CONFIG.transitionColor || '#070B1F'};pointer-events:none;transform:translateY(100%);transition:transform 0.5s cubic-bezier(0.76,0,0.24,1);`;
    document.body.appendChild(wipe);

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || a.target === '_blank' || a.hasAttribute('download')) return;
      // Same-page anchors
      try {
        const url = new URL(href, location.href);
        if (url.href === location.href) return;
        if (url.origin !== location.origin) return;
      } catch (_) { return; }
      // Internal navigation → wipe
      e.preventDefault();
      wipe.style.transform = 'translateY(0)';
      setTimeout(() => { window.location.href = href; }, 480);
    });

    // On page show (incl. back/forward), wipe away
    window.addEventListener('pageshow', () => {
      wipe.style.transform = 'translateY(-100%)';
    });
  }

  /* ---------- Smooth scroll (Lenis-lite) ---------- */
  function initSmoothScroll() {
    if (reduced) return;
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.1, easing: t => 1 - Math.pow(1 - t, 3), smoothWheel: true, smoothTouch: false });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    }
  }

  /* ---------- GSAP ScrollTrigger generic helper ---------- */
  // Expose for page scripts
  window.ECONORIS = window.ECONORIS || {};
  window.ECONORIS.reduced = reduced;
  window.ECONORIS.isTouch = isTouch;
})();
