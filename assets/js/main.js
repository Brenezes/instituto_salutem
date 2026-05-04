/* ====
   main.js — Instituto Salutem · Psicologia Plural
   ==== */

(function () {
  'use strict';

  /* ── Navbar: scroll state ──── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Hamburger menu ──── */
  const toggle   = document.querySelector('.navbar__toggle');
  const navWrap  = document.querySelector('.navbar__nav-wrap');

  function openMenu() {
    if (!toggle || !navWrap) return;
    toggle.classList.add('open');
    navWrap.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!toggle || !navWrap) return;
    toggle.classList.remove('open');
    navWrap.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && navWrap) {
    /* Abre/fecha ao clicar no botão */
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navWrap.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Fecha ao clicar em qualquer link do menu */
    navWrap.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* Fecha ao clicar no overlay (fundo) ou na área do X (canto sup direito) */
    navWrap.addEventListener('click', function (e) {
      const rect = navWrap.getBoundingClientRect();
      const inXArea = e.clientX > rect.right - 80 && e.clientY < rect.top + 80;
      if (e.target === navWrap || inXArea) {
        closeMenu();
      }
    });

    /* Fecha ao clicar fora do menu */
    document.addEventListener('click', function (e) {
      if (navWrap.classList.contains('open') &&
          !navWrap.contains(e.target) &&
          !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    /* Fecha com tecla Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navWrap.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });

    /* Fecha ao redimensionar para desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  /* ── Scroll Reveal ──── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── Stagger children reveal ──── */
  document.querySelectorAll('.stagger-children').forEach(function (parent) {
    Array.from(parent.children).forEach(function (child, i) {
      child.style.transitionDelay = (0.05 + i * 0.1) + 's';
    });
  });

  /* ── Smooth scroll para âncoras ──── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Cookie banner (LGPD) ──── */
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    if (!localStorage.getItem('cookies-accepted')) {
      banner.style.display = 'flex';
    }
    const acceptBtn = banner.querySelector('[data-accept]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', '1');
        banner.style.display = 'none';
      });
    }
  }

  /* ── Ano dinâmico no footer ──── */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
