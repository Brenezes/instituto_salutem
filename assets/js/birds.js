/**
 * birds.js — Instituto Salutem · Psicologia Plural
 * Animação de pássaros em silhueta via Canvas API puro.
 * Sem dependências externas.
 *
 * Características:
 * - Trajetória senoidal suave
 * - Batida de asas realista com interpolação
 * - Entrada/saída pelas bordas
 * - Responsivo (menos pássaros em mobile)
 * - Respeita prefers-reduced-motion
 */

(function () {
  'use strict';

  // ── Verificar reduced motion ──────────────────────────────
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) return;

  // ── Encontrar o hero e criar o canvas ────────────────────
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'birds-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');

  // ── Variáveis globais de estado ───────────────────────────
  let W = 0;
  let H = 0;
  let birds = [];
  let animFrame = null;
  let isMobile = false;

  // ── Cor dos pássaros (azul-marinho do brand) ──────────────
  const BIRD_COLOR = '#1B3A6B';

  // ── Funções utilitárias ───────────────────────────────────
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  // ── Classe Bird ───────────────────────────────────────────
  class Bird {
    constructor(startOffscreen = false) {
      this.reset(startOffscreen);
    }

    reset(startOffscreen = false) {
      // Posição inicial: fora da borda esquerda, ou espalhado pelo canvas
      this.x = startOffscreen ? -rand(50, 200) : rand(-100, W + 100);
      this.y = rand(H * 0.05, H * 0.75);
      this.baseY = this.y;

      // Velocidade e parâmetros de voo
      this.speed     = rand(0.4, isMobile ? 0.9 : 1.2);
      this.size      = rand(isMobile ? 8 : 12, isMobile ? 16 : 22);
      this.opacity   = rand(0.18, 0.38);
      this.amplitude = rand(15, 40);
      this.frequency = rand(0.004, 0.009);
      this.phase     = rand(0, Math.PI * 2);

      // Batida de asas
      this.wingPhase = rand(0, Math.PI * 2);
      this.wingSpeed = rand(0.06, 0.12);

      // Usado para calcular posição Y senoidal
      this.xOffset = this.x;
    }

    update() {
      // Mover horizontalmente
      this.x += this.speed;

      // Trajetória senoidal: y varia em função de x
      this.y = this.baseY + this.amplitude * Math.sin(this.frequency * (this.x - this.xOffset) + this.phase);

      // Animar asas
      this.wingPhase += this.wingSpeed;

      // Reposicionar quando sair pela direita
      if (this.x > W + 60) {
        this.x = -rand(50, 150);
        this.baseY = rand(H * 0.05, H * 0.75);
        this.y = this.baseY;
        this.xOffset = this.x;
        // Aleatorizar nova velocidade e parâmetros
        this.speed     = rand(0.4, isMobile ? 0.9 : 1.2);
        this.amplitude = rand(15, 40);
        this.frequency = rand(0.004, 0.009);
        this.phase     = rand(0, Math.PI * 2);
        this.wingSpeed = rand(0.06, 0.12);
        this.opacity   = rand(0.18, 0.38);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = BIRD_COLOR;
      ctx.lineWidth   = this.size * 0.12;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';

      const s = this.size;
      const x = this.x;
      const y = this.y;

      // Fator de batida de asas: 0 = asas abertas, 1 = asas fechadas
      // Math.sin vai de -1 a 1; normalizamos para 0–1
      const wingFactor = (Math.sin(this.wingPhase) + 1) / 2;

      // A elevação da asa varia:
      // - Asa totalmente aberta: ponta da asa em y - size * 0.5
      // - Asa fechada (para baixo): ponta em y + size * 0.05
      const wingLift = s * 0.5 - wingFactor * s * 0.55;

      ctx.beginPath();

      // Asa esquerda: curva quadrática do centro para a ponta esquerda
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x - s * 0.5, y - wingLift * 0.6,
        x - s,       y - wingLift * 0.2
      );

      // Asa direita: curva quadrática do centro para a ponta direita
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + s * 0.5, y - wingLift * 0.6,
        x + s,       y - wingLift * 0.2
      );

      ctx.stroke();
      ctx.restore();
    }
  }

  // ── Inicializar canvas e pássaros ─────────────────────────
  function init() {
    resize();
    birds = [];

    const birdCount = isMobile ? randInt(4, 6) : randInt(8, 12);

    for (let i = 0; i < birdCount; i++) {
      // Inicializar espalhados pelo canvas (não todos do lado esquerdo)
      birds.push(new Bird(false));
    }
  }

  // ── Ajustar tamanho do canvas ─────────────────────────────
  function resize() {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    isMobile = W < 768;
  }

  // ── Loop de animação ──────────────────────────────────────
  function animate() {
    ctx.clearRect(0, 0, W, H);

    birds.forEach(bird => {
      bird.update();
      bird.draw(ctx);
    });

    animFrame = requestAnimationFrame(animate);
  }

  // ── Parar animação (cleanup) ──────────────────────────────
  function stop() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  // ── Responsividade: re-inicializar no resize ──────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      stop();
      init();
      animate();
    }, 200);
  });

  // ── Pausar quando a aba não está visível (performance) ────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      animate();
    }
  });

  // ── Iniciar ───────────────────────────────────────────────
  // Aguardar o hero ter dimensões definidas
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); animate(); });
  } else {
    // Pequeno delay para garantir que o hero já foi renderizado
    requestAnimationFrame(() => { init(); animate(); });
  }

})();
