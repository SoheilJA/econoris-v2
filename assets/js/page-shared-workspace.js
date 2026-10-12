/**
 * Econoris — page-shared-workspace.js
 * Renders the 6 services list + hover highlight on campus zones.
 */
(function () {
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectServices();
    setupCampusHover();
    runAnimations();
  });

  function injectServices() {
    const host = document.getElementById('servicesList');
    if (!host) return;
    const items = [
      { title: 'میز پژوهشی', latin: 'Research Desk', desc: 'دسترسی ساختاریافته به منابع علمی و تحلیل داده‌های پژوهشی.', href: 'research-desk.html', accent: 'violet', color: '#7C4DFF' },
      { title: 'اتاق اختصاصی پژوهشی', latin: 'Private Research Room', desc: 'بستر اختصاصی برای اجرای عمیق طرح‌های R&D.', href: 'private-research-room.html', accent: 'magenta', color: '#FF4FA3' },
      { title: 'آزمایشگاه', latin: 'Laboratory', desc: 'تجهیزات پیشرفته و مدل‌های انعطاف‌پذیر دسترسی.', href: 'laboratory.html', accent: 'teal', color: '#00D4C2' },
      { title: 'اینترنت پرسرعت', latin: 'High-Speed Internet', desc: 'دسترسی بی‌وقفه به منابع علمی و ابزارهای آنلاین.', href: 'high-speed-internet.html', accent: 'blue', color: '#2F6BFF' },
      { title: 'مشاوره حقوقی', latin: 'Legal Consulting', desc: 'حفاظت از مالکیت فکری و تدوین قراردادهای مستحکم.', href: 'legal-consulting.html', accent: 'amber', color: '#FFB938' },
      { title: 'دسترسی به منابع اطلاعاتی', latin: 'Information Resources', desc: 'پایگاه‌های داده علمی و ژورنال‌های تخصصی.', href: 'information-resources.html', accent: 'coral', color: '#FF6B6B' },
    ];
    host.innerHTML = items.map((s, i) => `
      <a href="${s.href}" class="reveal group glass rounded-3xl p-6 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-2xl grid place-items-center shrink-0 float-slow" style="background:${s.color}22;color:${s.color};">
            ${svg(['book','network','flask','globe','gavel','book'][i], 26)}
          </div>
          <div>
            <div class="text-[10px] opacity-50 latn tracking-widest">${s.latin}</div>
            <h3 class="font-extrabold text-lg" style="color:${s.color};">${s.title}</h3>
          </div>
        </div>
        <p class="text-sm opacity-75 leading-relaxed mb-4">${s.desc}</p>
        <div class="flex items-center gap-2 text-sm font-bold" style="color:${s.color};">
          <span>مشاهده جزئیات</span>
          <span class="transition-transform group-hover:-translate-x-1">${svg('arrow', 16)}</span>
        </div>
      </a>
    `).join('');
  }

  function setupCampusHover() {
    // Pulse zones
    document.querySelectorAll('.campus-zone').forEach((z, i) => {
      z.style.cursor = 'pointer';
      z.style.transition = 'transform 0.3s var(--ease-out-expo)';
      z.addEventListener('mouseenter', () => { z.style.transform = `${z.getAttribute('transform')} translateY(-8px)`; });
      z.addEventListener('mouseleave', () => { z.style.transform = z.getAttribute('transform'); });
    });
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

    // Stagger campus zones
    if (!E.reduced) {
      gsap.from('.campus-zone', {
        opacity: 0, y: 30, scale: 0.8, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.1,
        scrollTrigger: { trigger: '#campusSVG', start: 'top 75%' },
      });
    }
  }
})();
