/**
 * Econoris — page-home.js
 * Home page: injects services cards, projects rail, testimonials, magazine;
 * runs GSAP hero reveal, parallax, idea→market journey, counters.
 */
(function () {
  const C = window.ECONORIS_CONFIG;
  const T = window.ECONORIS_CONTENT.fa;
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectServices();
    injectJourneySteps();
    injectProjects();
    injectTestimonials();
    injectMagazine();
    runAnimations();
  });

  /* ---------- Services cards ---------- */
  function injectServices() {
    const host = document.getElementById('servicesGrid');
    if (!host) return;
    const icons = ['network', 'bulb', 'microscope'];
    host.innerHTML = T.services.map((s, i) => `
      <a href="${s.href}" class="accent-${s.accent} tilt-card spotlight relative rounded-3xl overflow-hidden p-8 reveal group"
         style="background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.08); transition-delay: ${i * 100}ms;">
        <div class="absolute inset-0 bg-dot-grid opacity-30 group-hover:opacity-50 transition"></div>
        <div class="relative">
          <!-- Icon -->
          <div class="w-16 h-16 rounded-2xl grid place-items-center mb-6 float-slow" style="background: var(--grad-aurora);">
            <span class="text-white">${svg(icons[i], 28)}</span>
          </div>
          <!-- Latin sub-label -->
          <div class="text-xs opacity-50 mb-1 latn tracking-widest">${s.latin}</div>
          <h3 class="text-xl md:text-2xl font-extrabold mb-3" style="color: var(--accent);">${s.title}</h3>
          <p class="text-sm opacity-75 leading-relaxed mb-6">${s.desc}</p>
          <!-- CTA arrow -->
          <div class="flex items-center gap-2 text-sm font-bold" style="color: var(--accent);">
            <span>مشاهده جزئیات</span>
            <span class="transition-transform group-hover:-translate-x-1">${svg('arrow', 18)}</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  /* ---------- Journey ---------- */
  function injectJourneySteps() {
    const steps = document.getElementById('journeySteps');
    if (!steps) return;
    const icons = ['bulb', 'shield', 'flask', 'gavel', 'market'];
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FF4FA3', '#FFB938'];
    steps.innerHTML = T.journey.map((j, i) => `
      <div class="journey-step relative glass rounded-2xl p-5 transition-all duration-500" data-journey-step="${i}">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl grid place-items-center shrink-0 transition-all" style="background: ${colors[i]}22; color: ${colors[i]};">
            ${svg(icons[i], 24)}
          </div>
          <div class="flex-1">
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-xs font-bold opacity-50">${fa(i+1)}.</span>
              <h3 class="font-bold text-lg">${j.stage}</h3>
              <span class="text-[10px] opacity-50 latn">${j.latin}</span>
            </div>
            <p class="text-sm opacity-75 leading-relaxed">${j.desc}</p>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-700" style="background: ${colors[i]}; width: 0%;"></div>
      </div>
    `).join('');

    // Also place icons around the SVG circle
    const stagesGroup = document.getElementById('journeyStages');
    if (stagesGroup) {
      const cx = 200, cy = 200, r = 120;
      stagesGroup.innerHTML = T.journey.map((j, i) => {
        const a = (i / T.journey.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FF4FA3', '#FFB938'];
        return `<circle cx="${x}" cy="${y}" r="14" fill="${colors[i]}22" stroke="${colors[i]}" stroke-width="1.5" class="journey-stage-dot" data-stage="${i}"/>
                <text x="${x}" y="${y+4}" text-anchor="middle" fill="white" font-size="11" font-weight="800">${fa(i+1)}</text>`;
      }).join('');
    }
  }

  /* ---------- Projects rail ---------- */
  function injectProjects() {
    const host = document.getElementById('projectsRail');
    if (!host) return;
    const palettes = [
      ['#2F6BFF', '#7C4DFF'],
      ['#FF4FA3', '#FFB938'],
      ['#00D4C2', '#B6F23A'],
      ['#FF6B6B', '#FF4FA3'],
    ];
    host.innerHTML = T.projects.map((p, i) => {
      const [c1, c2] = palettes[i % palettes.length];
      // Unique abstract SVG art per card
      const artId = `art-${i}`;
      const art = `
        <svg viewBox="0 0 300 180" class="w-full h-full">
          <defs>
            <linearGradient id="${artId}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${c1}"/>
              <stop offset="100%" stop-color="${c2}"/>
            </linearGradient>
          </defs>
          <rect width="300" height="180" fill="url(#${artId})"/>
          <circle cx="${50 + i*40}" cy="${80 + i*15}" r="${30 - i*4}" fill="white" opacity="0.18"/>
          <circle cx="${200 - i*30}" cy="${100 + i*10}" r="${50 - i*5}" fill="white" opacity="0.12"/>
          <path d="M0,${120 + i*10} Q150,${60 + i*15} 300,${100 + i*20}" stroke="white" stroke-width="2" fill="none" opacity="0.5"/>
          <polygon points="${20 + i*5},${20} ${60 + i*5},${40} ${40 + i*5},${70}" fill="white" opacity="0.2"/>
        </svg>
      `;
      return `
        <article class="snap-start shrink-0 w-[300px] md:w-[360px] tilt-card spotlight rounded-3xl overflow-hidden glass group cursor-pointer">
          <div class="relative aspect-[16/10] overflow-hidden">
            ${art}
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold glass">
              ${fa(1401 + i)}
            </div>
          </div>
          <div class="p-6">
            <h3 class="font-extrabold text-lg mb-3 leading-snug">${p.title}</h3>
            <div class="space-y-1.5 text-xs opacity-75">
              <div class="flex items-center gap-2">${svg('network', 14)} ${p.team}</div>
              <div class="flex items-center gap-2">${svg('flask', 14)} ${p.duration}</div>
              <div class="flex items-center gap-2">${svg('star', 14)} ${p.year}</div>
            </div>
            <button class="mt-4 inline-flex items-center gap-2 text-sm font-bold" style="color: var(--c-teal);">
              مشاهده پروژه ${svg('arrow', 16)}
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  /* ---------- Testimonials ---------- */
  function injectTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dots = document.getElementById('testimonialsDots');
    if (!track || !dots) return;
    const palettes = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FF4FA3', '#FFB938'];
    track.innerHTML = T.testimonials.map((t, i) => `
      <div class="shrink-0 w-full p-8 md:p-12 text-center" data-slide="${i}">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full grid place-items-center text-2xl font-extrabold"
             style="background: linear-gradient(135deg, ${palettes[i]}, ${palettes[(i+1) % palettes.length]}); box-shadow: 0 0 30px ${palettes[i]}66;">
          ${t.name.charAt(0)}
        </div>
        <div class="flex justify-center gap-1 mb-4">
          ${[1,2,3,4,5].map(() => `<span class="text-[var(--c-amber)]">${svg('star', 18)}</span>`).join('')}
        </div>
        <p class="text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto">«${t.quote}»</p>
        <div class="font-bold">${t.name}</div>
      </div>
    `).join('');
    dots.innerHTML = T.testimonials.map((_, i) => `<button class="w-2 h-2 rounded-full transition-all duration-300 ${i===0 ? 'w-8 bg-[var(--c-teal)]' : 'bg-white/30'}" data-dot="${i}" aria-label="اسلاید ${i+1}"></button>`).join('');

    let current = 0;
    const N = T.testimonials.length;
    const go = (n) => {
      current = (n + N) % N;
      track.style.transform = `translateX(${current * 100}%)`;
      dots.querySelectorAll('[data-dot]').forEach((d, di) => {
        d.classList.toggle('w-8', di === current);
        d.classList.toggle('bg-[var(--c-teal)]', di === current);
        d.classList.toggle('bg-white/30', di !== current);
      });
    };
    document.querySelector('[data-testimonial-next]').addEventListener('click', () => go(current + 1));
    document.querySelector('[data-testimonial-prev]').addEventListener('click', () => go(current - 1));
    dots.querySelectorAll('[data-dot]').forEach(d => d.addEventListener('click', e => go(+e.currentTarget.dataset.dot)));

    // Autoplay
    let timer = setInterval(() => go(current + 1), 6000);
    const slider = document.getElementById('testimonialsSlider');
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => { timer = setInterval(() => go(current + 1), 6000); });

    // Touch swipe
    let sx = null;
    track.addEventListener('touchstart', e => sx = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(current + (dx > 0 ? -1 : 1));
      sx = null;
    });
  }

  /* ---------- Magazine ---------- */
  function injectMagazine() {
    const host = document.getElementById('magazineGrid');
    if (!host) return;
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FF4FA3', '#FFB938', '#FF6B6B', '#B6F23A', '#FF4FA3'];
    host.innerHTML = T.magazine.map((m, i) => `
      <article class="group tilt-card spotlight rounded-3xl overflow-hidden glass reveal" style="transition-delay: ${i * 80}ms;">
        <div class="relative aspect-[16/9] overflow-hidden">
          <div class="absolute inset-0" style="background: linear-gradient(135deg, ${colors[i % colors.length]}33, ${colors[(i+1) % colors.length]}22);"></div>
          <div class="absolute inset-0 bg-dot-grid opacity-40"></div>
          <!-- decorative SVG -->
          <svg viewBox="0 0 200 120" class="absolute inset-0 w-full h-full">
            <circle cx="${30 + (i*23) % 140}" cy="${40 + (i*17) % 60}" r="${20 + (i*3) % 25}" fill="${colors[i % colors.length]}" opacity="0.35"/>
            <circle cx="${150 - (i*13) % 100}" cy="${70 + (i*7) % 30}" r="${15 + (i*5) % 20}" fill="${colors[(i+1) % colors.length]}" opacity="0.4"/>
          </svg>
          <!-- Top accent bar -->
          <div class="absolute top-0 left-0 right-0 h-1" style="background: ${colors[i % colors.length]};"></div>
          <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold glass">${m.cat}</div>
          <div class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold glass flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            ${m.read}
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-extrabold text-base md:text-lg leading-snug mb-3 group-hover:text-[var(--c-teal)] transition">${m.title}</h3>
          <p class="text-xs opacity-65 leading-relaxed mb-4">${m.teaser}</p>
          <a href="blog.html" class="inline-flex items-center gap-2 text-sm font-bold" style="color: ${colors[i % colors.length]};">
            ادامه مطلب
            <span class="transition-transform group-hover:-translate-x-1">${svg('arrow', 16)}</span>
          </a>
        </div>
      </article>
    `).join('');
  }

  /* ---------- Animations ---------- */
  function runAnimations() {
    const E = window.ECONORIS;
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);

    // Hero title reveal (wait for preloader)
    const startHero = () => {
      if (E.heroReveal) E.heroReveal('[data-hero-title]');
      // Animate floating chips in
      gsap.from('[data-parallax]', { opacity: 0, scale: 0.8, duration: 1, stagger: 0.1, delay: 0.5, ease: 'expo.out' });
    };
    if (document.getElementById('preloader')) {
      document.addEventListener('econoris:preloader-done', startHero, { once: true });
      // Fallback: start after 3.5s max
      setTimeout(startHero, 3500);
    } else {
      setTimeout(startHero, 200);
    }

    // Parallax
    if (E.parallax && !E.reduced) E.parallax('[data-parallax]');

    // Journey pinned story
    if (!E.reduced) {
      const steps = document.querySelectorAll('[data-journey-step]');
      const stageDots = document.querySelectorAll('.journey-stage-dot');
      const stageName = document.getElementById('journeyStageName');
      const stageLatin = document.getElementById('journeyStageLatin');
      const visual = document.querySelector('[data-story-visual]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-journey-root]',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 0.8,
        },
      });

      steps.forEach((step, i) => {
        tl.to(step, { borderColor: 'rgba(0,212,194,0.4)', boxShadow: '0 0 30px rgba(0,212,194,0.2)' }, i * 0.2);
        tl.to(step.querySelector('.absolute'), { width: '100%' }, i * 0.2);
        if (stageDots[i]) {
          tl.to(stageDots[i], { attr: { r: 18 }, fill: () => stageDots[i].getAttribute('stroke') }, i * 0.2);
        }
        tl.call(() => {
          if (stageName) stageName.textContent = T.journey[i].stage;
          if (stageLatin) stageLatin.textContent = T.journey[i].latin;
        }, null, i * 0.2);
      });

      // Visual slow rotation
      gsap.to(visual, { rotation: 360, duration: 60, repeat: -1, ease: 'none' });
    }
  }
})();
