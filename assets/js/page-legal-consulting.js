/**
 * Econoris — page-legal-consulting.js
 * Injects 7 benefits + 8 service cards (with stamp animation on scroll).
 * Animates scales of justice bar + shield draw.
 */
(function () {
  const fa = window.toFa;

  document.addEventListener('DOMContentLoaded', () => {
    injectBenefits();
    injectServices();
    runAnimations();
  });

  function injectBenefits() {
    const host = document.getElementById('benefitsGrid');
    if (!host) return;
    const items = [
      { t: 'حفاظت مؤثر از مالکیت فکری', d: 'راهبردی برای ثبت پتنت و حفاظت از اسرار تجاری.' },
      { t: 'تدوین قراردادهای مستحکم و عادلانه', d: 'قراردادهایی که منافع همه طرفین را متعادل حفظ می‌کنند.' },
      { t: 'پیشگیری از دعاوی حقوقی و اختلافات', d: 'شناسایی زودهنگام نقاط ابهام در قراردادها.' },
      { t: 'اطمینان از رعایت الزامات قانونی و رگولاتوری', d: 'همگامی با قوانین سازمان غذا و دارو.' },
      { t: 'افزایش اعتبار و اعتماد سرمایه‌گذاران', d: 'استارتاپ با پایه حقوقی مستحکم، جذاب‌تر برای سرمایه‌گذار است.' },
      { t: 'مدیریت ریسک‌های حقوقی پروژه', d: 'شناسایی و کاهش ریسک‌ها پیش از تبدیل شدن به مشکل.' },
      { t: 'تمرکز تیم بر فعالیت‌های اصلی R&D', d: 'با سپردن امور حقوقی به متخصصان، تیم روی پژوهش متمرکز می‌ماند.' },
    ];
    host.innerHTML = items.map((b, i) => `
      <div class="reveal glass rounded-2xl p-6 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-9 h-9 rounded-lg grid place-items-center shrink-0" style="background:linear-gradient(135deg,var(--c-amber),var(--c-coral));color:white;font-weight:800;font-size:0.9rem;">${fa(i+1)}</span>
          <h4 class="font-bold text-sm md:text-base">${b.t}</h4>
        </div>
        <p class="text-xs md:text-sm opacity-75 leading-relaxed">${b.d}</p>
      </div>
    `).join('');
  }

  function injectServices() {
    const host = document.getElementById('servicesGrid');
    if (!host) return;
    const items = [
      { t: 'مشاوره در زمینه استراتژی مالکیت فکری (پتنت، اسرار تجاری)', latin: 'IP Strategy' },
      { t: 'راهنمایی در فرآیند ثبت اختراع', latin: 'Patent Filing' },
      { t: 'مشاوره در خصوص قراردادهای محرمانگی (NDA) و عدم افشا', latin: 'NDA' },
      { t: 'راهنمایی در تدوین قراردادهای اولیه همکاری', latin: 'Collaboration' },
      { t: 'مشاوره در زمینه ساختار حقوقی شرکت و ثبت آن', latin: 'Corporate' },
      { t: 'آشنایی با الزامات حقوقی رگولاتوری دارویی', latin: 'Regulatory' },
      { t: 'مشاوره اولیه در خصوص قراردادهای سرمایه‌گذاری و سهام', latin: 'Investment' },
      { t: 'راهنمایی در خصوص مسائل حقوق کار مرتبط با استارتاپ', latin: 'Labor Law' },
    ];
    host.innerHTML = items.map((it, i) => `
      <article class="reveal relative glass rounded-3xl p-6 tilt-card spotlight overflow-hidden" style="transition-delay:${i * 60}ms;">
        <!-- Stamp that animates in -->
        <div class="absolute -top-2 -left-2 w-20 h-20 rounded-full grid place-items-center text-[10px] font-extrabold opacity-0 scale-0" data-stamp style="background:radial-gradient(circle, rgba(255,185,56,0.25), transparent 70%);border:2px solid var(--c-amber);color:var(--c-amber);transform:rotate(-15deg);">
          تأیید شده
        </div>
        <div class="flex items-baseline gap-2 mb-3">
          <span class="text-2xl font-extrabold text-[var(--c-amber)]">${fa(i+1)}</span>
          <span class="text-[10px] opacity-50 latn tracking-widest">${it.latin}</span>
        </div>
        <h4 class="font-bold text-sm md:text-base leading-snug mb-4">${it.t}</h4>
        <!-- Contract lines decoration -->
        <div class="space-y-1.5 opacity-30">
          <div class="h-1 w-full bg-white/20 rounded-full"></div>
          <div class="h-1 w-4/5 bg-white/20 rounded-full"></div>
          <div class="h-1 w-3/5 bg-white/20 rounded-full"></div>
        </div>
      </article>
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

    // Animate scales bar tilt
    if (!E.reduced) {
      const bar = document.getElementById('scalesBar');
      if (bar) {
        gsap.to(bar, {
          rotation: 6, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, transformOrigin: '150px 60px',
        });
      }

      // Animate stamps on each card when in view
      document.querySelectorAll('[data-stamp]').forEach(stamp => {
        gsap.to(stamp, {
          opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: { trigger: stamp.closest('article'), start: 'top 75%' },
        });
      });
    }
  }
})();
