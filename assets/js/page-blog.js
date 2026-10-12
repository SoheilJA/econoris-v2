/**
 * Econoris — page-blog.js
 * Filter chips + grid of magazine articles.
 */
(function () {
  const T = window.ECONORIS_CONTENT.fa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectFilters();
    injectGrid();
    runAnimations();
  });

  function injectFilters() {
    const host = document.getElementById('filterChips');
    if (!host) return;
    const cats = ['همه', ...new Set(T.magazine.map(m => m.cat))];
    host.innerHTML = cats.map((c, i) => `
      <button class="chip ${i === 0 ? 'on' : ''}" data-filter="${c}">${c}</button>
    `).join('');
    host.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        host.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.dataset.filter;
        document.querySelectorAll('#blogGrid > article').forEach(a => {
          const cat = a.dataset.cat;
          a.style.display = (f === 'همه' || cat === f) ? '' : 'none';
        });
      });
    });
  }

  function injectGrid() {
    const host = document.getElementById('blogGrid');
    if (!host) return;
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FF4FA3', '#FFB938', '#FF6B6B', '#B6F23A', '#FF4FA3'];
    host.innerHTML = T.magazine.map((m, i) => `
      <article data-cat="${m.cat}" class="group tilt-card spotlight rounded-3xl overflow-hidden glass reveal" style="transition-delay:${i * 60}ms;">
        <div class="relative aspect-[16/9] overflow-hidden">
          <div class="absolute inset-0" style="background:linear-gradient(135deg,${colors[i % colors.length]}33,${colors[(i+1) % colors.length]}22);"></div>
          <div class="absolute inset-0 bg-dot-grid opacity-40"></div>
          <svg viewBox="0 0 200 120" class="absolute inset-0 w-full h-full">
            <circle cx="${30 + (i*23) % 140}" cy="${40 + (i*17) % 60}" r="${20 + (i*3) % 25}" fill="${colors[i % colors.length]}" opacity="0.35"/>
            <circle cx="${150 - (i*13) % 100}" cy="${70 + (i*7) % 30}" r="${15 + (i*5) % 20}" fill="${colors[(i+1) % colors.length]}" opacity="0.4"/>
          </svg>
          <div class="absolute top-0 left-0 right-0 h-1" style="background:${colors[i % colors.length]};"></div>
          <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold glass">${m.cat}</div>
          <div class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold glass flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            ${m.read}
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-extrabold text-base md:text-lg leading-snug mb-3 group-hover:text-[var(--c-teal)] transition">${m.title}</h3>
          <p class="text-xs opacity-65 leading-relaxed mb-4">${m.teaser}</p>
          <a href="#" class="inline-flex items-center gap-2 text-sm font-bold" style="color:${colors[i % colors.length]};">
            ادامه مطلب
            <span class="transition-transform group-hover:-translate-x-1">${svg('arrow', 16)}</span>
          </a>
        </div>
      </article>
    `).join('');
  }

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
