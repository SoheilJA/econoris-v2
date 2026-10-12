/**
 * Econoris — page-about.js
 * Injects chapters + value-chain SVG; runs GSAP hero reveal, chapter pinned visual sync,
 * value-chain draw-on-scroll.
 */
(function () {
  const T = window.ECONORIS_CONTENT.fa;
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectChapters();
    injectValueChain();
    runAnimations();
  });

  /* ---------- Chapters ---------- */
  function injectChapters() {
    const host = document.getElementById('chapterList');
    if (!host) return;
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FF4FA3', '#FFB938', '#FF6B6B', '#B6F23A'];
    host.innerHTML = T.about.chapters.map((c, i) => `
      <article class="chapter reveal relative glass rounded-3xl p-8 md:p-10" data-chapter-index="${i}">
        <div class="flex items-baseline gap-4 mb-4">
          <span class="text-5xl md:text-6xl font-extrabold leading-none" style="color: ${colors[i % colors.length]};">${fa(i+1).padStart(2, '۰')}</span>
          <span class="text-xs opacity-50 tracking-widest">فصل ${fa(i+1)} از ${fa(T.about.chapters.length)}</span>
        </div>
        <h3 class="text-xl md:text-2xl font-extrabold mb-4 leading-snug" style="color: ${colors[i % colors.length]};">${c.title}</h3>
        <p class="text-white/80 leading-loose">${c.body}</p>
        <!-- Side accent -->
        <div class="absolute top-0 bottom-0 right-0 w-1 rounded-l-full" style="background: ${colors[i % colors.length]}; opacity: 0.6;"></div>
      </article>
    `).join('');

    // Update counter
    const counter = document.getElementById('chapterCount');
    if (counter) counter.textContent = `از ${fa(T.about.chapters.length)}`;
  }

  /* ---------- Value chain ---------- */
  function injectValueChain() {
    const svgHost = document.getElementById('chainNodes');
    const mobileHost = document.getElementById('chainMobile');
    if (!svgHost || !mobileHost) return;

    const chain = T.about.valueChain;
    const N = chain.length;
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FFB938', '#FF4FA3', '#B6F23A'];
    const icons = ['flask', 'beaker', 'test', 'shield', 'factory', 'market'];

    // SVG: nodes spread along x=100..1100 (RTL: first item at right via reversed order in markup)
    // Position: distribute N nodes from x=100 to x=1100
    svgHost.innerHTML = chain.map((c, i) => {
      const x = 100 + (i / (N - 1)) * 1000;
      const color = colors[i % colors.length];
      // Node circle + glow + label below + icon above
      return `
        <g class="chain-node" data-index="${i}" transform="translate(${x}, 100)">
          <circle r="30" fill="${color}22" stroke="${color}" stroke-width="1.5"/>
          <circle r="6" fill="${color}"/>
          <text y="-50" text-anchor="middle" fill="white" font-size="14" font-weight="800">${c.stage}</text>
        </g>
      `;
    }).join('');

    // Mobile
    mobileHost.innerHTML = chain.map((c, i) => `
      <div class="glass rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl grid place-items-center shrink-0" style="background: ${colors[i % colors.length]}22; color: ${colors[i % colors.length]};">
          ${svg(icons[i] || 'flask', 20)}
        </div>
        <div>
          <div class="text-xs opacity-50">${fa(i+1)}</div>
          <div class="font-bold text-sm">${c.stage}</div>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Animations ---------- */
  function runAnimations() {
    const E = window.ECONORIS;
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);

    // Hero reveal
    const startHero = () => {
      if (E.heroReveal) E.heroReveal('[data-hero-title]');
    };
    if (document.getElementById('preloader')) {
      document.addEventListener('econoris:preloader-done', startHero, { once: true });
      setTimeout(startHero, 3500);
    } else setTimeout(startHero, 200);

    // Chapter pinned side visual sync
    const chapters = document.querySelectorAll('[data-chapter-index]');
    const numEl = document.getElementById('chapterNumber');
    if (chapters.length && numEl) {
      chapters.forEach((c, i) => {
        ST.create({
          trigger: c,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => numEl.textContent = fa(i + 1).padStart(2, '۰'),
          onEnterBack: () => numEl.textContent = fa(i + 1).padStart(2, '۰'),
        });
      });
    }

    // Value chain: draw the line + pop each node
    if (!E.reduced) {
      const linePath = document.querySelector('#valueChainSVG path.draw-path');
      if (linePath) {
        const len = linePath.getTotalLength();
        linePath.style.setProperty('--len', len);
        linePath.style.strokeDasharray = len;
        linePath.style.strokeDashoffset = len;
        gsap.to(linePath, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: '#valueChain', start: 'top 70%' },
        });
      }
      // Pop nodes
      gsap.from('.chain-node', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        stagger: 0.15,
        scrollTrigger: { trigger: '#valueChain', start: 'top 65%' },
        transformOrigin: '50% 50%',
      });
    }
  }
})();
