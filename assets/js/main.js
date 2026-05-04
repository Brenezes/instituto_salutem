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

  /* FEEDBACK DO FORMULÁRIO (Cloudflare API / Resend) */

  (function initFormFeedback() {
    const form = document.getElementById('formContato');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const successEl = form.parentElement.querySelector('.form-success');
      const errorEl   = form.parentElement.querySelector('.form-error');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="ph ph-spinner-gap" aria-hidden="true" style="animation: spin 1s linear infinite;"></i> Enviando...';
      }

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          if (successEl) {
            successEl.style.display = 'block';
            if (errorEl) errorEl.style.display = 'none';
            successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          throw new Error('Falha no envio');
        }
      } catch {
        if (errorEl) {
          errorEl.style.display = 'block';
          if (successEl) successEl.style.display = 'none';
        } else {
          alert('Ocorreu um erro. Por favor, entre em contato pelo WhatsApp ou e-mail.');
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="ph ph-paper-plane-tilt" aria-hidden="true"></i> Enviar mensagem';
        }
      }
    });
  })();

  // ── 5. IMAGENS COM FALLBACK ───────────────────────────────
  (function initImageFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach(img => {
      img.addEventListener('error', function () {
        const fallback = this.getAttribute('data-fallback');
        if (fallback && this.src !== fallback) {
          this.src = fallback;
        }
      });
    });

    document.querySelectorAll('.team-card__photo').forEach(img => {
      img.addEventListener('error', function () {
        const name = this.getAttribute('alt') || 'PS';
        const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        const svg = `data:image/svg+xml;utf8,${encodeURIComponent(generateAvatarSVG(initials))}`;
        this.src = svg;
      });
    });
  })();

})();
