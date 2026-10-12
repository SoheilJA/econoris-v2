/**
 * Econoris — page-research-desk.js
 * Injects outcome chips, services tabs (5 numbered items), benefits grid (9 tiles).
 */
(function () {
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectOutcomeChips();
    injectServicesTabs();
    injectBenefits();
    runAnimations();
  });

  /* ---------- Outcome chips (5 items) ---------- */
  function injectOutcomeChips() {
    const host = document.getElementById('outcomeChips');
    if (!host) return;
    const items = [
      'تصمیمات مبتنی بر داده بگیرند',
      'ریسک‌های تحقیقاتی را کاهش دهند',
      'هزینه‌های تحقیق و توسعه را بهینه سازند',
      'سرعت ورود به بازار را افزایش دهند',
      'کیفیت و اثربخشی محصولات خود را بهبود بخشند',
    ];
    host.innerHTML = items.map((it, i) => `
      <div class="reveal flex items-center gap-3 glass rounded-2xl p-4" style="transition-delay: ${i * 60}ms;">
        <span class="w-7 h-7 rounded-lg grid place-items-center shrink-0" style="background: var(--grad-aurora);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="m5 12 5 5L20 7"/></svg>
        </span>
        <span class="text-sm">${it}</span>
      </div>
    `).join('');
  }

  /* ---------- Services tabs (5 numbered items) ---------- */
  function injectServicesTabs() {
    const tabsHost = document.querySelector('#servicesTabs [role=tablist]');
    const panelsHost = document.getElementById('servicesPanels');
    if (!tabsHost || !panelsHost) return;
    const items = [
      { n: 1, t: 'دسترسی به منابع اطلاعاتی علمی و تخصصی', body: 'میز پژوهشی اکونوریس، دسترسی به مجموعه‌ای گسترده از پایگاه‌های داده علمی، ژورنال‌های معتبر و منابع تخصصی را برای تیم‌های استارتاپی فراهم می‌کند. این دسترسی شامل پایگاه‌هایی نظیر PubMed، Scopus و Web of Science است که پژوهشگران را قادر می‌سازد به‌روزترین یافته‌های علمی را به‌سادگی بازیابی کنند.' },
      { n: 2, t: 'ابزارهای جستجو و تحلیل اطلاعات', body: 'بستر اکونوریس، ابزارهای پیشرفته برای جستجوی ساختاریافته و تحلیل داده‌های علمی در اختیار تیم‌ها قرار می‌دهد. این ابزارها امکان شناسایی روندها، استخراج داده‌های کلیدی و تحلیل رقبا را فراهم می‌کنند و تصمیم‌گیری مبتنی بر داده را تسهیل می‌نمایند.' },
      { n: 3, t: 'مشاوره و راهنمایی تخصصی', body: 'تیم متخصصان اکونوریس، مشاوره تخصصی در زمینه‌های مختلف پژوهشی ارائه می‌دهد. از انتخاب روش تحقیق تا تفسیر نتایج، پژوهشگران می‌توانند از دانش و تجربه متخصصان بهره‌مند شوند.' },
      { n: 4, t: 'شبکه ارتباطات و همکاری', body: 'میز پژوهشی اکونوریس، بستری برای ارتباط با شبکه‌ای از پژوهشگران، اساتید دانشگاه و متخصصان صنعت فراهم می‌کند. این شبکه ارتباطی، فرصت‌های همکاری علمی و صنعتی را گشوده و تسهیل می‌کند.' },
      { n: 5, t: 'خدمات ویژه برای استارتاپ‌های دارویی', body: 'با درک نیازهای خاص استارتاپ‌های دارویی، میز پژوهشی اکونوریس خدمات تخصصی متناسب با این بخش ارائه می‌دهد؛ از پشتیبانی در فرآیند توسعه دارو تا دسترسی به اطلاعات رگولاتوری و گایدلاین‌های بین‌المللی.' },
    ];
    tabsHost.innerHTML = items.map((it, i) => `
      <button class="px-4 py-2 rounded-full text-sm font-bold border border-white/15 hover:border-[var(--c-violet)] transition ${i === 0 ? 'active bg-[var(--c-violet)] text-white border-transparent' : ''}" data-tab="${it.n}">
        <span class="opacity-70 me-1">${fa(it.n)}.</span> ${it.t}
      </button>
    `).join('');
    panelsHost.innerHTML = items.map((it, i) => `
      <div data-panel="${it.n}" class="${i === 0 ? 'active' : 'hidden'}">
        <div class="glass rounded-3xl p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div class="w-20 h-20 rounded-2xl grid place-items-center shrink-0 float-slow" style="background: var(--grad-aurora);">
            <span class="text-3xl font-extrabold">${fa(it.n)}</span>
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-extrabold mb-4 text-[var(--c-violet)]">${it.t}</h3>
            <p class="text-white/80 leading-loose">${it.body}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Tab switching
    const tabs = tabsHost.querySelectorAll('[data-tab]');
    const panels = panelsHost.querySelectorAll('[data-panel]');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active', 'bg-[var(--c-violet)]', 'text-white', 'border-transparent'));
        tabs.forEach(x => x.classList.add('border-white/15'));
        t.classList.add('active', 'bg-[var(--c-violet)]', 'text-white', 'border-transparent');
        t.classList.remove('border-white/15');
        const target = t.dataset.tab;
        panels.forEach(p => p.classList.toggle('hidden', p.dataset.panel !== target));
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
        if (window.gsap && !window.ECONORIS.reduced) {
          const panel = panelsHost.querySelector(`[data-panel="${target}"]`);
          if (panel) window.gsap.fromTo(panel, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
        }
      });
    });
  }

  /* ---------- Benefits grid (9 tiles) ---------- */
  function injectBenefits() {
    const host = document.getElementById('benefitsGrid');
    if (!host) return;
    const benefits = [
      { t: 'کاهش زمان و هزینه تحقیق و توسعه', d: 'با دسترسی متمرکز به منابع و ابزارهای تحلیلی، تیم‌ها از اتلاف وقت و منابع جلوگیری می‌کنند.' },
      { t: 'بهبود کیفیت تصمیم‌گیری', d: 'تصمیمات مبتنی بر داده‌های معتبر و تحلیل‌های علمی، شانس موفقیت پروژه را افزایش می‌دهد.' },
      { t: 'کاهش ریسک‌های تحقیقاتی', d: 'شناسایی زودهنگام چالش‌ها با دسترسی به اطلاعات جامع، ریسک‌های فنی و علمی را کاهش می‌دهد.' },
      { t: 'تسریع فرآیند ورود به بازار', d: 'با مسیر پژوهشی بهینه، زمان رسیدن محصول به بازار کوتاه‌تر می‌شود.' },
      { t: 'افزایش شانس موفقیت', d: 'تلفیق مشاوره تخصصی و داده‌های معتبر، احتمال موفقیت محصول نهایی را بالا می‌برد.' },
      { t: 'دسترسی به دانش تخصصی', d: 'شبکه‌ای از متخصصان و منابع علمی در دسترس تیم استارتاپی قرار می‌گیرد.' },
      { t: 'افزایش اعتبار', d: 'ارتباط با پایگاه‌های معتبر بین‌المللی، اعتبار علمی تیم و پروژه را افزایش می‌دهد.' },
      { t: 'ایجاد شبکه ارتباطی', d: 'فرصت همکاری با پژوهشگران، اساتید و فعالان صنعت دارو فراهم می‌شود.' },
      { t: 'رقابت‌پذیری بیشتر', d: 'تسلط بر دانش روزآمد، مزیت رقابتی در بازار دارو ایجاد می‌کند.' },
    ];
    host.innerHTML = benefits.map((b, i) => `
      <div class="reveal glass rounded-2xl p-6 tilt-card spotlight group" style="transition-delay: ${i * 60}ms;">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-9 h-9 rounded-lg grid place-items-center shrink-0" style="background: var(--grad-aurora); color: white; font-weight: 800; font-size: 0.9rem;">${fa(i+1)}</span>
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
