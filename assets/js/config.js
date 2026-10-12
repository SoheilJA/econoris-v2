/**
 * Econoris — Site-wide configuration
 * Edit these constants to update phone/address/social links across every page.
 */
window.ECONORIS_CONFIG = {
  brand: 'اکونوریس',
  brandLatin: 'Econoris',
  subtitle: 'شتاب‌دهنده داروسازی',
  phone: '09192639746',
  phoneDisplay: '۰۹۱۹-۲۶۳-۹۷۴۶',
  email: 'info@econoris.ir', // placeholder
  address: 'خراسان رضوی - مشهد - بلوار ملک‌الشرا بهار - چهارراه بی‌سیم - بین جهاد ۴ و ۶ - ساختمان بیوتکنولوژی - طبقه ۴',
  mapsLink: 'https://maps.app.goo.gl/KPK78XQ3PnSSHeqZ6',
  mapsLabel: 'مسیریابی با بلد',
  // Parent pharmaceutical holding
  holdingName: 'گروه فضل دارو',
  holdingNameLatin: 'Fazl Daru Group',
  holdingBadgeFa: 'زیرمجموعه گروه فضل دارو',
  holdingBadgeEn: 'Part of Fazl Daru Group',
  holdingUrl: 'https://phazldaru.ir',
  // Social placeholders
  social: {
    instagram: '#',
    linkedin: '#',
    telegram: '#',
    twitter: '#',
  },
  // CTA
  ctaConsult: 'درخواست مشاوره رایگان',
  ctaCall: 'تماس با پشتیبانی',
  // Page transition color (wipe)
  transitionColor: '#070B1F',
  // Preloader minimum/maximum duration (ms)
  preloader: { min: 1600, max: 3000 },
  // Whether to show preloader again on every navigation (false = first visit only per session)
  preloaderSessionOnly: true,
  // Recaptcha / form submit endpoint placeholder
  formEndpoint: '#',
};

/**
 * Convert a Western number to Persian digits.
 * @param {number|string} n
 * @returns {string}
 */
window.toFa = function toFa(n) {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (d) => map[+d]);
};

/**
 * Mega-menu + footer navigation source-of-truth.
 * Used by components.js for both desktop mega menu and mobile accordion.
 */
window.ECONORIS_NAV = {
  categories: [
    {
      key: 'shared-workspace',
      title: 'فضای کار اشتراکی',
      titleLatin: 'Shared Workspace',
      accent: 'violet',
      href: 'services/shared-workspace.html',
      items: [
        { title: 'میز پژوهشی', desc: 'دسترسی ساختاریافته به منابع علمی و تحلیل داده‌های پژوهشی.', href: 'services/research-desk.html' },
        { title: 'اتاق اختصاصی پژوهشی', desc: 'بستر اختصاصی برای اجرای عمیق طرح‌های R&D.', href: 'services/private-research-room.html' },
        { title: 'آزمایشگاه', desc: 'تجهیزات پیشرفته و مدل‌های انعطاف‌پذیر دسترسی.', href: 'services/laboratory.html' },
        { title: 'اینترنت پرسرعت', desc: 'دسترسی بی‌وقفه به منابع علمی و ابزارهای آنلاین.', href: 'services/high-speed-internet.html' },
        { title: 'مشاوره حقوقی', desc: 'حفاظت از مالکیت فکری و تدوین قراردادهای مستحکم.', href: 'services/legal-consulting.html' },
        { title: 'دسترسی به منابع اطلاعاتی', desc: 'پایگاه‌های داده علمی و ژورنال‌های تخصصی.', href: 'services/information-resources.html' },
      ],
    },
    {
      key: 'idea-support',
      title: 'حمایت از ایده',
      titleLatin: 'Idea Support',
      accent: 'coral',
      href: 'idea-support.html',
      items: [
        { title: 'مشاوره تخصصی', desc: 'اعتبارسنجی و پرورش ایده‌های نوآورانه.', href: 'idea-support.html#consulting' },
        { title: 'شبکه‌سازی', desc: 'گسترش شبکه ارتباطی و معرفی به ذی‌نفعان.', href: 'idea-support.html#networking' },
        { title: 'توسعه تجاری', desc: 'طراحی مدل کسب‌وکار و مسیر درآمدزایی.', href: 'idea-support.html#business-development' },
        { title: 'منابع مالی', desc: 'تسهیل دسترسی به منابع مالی و سرمایه‌گذاران.', href: 'idea-support.html#funding' },
      ],
    },
    {
      key: 'research-projects',
      title: 'حمایت از طرح‌های پژوهشی',
      titleLatin: 'Research Projects',
      accent: 'teal',
      href: 'research-projects-support.html',
      items: [
        { title: 'تخصیص بودجه پژوهشی', desc: 'تأمین منابع مالی برای طرح‌های مصوب.', href: 'research-projects-support.html#budget' },
        { title: 'امکانات آزمایشگاهی', desc: 'دسترسی به زیرساخت‌های پیشرفته پژوهش.', href: 'research-projects-support.html#facilities' },
        { title: 'مشاوره علمی تخصصی', desc: 'هدایت علمی توسط اساتید متخصص.', href: 'research-projects-support.html#scientific-consulting' },
        { title: 'حمایت از انتشار مقالات', desc: 'پشتیبانی در نگارش و چاپ علمی.', href: 'research-projects-support.html#publication-support' },
        { title: 'ارتباط با صنعت', desc: 'پل ارتباطی میان پژوهش و صنعت دارو.', href: 'research-projects-support.html#industry-connection' },
      ],
    },
  ],
};
