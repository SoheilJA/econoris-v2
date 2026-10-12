/**
 * Econoris — page-research-projects.js
 * Builds the 5-stage horizontal timeline + animates dots on scroll.
 */
(function () {
  const fa = window.toFa;
  const svg = window.ECONORIS_SVG;

  document.addEventListener('DOMContentLoaded', () => {
    injectTimeline();
    runAnimations();
  });

  function injectTimeline() {
    const host = document.getElementById('timelineStages');
    if (!host) return;
    const stages = [
      { n: 1, t: 'تخصیص بودجه پژوهشی', href: '#budget', color: '#2F6BFF', icon: 'money' },
      { n: 2, t: 'امکانات آزمایشگاهی', href: '#facilities', color: '#7C4DFF', icon: 'flask' },
      { n: 3, t: 'مشاوره علمی تخصصی', href: '#scientific-consulting', color: '#00D4C2', icon: 'microscope' },
      { n: 4, t: 'حمایت از انتشار مقالات', href: '#publication-support', color: '#FFB938', icon: 'book' },
      { n: 5, t: 'ارتباط با صنعت', href: '#industry-connection', color: '#FF4FA3', icon: 'factory' },
    ];
    host.innerHTML = stages.map((s, i) => `
      <a href="${s.href}" class="reveal relative flex flex-col items-center text-center group" style="transition-delay:${i * 80}ms;">
        <div class="w-16 h-16 rounded-full grid place-items-center mb-3 transition-transform group-hover:scale-110" style="background:${s.color};box-shadow:0 0 30px ${s.color}66;">
          <span class="text-white">${svg(s.icon, 26)}</span>
        </div>
        <div class="text-xs opacity-50 mb-1">مرحله ${fa(s.n)}</div>
        <h3 class="font-bold text-sm leading-tight" style="color:${s.color};">${s.t}</h3>
      </a>
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
