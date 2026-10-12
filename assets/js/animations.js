/**
 * Econoris — animations.js
 * Shared GSAP-powered animation helpers used by all pages.
 */
(function () {
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  if (!gsap || !ST) return;
  gsap.registerPlugin(ST);

  const E = window.ECONORIS = window.ECONORIS || {};

  /* Split a string into word/char spans for stagger reveals */
  E.splitWords = function (el) {
    const text = el.textContent.trim();
    el.innerHTML = '';
    text.split(' ').forEach(w => {
      const span = document.createElement('span');
      span.textContent = w;
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.style.marginInlineEnd = '0.25em';
      const inner = document.createElement('span');
      inner.textContent = w;
      inner.style.display = 'inline-block';
      inner.style.transform = 'translateY(110%)';
      span.textContent = '';
      span.appendChild(inner);
      el.appendChild(span);
      return inner;
    });
    return Array.from(el.querySelectorAll('span > span'));
  };

  E.splitChars = function (el) {
    const text = el.textContent.trim();
    el.innerHTML = '';
    return text.split('').map(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      el.appendChild(span);
      return span;
    });
  };

  /* Hero headline reveal */
  E.heroReveal = function (selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const words = E.splitWords(el);
    gsap.to(words, {
      y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.2,
    });
  };

  /* Generic stagger reveal — children fade-up */
  E.stagger = function (parentSelector, childSelector, opts = {}) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    const children = parent.querySelectorAll(childSelector);
    gsap.from(children, {
      opacity: 0, y: 40, duration: 0.8, ease: 'expo.out', stagger: 0.08, ...opts,
      scrollTrigger: { trigger: parent, start: 'top 80%', ...(opts.scrollTrigger || {}) },
    });
  };

  /* Parallax layers */
  E.parallax = function (selector, opts = {}) {
    document.querySelectorAll(selector).forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0.2);
      gsap.to(el, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  };

  /* SVG path draw-on-scroll */
  E.drawPaths = function (svgSelector) {
    document.querySelectorAll(svgSelector + ' path.draw-path, ' + svgSelector + ' .draw-path').forEach(p => {
      const len = p.getTotalLength ? p.getTotalLength() : 1000;
      p.style.setProperty('--len', len);
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      gsap.to(p, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: p.closest('section') || p, start: 'top 75%' },
      });
    });
  };

  /* Pinned scroll story: stages-driven morph visual.
     Usage: E.pinnedStory(rootSelector, numberOfStages, { onStageChange })
     Each stage triggers a callback and toggles `data-stage` on the visual. */
  E.pinnedStory = function (rootSelector, numberOfStages, opts = {}) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const visual = root.querySelector('[data-story-visual]');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) { root.classList.add('stepper'); return; }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: '+=' + (numberOfStages * 100) + '%',
        scrub: 1,
        pin: true,
      },
    });

    for (let i = 0; i < numberOfStages; i++) {
      tl.call(() => {
        if (visual) {
          visual.dataset.stage = String(i);
          visual.dispatchEvent(new CustomEvent('stage', { detail: i }));
        }
        if (typeof opts.onStageChange === 'function') opts.onStageChange(i);
      }, null, i === 0 ? 0 : '+=' + (1 / numberOfStages));
    }
  };

  /* Horizontal pinned rail */
  E.horizontalRail = function (railSelector) {
    const rail = document.querySelector(railSelector);
    if (!rail) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return; // mobile uses native overflow-x scroll
    const track = rail.querySelector('[data-rail-track]');
    if (!track) return;
    const totalScroll = track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: rail,
        start: 'top top',
        end: '+=' + totalScroll,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  };

  /* Counter using GSAP */
  E.counter = function (el) {
    const fa = window.toFa;
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'expo.out',
      onUpdate: () => { el.textContent = fa(Math.floor(obj.v)) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  };

  /* Tab switching with animated indicator */
  E.tabs = function (rootSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const tabs = root.querySelectorAll('[data-tab]');
    const panels = root.querySelectorAll('[data-panel]');
    let indicator = root.querySelector('[data-tab-indicator]');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.setAttribute('data-tab-indicator', '');
      indicator.style.cssText = 'position:absolute;bottom:0;height:3px;background:var(--grad-aurora);border-radius:3px;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);';
      root.appendChild(indicator);
    }
    function moveIndicator(tab) {
      indicator.style.left = tab.offsetLeft + 'px';
      indicator.style.width = tab.offsetWidth + 'px';
    }
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        t.classList.add('active');
        const target = t.dataset.tab;
        const panel = root.querySelector(`[data-panel="${target}"]`);
        if (panel) {
          panel.classList.add('active');
          gsap.fromTo(panel.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'expo.out' });
        }
        moveIndicator(t);
      });
    });
    // Init
    const active = root.querySelector('[data-tab].active') || tabs[0];
    if (active) {
      active.classList.add('active');
      const panel = root.querySelector(`[data-panel="${active.dataset.tab}"]`);
      if (panel) panel.classList.add('active');
      setTimeout(() => moveIndicator(active), 100);
    }
  };
})();
