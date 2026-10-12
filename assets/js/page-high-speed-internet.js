/**
 * Econoris — page-high-speed-internet.js
 */
(function () {
  const fa = window.toFa;

  document.addEventListener('DOMContentLoaded', () => {
    injectBenefits();
    injectActivities();
    runAnimations();
  });

  function injectBenefits() {
    const host = document.getElementById('benefitsGrid');
    if (!host) return;
    const items = [
      { t: 'افزایش چشمگیر بهره‌وری و صرفه‌جویی در زمان', d: 'با اتصال پایدار و پرسرعت، فعالیت‌های پژوهشی بدون وقفه و با حداکثر کارایی انجام می‌شوند.' },
      { t: 'امکان استفاده مؤثر از منابع اطلاعاتی پولی و اشتراکی', d: 'دسترسی بی‌وقفه به پایگاه‌های داده پولی، ارزش اشتراک‌ها را به‌حداکثر می‌رساند.' },
      { t: 'تسهیل همکاری‌های آنلاین و دسترسی به تخصص جهانی', d: 'ارتباط با متخصصان بین‌المللی و تیم‌های دور، به‌سادگی امکان‌پذیر می‌شود.' },
      { t: 'پشتیبانی از ابزارها و پلتفرم‌های نرم‌افزاری پیشرفته آنلاین', d: 'ابزارهای ابری و پلتفرم‌های تحلیل داده، با پهنای باند بالا بهینه کار می‌کنند.' },
      { t: 'به‌روز ماندن با آخرین یافته‌ها و روندهای علمی', d: 'دسترسی آنی به مقالات، کنفرانس‌ها و اخبار علمی، تیم را به‌روز نگه می‌دارد.' },
    ];
    host.innerHTML = items.map((b, i) => `
      <div class="reveal glass rounded-2xl p-6 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-9 h-9 rounded-lg grid place-items-center shrink-0" style="background:var(--grad-aurora);color:white;font-weight:800;font-size:0.9rem;">${fa(i+1)}</span>
          <h4 class="font-bold text-sm md:text-base">${b.t}</h4>
        </div>
        <p class="text-xs md:text-sm opacity-75 leading-relaxed">${b.d}</p>
      </div>
    `).join('');
  }

  function injectActivities() {
    const host = document.getElementById('activitiesGrid');
    if (!host) return;
    const items = [
      'جستجو و دانلود مقالات و کتب علمی حجیم',
      'دسترسی و کار با پایگاه‌های داده ژنومیک/پروتئومیک/شیمیایی آنلاین',
      'استفاده از نرم‌افزارها و پلتفرم‌های ابری تحلیل داده',
      'شرکت در وبینارها و کنفرانس‌های آنلاین و جلسات از راه دور',
      'بارگذاری و دانلود مجموعه‌داده‌های بزرگ تحقیقاتی',
      'دسترسی به اطلاعات رگولاتوری و گایدلاین‌های بین‌المللی',
    ];
    const icons = ['book', 'network', 'globe', 'mail', 'flask', 'shield'];
    const svg = window.ECONORIS_SVG;
    host.innerHTML = items.map((it, i) => `
      <div class="reveal glass rounded-2xl p-6 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl grid place-items-center shrink-0 float-slow" style="background:var(--grad-aurora);">
            <span class="text-white">${svg(icons[i % icons.length], 22)}</span>
          </div>
          <div>
            <div class="text-xs opacity-50 mb-1">${fa(i+1)}</div>
            <h4 class="font-bold text-sm md:text-base leading-snug">${it}</h4>
          </div>
        </div>
      </div>
    `).join('');
  }

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

    // Animate download bars + speedometer needle
    if (!E.reduced) {
      // Speed arc draw
      const arc = document.getElementById('speedArc');
      if (arc && arc.getTotalLength) {
        const len = arc.getTotalLength();
        arc.style.strokeDasharray = len;
        arc.style.strokeDashoffset = len;
        gsap.to(arc, {
          strokeDashoffset: 0,
          duration: 2.4, ease: 'expo.out',
          scrollTrigger: { trigger: arc.closest('section'), start: 'top 70%' },
        });
      }
      // Needle rotation
      const needle = document.getElementById('speedNeedle');
      if (needle) {
        gsap.fromTo(needle, { rotation: -60, transformOrigin: '120px 140px' }, {
          rotation: 30, duration: 2.4, ease: 'expo.out',
          scrollTrigger: { trigger: needle.closest('section'), start: 'top 70%' },
        });
      }
      // Download bars
      document.querySelectorAll('[data-bar]').forEach(bar => {
        const w = bar.dataset.bar;
        gsap.to(bar, { width: w + '%', duration: 1.6, ease: 'expo.out',
          scrollTrigger: { trigger: bar.closest('section'), start: 'top 70%' } });
      });
    }
  }
})();
