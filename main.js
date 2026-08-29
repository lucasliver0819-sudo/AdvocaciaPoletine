(() => {
  "use strict";

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const rail = document.querySelector('.rail');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Header: transparent-over-hero -> solid on scroll
  --------------------------------------------------------------------- */
  const HEADER_THRESHOLD = 64;
  const setHeaderState = () => {
    if (window.scrollY > HEADER_THRESHOLD) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  /* ---------------------------------------------------------------------
     Scroll progress -> signature rail
  --------------------------------------------------------------------- */
  const updateRailProgress = () => {
    if (!rail) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    rail.style.setProperty('--progress', pct.toFixed(2) + '%');
  };
  updateRailProgress();
  window.addEventListener('scroll', updateRailProgress, { passive: true });
  window.addEventListener('resize', updateRailProgress);

  /* ---------------------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------------------- */
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });
  mobileNav.querySelectorAll('a, .btn').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  /* ---------------------------------------------------------------------
     Áreas de atuação — tap-to-open on touch devices (hover handles desktop)
  --------------------------------------------------------------------- */
  const areaButtons = document.querySelectorAll('.area');
  areaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('is-open');
      areaButtons.forEach(b => b.classList.remove('is-open'));
      if (!isOpen) btn.classList.add('is-open');
    });
  });

  /* ---------------------------------------------------------------------
     GSAP: load-in sequence + scroll reveals + subtle parallax
  --------------------------------------------------------------------- */
  const hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero load-in sequence
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.hero [data-reveal]', {
        opacity: 1, y: 0, duration: 1.1, stagger: 0.12, delay: 0.15
      })
      .fromTo('.hero__media', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.3 }, 0.2);

    // Generic scroll reveals for everything else
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (el.closest('.hero')) return; // already animated above
      gsap.fromTo(el,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );
    });

    // Hero parallax
    const parallaxEl = document.querySelector('[data-parallax]');
    if (parallaxEl) {
      gsap.to(parallaxEl, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    // Areas: animate underline growth in from left as section enters
    gsap.fromTo('.areas__list',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, scrollTrigger: { trigger: '.areas__list', start: 'top 90%' } }
    );
  } else {
    // No GSAP / reduced motion: reveal everything immediately, no animation
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  }

})();
