# نقشه ساختار پروژه — Econoris v2

مرجع سریع برای پیدا کردن فایلِ مربوط به هر بخش. سایت استاتیک چندصفحه‌ای فارسی (RTL) است؛
هیچ فریم‌ورک runtime نداریم — HTML لایه‌ای، Tailwind از CDN، و کامپوننت‌ها با جاوااسکریپتِ خام تزریق می‌شن.

## درخت پروژه

```
econoris-v2/
├── index.html                       # صفحه اصلی
├── about.html                       # درباره ما
├── blog.html                        # وبلاگ
├── contact.html                     # تماس با ما
├── idea-support.html                # حمایت از ایده
├── research-projects-support.html   # حمایت از پروژه‌های تحقیقاتی
├── pages/                           # صفحات ثانویه (فعلاً همه‌اش «به‌زودی»)
│   ├── achievements.html            #   دستاوردها
│   ├── events.html                  #   رویدادها
│   ├── scientific-articles.html     #   مقالات علمی
│   └── trainings.html               #   آموزش‌ها
├── services/                        # صفحات خدمات (هر کدام سه‌بعدی مخصوص خودش را دارند)
│   ├── high-speed-internet.html
│   ├── information-resources.html
│   ├── laboratory.html
│   ├── legal-consulting.html
│   ├── private-research-room.html
│   ├── research-desk.html
│   └── shared-workspace.html
├── assets/
│   ├── css/
│   │   ├── custom.css               # طراحی سفارشی روی توکن‌های Tailwind
│   │   ├── input.css                # ورودی بیلد Tailwind (هنوز ساخته نشده)
│   │   └── output.css               # خروجی بیلد Tailwind (هنوز ساخته نشده)
│   ├── img/
│   │   └── favicon.svg
│   └── js/
│       ├── config.js                # تنظیمات سراسری (تلفن، نشانی، شبکه‌های اجتماعی)
│       ├── content.js               # دیکشنری متن‌های فارسی
│       ├── components.js            # تزریق هدر، فوتر، منو، کامپوننت‌های مشترک
│       ├── main.js                  # تعاملات سراسری (اسکرول، منو، انیمیشن)
│       ├── animations.js            # انیمیشن‌های مشترک
│       ├── preloader.js             # صفحه‌ی بارگذاری
│       ├── page-*.js                # منطق اختصاصی هر صفحه
│       └── three-*.js               # صحنه‌های سه‌بعدی Three.js
├── package.json                     # اسکریپت dev بیلد Tailwind
└── .gitignore
```

## نگاشت صفحات → فایل‌ها

هر صفحه HTML این فایل‌های مشترک را لود می‌کند:
`config.js` → `content.js` → `components.js` → `main.js` → `animations.js` → `preloader.js`
به‌علاوه یک `page-*.js` و در صورت وجود یک `three-*.js` اختصاصی.

| صفحه HTML | منطق صفحه | صحنه سه‌بعدی |
|---|---|---|
| `index.html` | `page-home.js` | `three-hero.js` |
| `about.html` | `page-about.js` | `three-about.js` |
| `blog.html` | `page-blog.js` | — |
| `contact.html` | `page-contact.js` | — |
| `idea-support.html` | `page-idea-support.js` | — |
| `research-projects-support.html` | `page-research-projects.js` | — |
| `services/high-speed-internet.html` | `page-high-speed-internet.js` | `three-globe.js` |
| `services/information-resources.html` | `page-information-resources.js` | `three-library.js` |
| `services/laboratory.html` | `page-laboratory.js` | `three-molecule.js` |
| `services/legal-consulting.html` | `page-legal-consulting.js` | — |
| `services/private-research-room.html` | `page-private-research-room.js` | `three-room.js` |
| `services/research-desk.html` | `page-research-desk.js` | `three-knowledge.js` |
| `services/shared-workspace.html` | `page-shared-workspace.js` | — |
| `pages/*.html` (هر ۴ صفحه) | `page-coming-soon.js` | — |

## برای تغییر X، کجا را ویرایش کنم؟

| می‌خوام تغییر بدم… | فایل هدف |
|---|---|
| شماره تلفن، نشانی، ایمیل، لینک شبکه‌های اجتماعی | `assets/js/config.js` |
| هر متن فارسی (عناوین، دکمه‌ها، توضیحات) | `assets/js/content.js` |
| هدر، فوتر، منوی موبایل، همکاران، دکمه بازگشت به بالا | `assets/js/components.js` |
| رنگ‌ها، فونت، متغیرهای CSS سفارشی | `assets/css/custom.css` |
| رنگ/فونت/انیمیشن Tailwind | بلاک `tailwind.config` داخل `<head>` **هر فایل HTML** (هیچ فایل مشترکی وجود ندارد!) |
| اسکرول نرم، افکت‌های نشانگر، reveal در اسکرول | `assets/js/main.js` |
| محتوای یک صفحه‌ی خاص | `assets/js/page-<page>.js` متناظر |
| صحنه سه‌بعدی یک صفحه | `assets/js/three-*.js` متناظر |
| سئو، عنوان، meta، OG تگ‌ها | بخش `<head>` همان فایل HTML |

## نکات مهم

- **Config تم داخل HTML‌ها کپی شده**، نه مرکزی. تغییر رنگ در ۱۹ فایل HTML باید تکرار شود (مگر اینکه بعداً مرکزی‌سازی شود).
- صفحات `pages/` همگی از `page-coming-soon.js` استفاده می‌کنند و هنوز ساخته نشده‌اند.
- محیط توسعه: Live Server روی پورت `5501` (تنظیمات در `.vscode/settings.json`).
- بیلد Tailwind: `npm run dev` (نیازمند ساخت `assets/css/input.css`).
- `agent-progress.md` دفترچه کار است و در `.gitignore` قرار دارد.
