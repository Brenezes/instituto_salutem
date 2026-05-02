/**
 * main.js — Instituto Salutem · Psicologia Plural
 * Navbar mobile, scroll-reveal, interações gerais.
 * Vanilla JS, sem dependências.
 */

(function () {
  'use strict';

  // ── 1. NAVBAR ─────────────────────────────────────────────
  (function initNavbar() {
    const navbar  = document.querySelector('.navbar');
    const toggle  = document.querySelector('.navbar__toggle');
    const navWrap = document.querySelector('.navbar__nav-wrap');
    const navLinks = document.querySelectorAll('.navbar__link');

    if (!navbar) return;

    // Scroll: adicionar classe .scrolled após 60px
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // checar posição inicial

    // Toggle menu mobile
    if (toggle && navWrap) {
      toggle.addEventListener('click', () => {
        const isOpen = navWrap.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        // Impedir scroll do body quando menu aberto
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Fechar ao clicar em link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navWrap.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Fechar ao pressionar Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navWrap.classList.contains('open')) {
          navWrap.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          toggle.focus();
        }
      });
    }

    // Marcar link ativo com base na URL atual
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      // Normalizar: remover trailing slash e considerar index
      const linkPath = href.replace(/\/$/, '') || '/';
      const pagePath = currentPath.replace(/\/$/, '') || '/';

      if (
        pagePath === linkPath ||
        (linkPath !== '/' && linkPath !== '/index.html' && pagePath.includes(linkPath))
      ) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Home: marcar se na raiz
    if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) {
      const homeLink = document.querySelector('.navbar__link[href="/"], .navbar__link[href="index.html"], .navbar__link[href="/index.html"]');
      if (homeLink) {
        homeLink.classList.add('active');
        homeLink.setAttribute('aria-current', 'page');
      }
    }
  })();

  // ── 2. SCROLL REVEAL (Intersection Observer) ──────────────
  (function initScrollReveal() {
    // Verificar suporte e reduced motion
    if (!('IntersectionObserver' in window)) {
      // Fallback: mostrar todos os elementos
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      observer.observe(el);
    });
  })();

  // ── 3. SCROLL SUAVE PARA ÂNCORAS ─────────────────────────
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        const navbarH = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - navbarH - 20;

        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });
  })();

  // ── 4. FEEDBACK DO FORMULÁRIO (Cloudflare API / Resend) ───────────────────
  (function initFormFeedback() {
    // Agora busca pelo ID do formulário que você definiu no HTML
    const form = document.getElementById('formContato');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const successEl = form.parentElement.querySelector('.form-success');
      const errorEl   = form.parentElement.querySelector('.form-error');

      // Estado de loading
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

    // Fotos da equipe: fallback para avatar placeholder
    document.querySelectorAll('.team-card__photo').forEach(img => {
      img.addEventListener('error', function () {
        const name = this.getAttribute('alt') || 'PS';
        const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        // Substituir por SVG inline com iniciais
        const svg = `data:image/svg+xml;utf8,${encodeURIComponent(generateAvatarSVG(initials))}`;
        this.src = svg;
      });
    });
  })();

  // Gerar SVG de avatar com iniciais
  function generateAvatarSVG(initials) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="60" fill="#EEF3FB"/>
      <text x="60" y="67" font-family="Georgia, serif" font-size="36" font-weight="700"
        fill="#1B3A6B" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>`;
  }

  // ── 6. INDICADOR DE SCROLL HERO ───────────────────────────
  (function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero__scroll');
    if (!scrollIndicator) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    }, { passive: true });
  })();

  // ── 7. COOKIE BANNER SIMPLES (LGPD) ──────────────────────
  (function initCookieBanner() {
    if (localStorage.getItem('salutem_cookies_accepted')) return;

    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    banner.style.display = 'flex';

    const acceptBtn = banner.querySelector('[data-accept]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('salutem_cookies_accepted', '1');
        banner.style.display = 'none';
      });
    }
  })();

  // ── 8. MARCAR ANO ATUAL NO FOOTER ─────────────────────────
  (function setCurrentYear() {
    document.querySelectorAll('.js-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  })();

})();
