/**
 * Econoris — page-information-resources.js
 * Search bar typing animation, 7 challenge flip cards, 8 resource tiles.
 */
(function () {
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectChallenges();
    injectResources();
    setupTyping();
    runAnimations();
  });

  /* ---------- Typing animation ---------- */
  function setupTyping() {
    const el = document.getElementById('typedQuery');
    const chipsHost = document.getElementById('resultChips');
    if (!el) return;
    const queries = ['monoclonal antibody', 'synbiotic', 'drug delivery', 'pharmacokinetics'];
    const resultsPerQuery = {
      'monoclonal antibody': ['125 articles', '8 trials', '3 patents'],
      'synbiotic': ['42 articles', '2 reviews'],
      'drug delivery': ['318 articles', '15 trials'],
      'pharmacokinetics': ['527 articles', '12 guidelines'],
    };
    let qi = 0, ci = 0;

    function type() {
      const q = queries[qi];
      if (ci < q.length) {
        el.textContent = q.substring(0, ci + 1);
        ci++;
        setTimeout(type, 80 + Math.random() * 60);
      } else {
        // Show results
        const results = resultsPerQuery[q] || [];
        chipsHost.innerHTML = '';
        results.forEach((r, i) => {
          setTimeout(() => {
            const chip = document.createElement('span');
            chip.className = 'chip text-xs on';
            chip.textContent = r;
            chip.style.opacity = '0';
            chip.style.transform = 'translateY(10px)';
            chipsHost.appendChild(chip);
            requestAnimationFrame(() => {
              chip.style.transition = 'opacity 0.4s, transform 0.4s';
              chip.style.opacity = '1';
              chip.style.transform = 'translateY(0)';
            });
          }, i * 200);
        });
        // Wait then delete and move on
        setTimeout(() => {
          // Fade out results
          chipsHost.querySelectorAll('.chip').forEach(c => c.style.opacity = '0');
          // Delete characters
          setTimeout(del, 600);
        }, 2500);
      }
    }
    function del() {
      const q = queries[qi];
      if (ci > 0) {
        el.textContent = q.substring(0, ci);
        ci--;
        setTimeout(del, 40);
      } else {
        qi = (qi + 1) % queries.length;
        setTimeout(type, 400);
      }
    }

    // Start typing when section is visible
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { type(); io.disconnect(); }
      });
    }, { threshold: 0.5 });
    io.observe(el);
  }

  /* ---------- 7 challenges as flip cards ---------- */
  function injectChallenges() {
    const host = document.getElementById('challengesGrid');
    if (!host) return;
    const items = [
      { problem: 'هزینه‌های بالای اشتراک در پایگاه‌های داده و ژورنال‌ها', solution: 'اکونوریس اشتراک‌های سازمانی را برای تیم‌های استارتاپی فراهم می‌کند.' },
      { problem: 'دشواری شناسایی منابع معتبر و مرتبط', solution: 'مشاوره تخصصی برای انتخاب منابع مرتبط با حوزه پژوهش.' },
      { problem: 'محدودیت در دانلود متن کامل مقالات و کتب', solution: 'دسترسی نامحدود به متن کامل مقالات و کتب الکترونیکی.' },
      { problem: 'نیاز به ابزارهای پیشرفته تحلیل داده (AI، پردازش داده)', solution: 'دسترسی به ابزارهای هوش مصنوعی و پردازش داده‌های تخصصی.' },
      { problem: 'دسترسی به خدمات آنلاین آموزشی تخصصی', solution: 'دسترسی به دوره‌های آموزشی بین‌المللی مرتبط با داروسازی.' },
      { problem: 'کمبود دسترسی سازمانی (مانند دانشگاه‌ها)', solution: 'ایجاد دسترسی سازمانی فراتر از محدودیت‌های دانشگاهی.' },
      { problem: 'مدیریت چندین پلتفرم اطلاعاتی', solution: 'بستر یکپارچه برای مدیریت و دسترسی به چندین منبع اطلاعاتی.' },
    ];
    host.innerHTML = items.map((it, i) => `
      <div class="reveal flip-card relative h-48 cursor-pointer" style="perspective:1000px;transition-delay:${i * 60}ms;" data-flip>
        <div class="flip-inner relative w-full h-full transition-transform duration-700" style="transform-style:preserve-3d;">
          <!-- Front (problem) -->
          <div class="absolute inset-0 glass rounded-3xl p-6 flex flex-col justify-between" style="backface-visibility:hidden;">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg grid place-items-center" style="background:rgba(255,107,107,0.15);color:var(--c-coral);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
              </span>
              <span class="text-[10px] font-bold tracking-widest" style="color:var(--c-coral);">چالش</span>
            </div>
            <h4 class="font-bold text-sm md:text-base leading-snug">${it.problem}</h4>
            <div class="text-[10px] opacity-50">برای مشاهده راه‌حل کلیک کنید</div>
          </div>
          <!-- Back (solution) -->
          <div class="absolute inset-0 rounded-3xl p-6 flex flex-col justify-between" style="backface-visibility:hidden;transform:rotateY(180deg);background:linear-gradient(135deg,rgba(0,212,194,0.18),rgba(47,107,255,0.18));border:1px solid rgba(0,212,194,0.3);">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg grid place-items-center" style="background:rgba(0,212,194,0.2);color:var(--c-teal);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 5 5L20 7"/></svg>
              </span>
              <span class="text-[10px] font-bold tracking-widest" style="color:var(--c-teal);">راه‌حل اکونوریس</span>
            </div>
            <p class="text-sm leading-relaxed">${it.solution}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Flip on click
    host.querySelectorAll('[data-flip]').forEach(card => {
      card.addEventListener('click', () => {
        const inner = card.querySelector('.flip-inner');
        inner.style.transform = inner.style.transform.includes('180deg') ? 'rotateY(0deg)' : 'rotateY(180deg)';
      });
    });
  }

  /* ---------- 8 resource tiles ---------- */
  function injectResources() {
    const host = document.getElementById('resourcesGrid');
    if (!host) return;
    const items = [
      { t: 'اشتراک در پایگاه‌های داده علمی بین‌المللی معتبر', latin: 'PubMed, Scopus, Web of Science, SciFinder, Reaxys' },
      { t: 'دسترسی به مجموعه‌ای گسترده از ژورنال‌های تخصصی داروسازی و علوم مرتبط', latin: 'Journals' },
      { t: 'دسترسی به گزارش‌های بازار و تحلیل‌های صنعت داروسازی', latin: 'Market Reports' },
      { t: 'دسترسی به ابزارهای هوش مصنوعی، داده‌کاوی و پردازش داده‌های تخصصی', latin: 'AI Tools' },
      { t: 'امکان دانلود نامحدود انواع مقالات علمی و کتب الکترونیکی تخصصی', latin: 'Unlimited Downloads' },
      { t: 'دسترسی به معتبرترین کتابخانه‌های آنلاین ملی و بین‌المللی', latin: 'Libraries' },
      { t: 'دسترسی به داده‌های کارآزمایی‌های بالینی', latin: 'Clinical Trials' },
      { t: 'دسترسی به خدمات آنلاین آموزش بین‌المللی مرتبط با داروسازی و علوم زیستی', latin: 'Education' },
    ];
    const icons = ['book', 'book', 'market', 'network', 'book', 'book', 'test', 'globe'];
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#FFB938', '#FF4FA3', '#B6F23A', '#FF6B6B', '#2F6BFF'];
    host.innerHTML = items.map((it, i) => `
      <div class="reveal glass rounded-2xl p-6 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <div class="w-12 h-12 rounded-xl grid place-items-center mb-4 float-slow" style="background:${colors[i % colors.length]}22;color:${colors[i % colors.length]};">
          ${svg(icons[i % icons.length], 22)}
        </div>
        <div class="flex items-baseline gap-2 mb-2">
          <span class="text-2xl font-extrabold" style="color:${colors[i % colors.length]};">${fa(i+1)}</span>
          <span class="text-[9px] opacity-50 latn tracking-widest">${it.latin}</span>
        </div>
        <h4 class="font-bold text-sm md:text-base leading-snug">${it.t}</h4>
      </div>
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
