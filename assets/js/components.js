/**
 * Econoris — components.js
 * Injects header, mega menu, mobile drawer, search overlay, footer,
 * preloader, scroll-progress bar, mobile action bar, cursor ring, back-to-top
 * into every page. Pure template literals — works under file:// too.
 */
(function () {
  const C = window.ECONORIS_CONFIG;
  const T = window.ECONORIS_CONTENT.fa;
  const NAV = window.ECONORIS_NAV;

  const fa = window.toFa;

  /* ---------- helpers ---------- */
  const ACCENT_HEX = {
    violet: '#7C4DFF',
    coral: '#FF6B6B',
    teal: '#00D4C2',
    blue: '#2F6BFF',
    magenta: '#FF4FA3',
    lime: '#B6F23A',
    amber: '#FFB938',
  };

  function svg(name, size = 24) {
    const s = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;
    const lib = {
      search: `<svg ${s}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
      phone: `<svg ${s}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" transform="translate(-3 0)"/></svg>`,
      menu: `<svg ${s}><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
      close: `<svg ${s}><path d="M6 6l12 12M18 6 6 18"/></svg>`,
      chevron: `<svg ${s}><path d="m9 18 6-6-6-6"/></svg>`,
      arrow: `<svg ${s}><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
      'arrow-up': `<svg ${s}><path d="M12 19V5M6 11l6-6 6 6"/></svg>`,
      rocket: `<svg ${s} fill="currentColor" stroke="none"><path d="M12 2c3 1 6 4 7 9-1 0-2 0-3 .5L12 7l-4 4.5C7 11 6 11 5 11c1-5 4-8 7-9Z M4 14l4-2 4 4-2 4c-2-1-4-3-6-6Z M9 17l2-1 1 2-3-1Z"/></svg>`,
      location: `<svg ${s}><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></svg>`,
      mail: `<svg ${s}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
      insta: `<svg ${s}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>`,
      linkedin: `<svg ${s} fill="currentColor" stroke="none"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5 2.5 2.5 0 0 1 4.98 3.5ZM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-4z"/></svg>`,
      telegram: `<svg ${s} fill="currentColor" stroke="none"><path d="M21.5 4.5 3 11.3l5.5 1.8 2 6 2.8-2.6 4.7 3.5L21.5 4.5Zm-3 3-7 6.3-.3 3.4-1.4-4Z"/></svg>`,
      twitter: `<svg ${s}><path d="M22 4.5a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.6 1A4 4 0 0 0 12 8.3a11 11 0 0 1-8-4 4 4 0 0 0 1.3 5.4 4 4 0 0 1-1.8-.5 4 4 0 0 0 3.3 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 3 18.5 11 11 0 0 0 9 20c7 0 11-6 11-11v-.5A8 8 0 0 0 22 4.5Z"/></svg>`,
      flask: `<svg ${s}><path d="M9 3h6M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3"/></svg>`,
      microscope: `<svg ${s}><path d="M6 18h12M9 18a6 6 0 0 0 6-6M4 22h16M11 4h4v8h-4zM7 14l4-2"/></svg>`,
      gavel: `<svg ${s}><path d="M14 4 4 14l3 3 10-10zM12 8l4 4M4 14l4 4M3 22h8"/></svg>`,
      book: `<svg ${s}><path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z"/></svg>`,
      globe: `<svg ${s}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>`,
      bulb: `<svg ${s}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10Z"/></svg>`,
      check: `<svg ${s}><path d="m5 12 5 5L20 7"/></svg>`,
      star: `<svg ${s} fill="currentColor" stroke="none"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>`,
      network: `<svg ${s}><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v3M12 10l-5 7M12 10l5 7"/></svg>`,
      money: `<svg ${s}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v6M18 9v6"/></svg>`,
      factory: `<svg ${s}><path d="M3 21V10l5 3V10l5 3V10l5 3V5h3v16z"/></svg>`,
      shield: `<svg ${s}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
      beaker: `<svg ${s}><path d="M9 3h6v6l4 9a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-9V3Z"/></svg>`,
      test: `<svg ${s}><path d="M9 3v8l-4 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-4-8V3M9 3h6M9 8h6"/></svg>`,
      market: `<svg ${s}><path d="M3 9h18l-1 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 9zM8 9V5a4 4 0 0 1 8 0v4"/></svg>`,
    };
    return lib[name] || '';
  }
  window.ECONORIS_SVG = svg;

  /* ---------- detect current page for active link ---------- */
  function here(href) {
    const p = location.pathname.split('/').pop() || 'index.html';
    const sub = location.pathname.split('/').slice(-2).join('/');
    return p === href || sub === href || (href === 'index.html' && (p === '' || p === 'index.html'));
  }

  /* ---------- HEADER ---------- */
  function headerHTML() {
    return `
    <header class="site-header" id="siteHeader">
      <div class="container-x flex items-center justify-between h-[var(--header-h)]">
        <a href="index.html" class="flex items-center gap-3 group" aria-label="اکونوریس — خانه">
          <span class="relative grid place-items-center w-10 h-10 rounded-xl"
                style="background: var(--grad-aurora); box-shadow: var(--shadow-glow-violet);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M12 7v10M9 10l3-1.5L15 10" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="flex flex-col leading-tight">
            <span class="text-lg font-extrabold tracking-tight">${C.brand}</span>
            <span class="text-[10px] opacity-70 -mt-0.5">${C.subtitle}</span>
          </span>
        </a>

        <nav class="hidden lg:flex items-center gap-1" aria-label="منوی اصلی">
          <div class="relative" data-mega-trigger>
            <button class="px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition flex items-center gap-1.5"
                    aria-haspopup="true" aria-expanded="false" data-mega-btn>
              ${T.nav.services}
              <span class="opacity-60">${svg('chevron', 16)}</span>
            </button>
          </div>
          <a href="about.html" class="px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition ${here('about.html') ? 'text-[var(--c-teal)]' : ''}">${T.nav.about}</a>
          <a href="blog.html" class="px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition ${here('blog.html') ? 'text-[var(--c-teal)]' : ''}">${T.nav.blog}</a>
          <a href="contact.html" class="px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition ${here('contact.html') ? 'text-[var(--c-teal)]' : ''}">${T.nav.contact}</a>
        </nav>

        <div class="flex items-center gap-2">
          <button class="hidden md:grid w-10 h-10 place-items-center rounded-full hover:bg-white/10 transition" data-search-open aria-label="${T.common.search}">
            ${svg('search', 20)}
          </button>
          <a href="#" class="hidden md:inline-flex px-4 py-2 rounded-full text-sm font-semibold border border-white/15 hover:border-white/30 transition">${T.common.login}</a>
          <a href="contact.html" class="btn btn-primary magnetic hidden sm:inline-flex text-sm" data-magnetic>
            ${T.common.freeConsultation}
          </a>
          <button class="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-white/10" data-drawer-open aria-label="منو">
            ${svg('menu', 24)}
          </button>
        </div>
      </div>

      <!-- MEGA MENU -->
      <div class="mega" id="megaMenu" data-mega>
        <div class="mega__panel bg-aurora bg-grain border-t border-white/10">
          <div class="container-x py-8">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

              ${NAV.categories.map((cat, ci) => `
                <div class="space-y-3">
                  <a href="${cat.href}" class="group flex items-center gap-2 mb-2">
                    <span class="w-8 h-8 rounded-lg grid place-items-center" style="background: ${ACCENT_HEX[cat.accent]}22; color: ${ACCENT_HEX[cat.accent]};">
                      <span style="display:inline-block; transform: translateY(-1px);">${svg(['network','bulb','microscope'][ci], 16)}</span>
                    </span>
                    <span class="font-bold" style="color: ${ACCENT_HEX[cat.accent]};">${cat.title}</span>
                  </a>
                  <ul class="space-y-1">
                    ${cat.items.map(it => `
                      <li>
                        <a href="${it.href}" class="mega-item block px-3 py-2.5 rounded-2xl">
                          <span class="mega-item__hl" style="background: linear-gradient(90deg, ${ACCENT_HEX[cat.accent]}22, transparent);"></span>
                          <div class="flex items-start gap-3 relative">
                            <span class="mega-item__icon mt-0.5 w-5 h-5 grid place-items-center opacity-70" style="color: ${ACCENT_HEX[cat.accent]};">
                              <span style="width:8px;height:8px;border-radius:9999px;background:currentColor;display:inline-block;"></span>
                            </span>
                            <div>
                              <div class="text-sm font-bold">${it.title}</div>
                              <div class="text-xs opacity-65 mt-0.5 leading-relaxed">${it.desc}</div>
                            </div>
                          </div>
                        </a>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}

              <!-- Featured card -->
              <div class="relative rounded-2xl overflow-hidden p-6 glass"
                   style="background: linear-gradient(135deg, rgba(124,77,255,0.25), rgba(0,212,194,0.18));">
                <div class="absolute inset-0 bg-dot-grid opacity-50"></div>
                <div class="relative">
                  <div class="w-16 h-16 rounded-2xl grid place-items-center mb-4 float" style="background: var(--grad-aurora);">
                    ${svg('bulb', 28)}
                  </div>
                  <h4 class="font-extrabold text-lg mb-2">مشاوره رایگان از متخصصین ما</h4>
                  <p class="text-sm opacity-80 mb-4 leading-relaxed">تیم اکونوریس با اساتید دانشگاه علوم پزشکی مشهد، مسیر ایده تا بازار را با شما هموار می‌کند.</p>
                  <a href="contact.html" class="btn btn-primary text-xs magnetic" data-magnetic>
                    ${T.common.freeConsultation}
                    ${svg('arrow', 16)}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
    `;
  }

  /* ---------- MOBILE DRAWER ---------- */
  function drawerHTML() {
    return `
    <div class="drawer" id="mobileDrawer" data-drawer aria-hidden="true">
      <div class="drawer__backdrop" data-drawer-close></div>
      <div class="drawer__panel bg-aurora bg-grain">
        <div class="container-x py-6">
          <div class="flex items-center justify-between mb-8">
            <a href="index.html" class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl grid place-items-center" style="background: var(--grad-aurora);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="text-lg font-extrabold">${C.brand}</span>
            </a>
            <button class="w-10 h-10 grid place-items-center rounded-full hover:bg-white/10" data-drawer-close aria-label="بستن">${svg('close', 24)}</button>
          </div>

          <nav class="space-y-1" aria-label="منوی موبایل">
            <!-- Services accordion -->
            <div data-accordion>
              <button class="drawer__link w-full flex items-center justify-between py-4 text-lg font-bold border-b border-white/10" data-accordion-trigger>
                <span>${T.nav.services}</span>
                <span class="opacity-60 transition-transform" data-accordion-icon>${svg('chevron', 20)}</span>
              </button>
              <div class="overflow-hidden" data-accordion-content style="max-height:0;">
                <div class="py-3 space-y-4">
                  ${NAV.categories.map((cat) => `
                    <div>
                      <a href="${cat.href}" class="flex items-center gap-2 py-2 text-sm font-bold" style="color: ${ACCENT_HEX[cat.accent]};">
                        <span class="w-2 h-2 rounded-full" style="background: ${ACCENT_HEX[cat.accent]};"></span>
                        ${cat.title}
                      </a>
                      <ul class="space-y-0.5 ps-4">
                        ${cat.items.map(it => `
                          <li><a href="${it.href}" class="block py-2 text-sm opacity-80 hover:opacity-100">${it.title}</a></li>
                        `).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <a href="about.html" class="drawer__link flex items-center justify-between py-4 text-lg font-bold border-b border-white/10">
              ${T.nav.about}<span class="opacity-60">${svg('arrow', 20)}</span>
            </a>
            <a href="blog.html" class="drawer__link flex items-center justify-between py-4 text-lg font-bold border-b border-white/10">
              ${T.nav.blog}<span class="opacity-60">${svg('arrow', 20)}</span>
            </a>
            <a href="contact.html" class="drawer__link flex items-center justify-between py-4 text-lg font-bold border-b border-white/10">
              ${T.nav.contact}<span class="opacity-60">${svg('arrow', 20)}</span>
            </a>
          </nav>

          <div class="mt-8 grid grid-cols-2 gap-3">
            <a href="tel:${C.phone}" class="btn btn-ghost text-sm">
              ${svg('phone', 16)} ${C.phoneDisplay}
            </a>
            <a href="contact.html" class="btn btn-primary text-sm">
              ${T.common.freeConsultation}
            </a>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  /* ---------- SEARCH OVERLAY ---------- */
  function searchHTML() {
    // Build local index from nav + magazine
    const idx = [];
    NAV.categories.forEach(c => {
      idx.push({ title: c.title, href: c.href, kind: 'دسته' });
      c.items.forEach(it => idx.push({ title: it.title, href: it.href, kind: 'خدمت' }));
    });
    T.magazine.forEach(m => idx.push({ title: m.title, href: 'blog.html', kind: 'مقاله' }));
    idx.push({ title: T.nav.about, href: 'about.html', kind: 'صفحه' });
    idx.push({ title: T.nav.contact, href: 'contact.html', kind: 'صفحه' });

    return `
    <div class="search-overlay" id="searchOverlay" data-search>
      <div class="container-x pt-32 pb-12">
        <div class="search-overlay__inner max-w-2xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">جستجو در اکونوریس</h3>
            <button class="w-10 h-10 grid place-items-center rounded-full hover:bg-white/10" data-search-close aria-label="بستن">${svg('close', 24)}</button>
          </div>
          <div class="relative">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">${svg('search', 22)}</span>
            <input type="text" placeholder="${T.common.searchPlaceholder}"
                   class="w-full bg-white/5 border border-white/15 rounded-2xl py-4 pe-12 ps-4 text-lg focus:border-[var(--c-teal)] focus:outline-none"
                   data-search-input>
          </div>
          <div class="mt-6 space-y-2" data-search-results></div>
          <p class="text-xs opacity-50 mt-6" data-search-empty style="display:none;">${T.common.noResults}</p>
        </div>
      </div>
    </div>
    <script>
      (function(){
        const overlay = document.querySelector('[data-search]');
        const input = document.querySelector('[data-search-input]');
        const results = document.querySelector('[data-search-results]');
        const empty = document.querySelector('[data-search-empty]');
        const idx = ${JSON.stringify(idx)};
        function render(q){
          const list = q ? idx.filter(i => i.title.includes(q)) : idx.slice(0, 6);
          results.innerHTML = list.map(i => \`
            <a href="\${i.href}" class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <span class="font-semibold">\${i.title}</span>
              <span class="text-xs opacity-60">\${i.kind}</span>
            </a>\`).join('');
          empty.style.display = (q && list.length === 0) ? 'block' : 'none';
        }
        input.addEventListener('input', e => render(e.target.value.trim()));
        render('');
      })();
    <\/script>
    `;
  }

  /* ---------- PRELOADER ---------- */
  function preloaderHTML() {
    return `
    <div class="preloader" id="preloader" aria-hidden="true">
      <div class="absolute inset-0 bg-aurora bg-grain"></div>
      <div class="relative z-10 flex flex-col items-center">
        <!-- capsule SVG -->
        <svg width="120" height="220" viewBox="0 0 120 220" class="mb-6">
          <defs>
            <linearGradient id="capTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FF4FA3"/>
              <stop offset="100%" stop-color="#7C4DFF"/>
            </linearGradient>
            <linearGradient id="capBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00D4C2"/>
              <stop offset="100%" stop-color="#2F6BFF"/>
            </linearGradient>
            <clipPath id="capClip">
              <rect x="30" y="20" width="60" height="180" rx="30"/>
            </clipPath>
          </defs>
          <!-- outline -->
          <rect x="30" y="20" width="60" height="180" rx="30" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
          <!-- liquid fill -->
          <g clip-path="url(#capClip)">
            <rect id="capLiquid" x="30" y="200" width="60" height="0" fill="url(#capBottom)"/>
            <rect id="capLiquidTop" x="30" y="200" width="60" height="0" fill="url(#capTop)" opacity="0.8"/>
          </g>
          <!-- bubbles -->
          <g id="capBubbles"></g>
          <!-- cap dividing line -->
          <line x1="30" y1="110" x2="90" y2="110" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
        </svg>
        <!-- progress -->
        <div class="text-center">
          <div class="preloader__progress text-5xl font-extrabold text-aurora" id="preProgress">۰</div>
          <div class="text-xs opacity-60 mt-2 tracking-widest">در حال بارگذاری</div>
        </div>
        <!-- wordmark reveal -->
        <div class="absolute -bottom-24 opacity-0 text-center" id="preWordmark">
          <div class="text-4xl font-extrabold text-aurora">اکونوریس</div>
          <div class="text-sm opacity-70 mt-1">${C.subtitle}</div>
        </div>
      </div>
    </div>
    `;
  }

  /* ---------- MOBILE ACTION BAR ---------- */
  function mobileBarHTML() {
    return `
    <div class="mobile-bar md:hidden" id="mobileBar">
      <div class="grid grid-cols-2 gap-2 px-3 py-2 mx-3 mb-3 rounded-2xl glass">
        <a href="tel:${C.phone}" class="btn btn-ghost text-sm py-2.5">${svg('phone', 18)} تماس</a>
        <a href="contact.html" class="btn btn-primary text-sm py-2.5">${T.common.freeConsultation}</a>
      </div>
    </div>
    `;
  }

  /* ---------- FOOTER ---------- */
  function footerHTML() {
    const year = fa(new Date().getFullYear() - 621); // Persian year approximation
    return `
    <footer class="relative overflow-hidden bg-ink-900 text-white mt-24" id="siteFooter">
      <!-- animated wave top -->
      <svg class="block w-full h-12" preserveAspectRatio="none" viewBox="0 0 1440 60" fill="none">
        <path d="M0,30 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,0 L0,0 Z" fill="currentColor" class="text-[var(--c-ink-900)]"/>
      </svg>
      <div class="absolute inset-0 bg-aurora opacity-30"></div>
      <div class="absolute inset-0 bg-dot-grid opacity-30"></div>

      <div class="relative container-x py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Brand -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-10 h-10 rounded-xl grid place-items-center" style="background: var(--grad-aurora);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
                </svg>
              </span>
              <div>
                <div class="font-extrabold text-lg">${C.brand}</div>
                <div class="text-[10px] opacity-70">${C.subtitle}</div>
              </div>
            </div>
            <p class="text-xs opacity-70 leading-relaxed">${T.footer.brandText}</p>
          </div>

          <!-- Services -->
          <div>
            <h4 class="font-bold mb-4 text-[var(--c-teal)]">${T.footer.servicesTitle}</h4>
            <ul class="space-y-2">
              ${T.footer.services.map(s => `<li><a href="#" class="text-sm opacity-75 hover:opacity-100 hover:text-[var(--c-teal)] transition">${s}</a></li>`).join('')}
            </ul>
          </div>

          <!-- Quick links -->
          <div>
            <h4 class="font-bold mb-4 text-[var(--c-violet)]">${T.footer.quickLinksTitle}</h4>
            <ul class="grid grid-cols-2 gap-2">
              ${T.footer.quickLinks.map(l => `<li><a href="${l.href}" class="text-sm opacity-75 hover:opacity-100 hover:text-[var(--c-violet)] transition">${l.label}</a></li>`).join('')}
            </ul>
          </div>

          <!-- Where -->
          <div>
            <h4 class="font-bold mb-4 text-[var(--c-amber)]">${T.footer.whereTitle}</h4>
            <a href="${C.mapsLink}" target="_blank" rel="noopener" class="flex items-start gap-2 mb-3 group">
              <span class="mt-1 text-[var(--c-amber)]">${svg('location', 18)}</span>
              <span class="text-xs opacity-75 group-hover:opacity-100 leading-relaxed">${C.address}</span>
            </a>
            <a href="tel:${C.phone}" class="flex items-center gap-2 mb-3 group">
              <span class="text-[var(--c-teal)]">${svg('phone', 18)}</span>
              <span class="text-sm font-bold group-hover:text-[var(--c-teal)] transition" dir="ltr">${C.phoneDisplay}</span>
            </a>
            <div class="flex gap-2 mt-4">
              <a href="${C.social.instagram}" class="w-9 h-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/15 transition" aria-label="اینستاگرام">${svg('insta', 18)}</a>
              <a href="${C.social.linkedin}" class="w-9 h-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/15 transition" aria-label="لینکدین">${svg('linkedin', 18)}</a>
              <a href="${C.social.telegram}" class="w-9 h-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/15 transition" aria-label="تلگرام">${svg('telegram', 18)}</a>
              <a href="${C.social.twitter}" class="w-9 h-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/15 transition" aria-label="توییتر">${svg('twitter', 18)}</a>
            </div>
          </div>
        </div>

        <!-- divider -->
        <div class="divider-glow my-8"></div>

        <!-- Bottom -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-xs opacity-60">${T.footer.copyright} — <span dir="ltr">${year}</span></p>

          <!-- Fazl Daru badge -->
          <a href="${C.holdingUrl}" target="_blank" rel="noopener"
             class="group flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10 hover:border-[var(--c-teal)] transition">
            <span class="w-7 h-7 rounded-lg grid place-items-center" style="background: linear-gradient(135deg, var(--c-amber), var(--c-coral));">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4Z"/></svg>
            </span>
            <span class="text-xs">
              <span class="opacity-60">${C.holdingBadgeEn}</span>
              <span class="block font-bold">${C.holdingBadgeFa}</span>
            </span>
          </a>

          <!-- back to top rocket -->
          <button class="rocket-btn w-12 h-12 grid place-items-center rounded-full" style="background: var(--grad-aurora); box-shadow: var(--shadow-glow-violet);"
                  data-back-to-top aria-label="${T.common.backToTop}">
            ${svg('arrow-up', 22)}
          </button>
        </div>
      </div>
    </footer>
    `;
  }

  /* ---------- CURSOR ---------- */
  function cursorHTML() {
    return `<div class="cursor-ring" aria-hidden="true"></div><div class="cursor-dot" aria-hidden="true"></div>`;
  }

  /* ---------- INJECT ---------- */
  function inject() {
    const headerHost = document.querySelector('[data-host="header"]') || document.body.firstElementChild;
    const footerHost = document.querySelector('[data-host="footer"]');
    const preHost = document.querySelector('[data-host="preloader"]');

    // Preloader — only on first visit per session (when preloaderSessionOnly is true)
    const shouldShowPreloader = C.preloaderSessionOnly ? !sessionStorage.getItem('econoris_preloaded') : true;
    if (shouldShowPreloader) {
      if (preHost) preHost.outerHTML = preloaderHTML();
      else document.body.insertAdjacentHTML('afterbegin', preloaderHTML());
    } else if (preHost) {
      preHost.remove();
    }

    // Header — prepend to body
    if (headerHost && headerHost.hasAttribute('data-host')) headerHost.outerHTML = headerHTML();
    else document.body.insertAdjacentHTML('afterbegin', headerHTML());

    // Drawer, search, cursor — append to body
    document.body.insertAdjacentHTML('beforeend', drawerHTML());
    document.body.insertAdjacentHTML('beforeend', searchHTML());
    document.body.insertAdjacentHTML('beforeend', cursorHTML());
    document.body.insertAdjacentHTML('beforeend', mobileBarHTML());

    // Footer
    if (footerHost) footerHost.outerHTML = footerHTML();
    else document.body.insertAdjacentHTML('beforeend', footerHTML());

    // Mark body class for cursor
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) document.body.classList.add('cursor-ready');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
