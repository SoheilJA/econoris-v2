/**
 * Econoris — page-laboratory.js
 * Injects feature chips (5), equipment tabs (5 categories), 3 access models,
 * 7 key early tests timeline, 6 strategic benefits.
 */
(function () {
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectFeatureChips();
    injectEquipment();
    injectAccessModels();
    injectTests();
    injectBenefits();
    runAnimations();
  });

  function injectFeatureChips() {
    const host = document.getElementById('featureChips');
    if (!host) return;
    const items = [
      'دسترسی به مجموعه‌ای جامع از تجهیزات آزمایشگاهی تخصصی',
      'انعطاف‌پذیری در مدل‌های دسترسی و استفاده',
      'پشتیبانی فنی و نگهداری تجهیزات',
      'امکان انجام طیف متنوعی از آزمایش‌های کلیدی اولیه',
      'ایجاد فضای تعامل و همکاری',
    ];
    host.innerHTML = items.map((it, i) => `
      <div class="reveal glass rounded-2xl p-5 flex items-start gap-3 tilt-card spotlight" style="transition-delay:${i * 60}ms;">
        <span class="w-9 h-9 rounded-lg grid place-items-center shrink-0" style="background:var(--grad-aurora);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m5 12 5 5L20 7"/></svg>
        </span>
        <span class="text-sm">${it}</span>
      </div>
    `).join('');
  }

  function injectEquipment() {
    const tabsHost = document.querySelector('#equipmentTabs [role=tablist]');
    const panelsHost = document.getElementById('equipmentPanels');
    if (!tabsHost || !panelsHost) return;
    const cats = [
      {
        n: 1, t: 'تجهیزات آنالیزی', latin: 'Analytical',
        items: ['HPLC', 'GC-MS', 'UV-Vis', 'IR'],
        body: 'تجهیزات آنالیزی پیشرفته، امکان شناسایی و کمی‌سازی دقیق ترکیبات شیمیایی را در مراحل مختلف توسعه دارو فراهم می‌کنند. HPLC برای جداسازی و اندازه‌گیری، GC-MS برای شناسایی ترکیبات فرار، UV-Vis برای تعیین غلظت و IR برای شناسایی گروه‌های عاملی به کار می‌رود.',
      },
      {
        n: 2, t: 'تجهیزات فرمولاسیون و آماده‌سازی نمونه', latin: 'Formulation',
        items: ['Mixers', 'سانتریفیوژ', 'Ovens', 'Incubators', 'ترازو', 'آسیاب', 'هموژنایزر'],
        body: 'تجهیزات فرمولاسیون، امکان آماده‌سازی نمونه‌های اولیه و توسعه فرمول‌های دارویی را در مقیاس آزمایشگاهی فراهم می‌کنند. این تجهیزات، پایه‌ای برای تولید نمونه‌های قابل تست و بهینه‌سازی فرمولاسیون هستند.',
      },
      {
        n: 3, t: 'تجهیزات کنترل کیفیت فیزیکوشیمیایی', latin: 'Physicochemical QC',
        items: ['Dissolution', 'Hardness', 'Disintegration'],
        body: 'این تجهیزات، ارزیابی ویژگی‌های فیزیکی و شیمیایی فرآورده نهایی را امکان‌پذیر می‌سازند. آزمون‌های انحلال، سختی و فروپاشی، اطلاعات حیاتی برای تضمین کیفیت و کارایی دارو ارائه می‌دهند.',
      },
      {
        n: 4, t: 'امکانات کشت سلولی و بیولوژی مولکولی پایه', latin: 'Cell Culture',
        items: ['Laminar Flow Hoods', 'انکوباتور CO2', 'میکروسکوپ معکوس'],
        body: 'این امکانات، بستر مناسبی برای مطالعات In Vitro و آزمون‌های زیستی فراهم می‌کنند. کشت سلولی، ارزیابی سمیت سلولی و مطالعات مکانیسم اثر، از جمله کاربردهای این بخش هستند.',
      },
      {
        n: 5, t: 'تجهیزات عمومی', latin: 'General',
        items: ['اتوکلاو', 'دوش و چشم‌شوی اضطراری', 'سیستم تصفیه آب', 'فریزر و یخچال'],
        body: 'تجهیزات عمومی، ایمنی و پشتیبانی لازم برای فعالیت‌های آزمایشگاهی روزمره را فراهم می‌کنند. این زیرساخت، فعالیت منظم و مطمئن آزمایشگاه را تضمین می‌کند.',
      },
    ];
    tabsHost.innerHTML = cats.map((c, i) => `
      <button class="px-4 py-2 rounded-full text-sm font-bold border border-white/15 hover:border-[var(--c-teal)] transition ${i === 0 ? 'active text-white border-transparent' : ''}" data-tab="${c.n}" style="${i === 0 ? 'background:var(--grad-aurora);' : ''}">
        <span class="opacity-70 me-1">${fa(c.n)}.</span> ${c.t}
      </button>
    `).join('');
    panelsHost.innerHTML = cats.map((c, i) => `
      <div data-panel="${c.n}" class="${i === 0 ? 'active' : 'hidden'}">
        <div class="glass rounded-3xl p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div class="w-20 h-20 rounded-2xl grid place-items-center shrink-0 float-slow" style="background:var(--grad-aurora);">
            <span class="text-3xl font-extrabold">${fa(c.n)}</span>
          </div>
          <div>
            <div class="text-xs opacity-50 latn tracking-widest mb-1">${c.latin}</div>
            <h3 class="text-xl md:text-2xl font-extrabold mb-3 text-[var(--c-teal)]">${c.t}</h3>
            <p class="text-white/80 leading-loose mb-4">${c.body}</p>
            <div class="flex flex-wrap gap-2">
              ${c.items.map(it => `<span class="chip text-xs">${it}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Tab switching
    const tabs = tabsHost.querySelectorAll('[data-tab]');
    const panels = panelsHost.querySelectorAll('[data-panel]');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => { x.classList.remove('active', 'text-white', 'border-transparent'); x.style.background = ''; x.classList.add('border-white/15'); });
        t.classList.add('active', 'text-white', 'border-transparent');
        t.classList.remove('border-white/15');
        t.style.background = 'var(--grad-aurora)';
        const target = t.dataset.tab;
        panels.forEach(p => { p.classList.toggle('hidden', p.dataset.panel !== target); p.classList.toggle('active', p.dataset.panel === target); });
        if (window.gsap && !window.ECONORIS.reduced) {
          const panel = panelsHost.querySelector(`[data-panel="${target}"]`);
          if (panel) window.gsap.fromTo(panel, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
        }
      });
    });
  }

  function injectAccessModels() {
    const host = document.getElementById('accessModels');
    if (!host) return;
    const models = [
      { t: 'Shared Access', d: 'دسترسی اشتراکی به تجهیزات با رزرو زمانی آنلاین.', latin: 'اشتراکی' },
      { t: 'Bench Space', d: 'اجاره فضای میز آزمایشگاهی برای تیم‌های استارتاپی.', latin: 'فضای اختصاصی' },
      { t: 'Fee-for-Service', d: 'انجام آزمون‌ها توسط کارشناسان اکونوریس به‌صورت قراردادی.', latin: 'خدماتی' },
    ];
    host.innerHTML = models.map((m, i) => `
      <div class="reveal glass rounded-3xl p-8 tilt-card spotlight" style="transition-delay:${i * 80}ms;">
        <div class="w-14 h-14 rounded-2xl grid place-items-center mb-4 float-slow" style="background:var(--grad-aurora);">
          <span class="text-xl font-extrabold">${fa(i+1)}</span>
        </div>
        <div class="text-xs opacity-50 latn mb-1 tracking-widest">${m.latin}</div>
        <h3 class="text-lg font-extrabold mb-3 text-[var(--c-teal)]">${m.t}</h3>
        <p class="text-sm opacity-75 leading-relaxed">${m.d}</p>
      </div>
    `).join('');
  }

  function injectTests() {
    const host = document.getElementById('testsTimeline');
    if (!host) return;
    const tests = [
      'سنتز مقادیر کم',
      'خالص‌سازی و شناسایی',
      'مطالعات پایداری اولیه',
      'توسعه روش‌های آنالیزی پایه',
      'QC Testing',
      'مطالعات فرمولاسیون اولیه',
      'تست‌های In Vitro',
    ];
    host.innerHTML = tests.map((t, i) => `
      <div class="reveal flex items-center gap-4 mb-4" style="transition-delay:${i * 60}ms;">
        <div class="relative shrink-0">
          <div class="w-12 h-12 rounded-full grid place-items-center font-extrabold" style="background:var(--grad-aurora);box-shadow:var(--shadow-glow-teal);">${fa(i+1)}</div>
          ${i < tests.length - 1 ? '<div class="absolute right-1/2 top-full w-0.5 h-8 bg-[var(--c-teal)]/30"></div>' : ''}
        </div>
        <div class="glass rounded-2xl p-4 flex-1">
          <h4 class="font-bold">${t}</h4>
        </div>
      </div>
    `).join('');
  }

  function injectBenefits() {
    const host = document.getElementById('benefitsGrid');
    if (!host) return;
    const items = [
      { t: 'کاهش چشمگیر هزینه‌های سرمایه‌ای و عملیاتی', d: 'با دسترسی اشتراکی به تجهیزات گران‌قیمت، نیاز به سرمایه‌گذاری اولیه کاهش می‌یابد.' },
      { t: 'صرفه‌جویی در زمان و افزایش سرعت پیشرفت', d: 'دسترسی آماده به تجهیزات، انتظار برای خرید و نصب را حذف می‌کند.' },
      { t: 'دسترسی به تجهیزات گران‌قیمت و پیشرفته', d: 'HPLC، GC-MS و تجهیزات پیشرفته بدون نیاز به مالکیت در دسترس تیم‌ها قرار می‌گیرد.' },
      { t: 'کاهش بار مدیریتی و عملیاتی تیم استارتاپی', d: 'نگهداری و کالیبراسیون تجهیزات بر عهده اکونوریس است.' },
      { t: 'هم‌افزایی با سایر خدمات شتابدهنده', d: 'تجهیزات آزمایشگاهی در کنار مشاوره و منابع اطلاعاتی، یک پلتفرم یکپارچه می‌سازند.' },
      { t: 'انعطاف‌پذیری در مقیاس فعالیت', d: 'با رشد پروژه، دسترسی به تجهیزات و فضای بیشتری به‌سادگی امکان‌پذیر است.' },
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

    // Draw HPLC path on scroll
    if (!E.reduced) {
      const path = document.querySelector('#hplcPath');
      if (path && path.getTotalLength) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: 'expo.out',
          scrollTrigger: { trigger: path.closest('section'), start: 'top 70%' },
        });
      }
    }
  }
})();
