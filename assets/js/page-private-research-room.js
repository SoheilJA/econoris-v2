/**
 * Econoris — page-private-research-room.js
 * Injects 5 services (pinned scroll chapter list) and 7 strategic benefits.
 */
(function () {
  const fa = window.toFa;

  document.addEventListener('DOMContentLoaded', () => {
    injectServices();
    injectBenefits();
    runAnimations();
  });

  function injectServices() {
    const host = document.getElementById('servicesList');
    if (!host) return;
    const items = [
      { n: 1, t: 'دسترسی ممتاز به منابع اطلاعاتی تخصصی و تحلیل داده', latin: 'SciFinder, Reaxys, ClinicalTrials.gov', body: 'اتاق اختصاصی پژوهشی اکونوریس، دسترسی ممتاز به پایگاه‌های داده تخصصی دارویی و شیمیایی نظیر SciFinder، Reaxys و ClinicalTrials.gov را فراهم می‌کند. این دسترسی به‌همراه ابزارهای تحلیل داده، تیم پژوهشی را قادر می‌سازد تا اطلاعات دقیق و به‌روز را برای تصمیمات راهبردی استخراج نماید.' },
      { n: 2, t: 'مشاوره و هدایت علمی و فنی فوق تخصصی', latin: 'In Vitro / In Vivo, LC-MS', body: 'تیم متخصصان اکونوریس، هدایت علمی و فنی در حوزه‌های In Vitro و In Vivo، و همچنین روش‌های تحلیلی پیشرفته نظیر LC-MS را ارائه می‌دهد. این مشاوره به تیم کمک می‌کند تا طراحی آزمایش‌ها و تفسیر نتایج را بهینه‌سازی کنند.' },
      { n: 3, t: 'حمایت در طراحی مطالعات پیش‌بالینی و رگولاتوری اولیه', latin: 'IND, GLP', body: 'در مرحله پیش‌بالینی و رگولاتوری اولیه، تیم اکونوریس در طراحی مطالعات مطابق با استانداردهای IND و GLP پشتیبانی می‌کند. این امر، مسیر اخذ مجوزهای بعدی را هموار می‌سازد.' },
      { n: 4, t: 'دسترسی به زیرساخت‌های تحقیقاتی و خدمات قراردادی CROs', latin: 'CROs', body: 'اتاق اختصاصی پژوهشی، دسترسی به زیرساخت‌های تحقیقاتی و خدمات قراردادی سازمان‌های تحقیقات قراردادی (CROs) را تسهیل می‌کند. این امر، نیاز به سرمایه‌گذاری در تجهیزات گران‌قیمت را کاهش می‌دهد.' },
      { n: 5, t: 'مدیریت داده‌های تحقیقاتی و نگارش علمی', latin: 'ELN', body: 'با استفاده از سیستم‌های دفترچه آزمایشگاهی الکترونیکی (ELN)، داده‌های تحقیقاتی به‌صورت ساختاریافته مدیریت و مستند می‌شوند. این رویکرد، نگارش علمی و انتشار نتایج را تسهیل می‌نماید.' },
    ];
    const colors = ['#FF4FA3', '#FF6B6B', '#FFB938', '#7C4DFF', '#2F6BFF'];
    host.innerHTML = items.map((it, i) => `
      <div class="reveal glass rounded-3xl p-6 md:p-8 tilt-card spotlight" style="transition-delay:${i * 80}ms;border-inline-start:3px solid ${colors[i % colors.length]};">
        <div class="grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div class="w-16 h-16 rounded-2xl grid place-items-center shrink-0" style="background:linear-gradient(135deg,${colors[i % colors.length]},${colors[(i+1) % colors.length]});box-shadow:0 0 30px ${colors[i % colors.length]}55;">
            <span class="text-2xl font-extrabold">${fa(it.n)}</span>
          </div>
          <div>
            <h3 class="text-lg md:text-xl font-extrabold mb-2" style="color:${colors[i % colors.length]};">${it.t}</h3>
            <div class="text-[10px] opacity-50 latn mb-3 tracking-widest">${it.latin}</div>
            <p class="text-sm md:text-base opacity-80 leading-loose">${it.body}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  function injectBenefits() {
    const host = document.getElementById('benefitsGrid');
    if (!host) return;
    const items = [
      { t: 'تمرکز و اختصاصی‌سازی منابع', d: 'تخصیص منابع اطلاعاتی، مشاوره و زیرساخت به‌صورت اختصاصی به یک تیم استارتاپی.' },
      { t: 'کاهش چشمگیر زمان و هزینه R&D', d: 'با دسترسی متمرکز و حمایت تخصصی، زمان و هزینه تحقیق و توسعه به‌شکل معناداری کاهش می‌یابد.' },
      { t: 'افزایش کیفیت و اعتبار داده‌ها', d: 'استفاده از روش‌های استاندارد و سیستم‌های مدیریت داده، کیفیت نتایج را افزایش می‌دهد.' },
      { t: 'کاهش ریسک‌های علمی و فنی', d: 'مشاوره تخصصی و طراحی دقیق مطالعات، ریسک‌های علمی و فنی را به حداقل می‌رساند.' },
      { t: 'تسریع فرآیند اعتبارسنجی ایده', d: 'مسیر ساختاریافته، ایده را سریع‌تر از مرحله مفهومی به اعتبارسنجی می‌رساند.' },
      { t: 'توانمندسازی تیم استارتاپی', d: 'تیم با تجربه عملی و دسترسی به زیرساخت، توانمندی فنی و مدیریتی کسب می‌کند.' },
      { t: 'یک مزیت رقابتی قابل توجه', d: 'دسترسی اختصاصی به این سطح از خدمات، مزیت رقابتی منحصربه‌فردی ایجاد می‌کند.' },
    ];
    host.innerHTML = items.map((b, i) => `
      <div class="reveal glass rounded-2xl p-6 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded-lg grid place-items-center shrink-0" style="background:var(--c-coral);color:white;font-weight:800;font-size:0.85rem;">${fa(i+1)}</span>
          <h4 class="font-bold text-sm md:text-base">${b.t}</h4>
        </div>
        <p class="text-xs md:text-sm opacity-75 leading-relaxed">${b.d}</p>
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
