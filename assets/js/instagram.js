/**
 * instagram.js — Instituto Salutem · Psicologia Plural
 *
 * DUAS OPÇÕES DE IMPLEMENTAÇÃO:
 *
 * OPÇÃO A (Recomendada): SnapWidget embed — zero código necessário.
 *   O cliente acessa snapwidget.com, conecta o Instagram e cola o iframe.
 *   Ver instruções em pages/artigos.html
 *
 * OPÇÃO B: Instagram Graph API com token long-lived.
 *   Descomentar o bloco abaixo e inserir o token.
 *   ATENÇÃO: token expira em 60 dias — renovar manualmente.
 */

(function () {
  'use strict';

  // ── OPÇÃO B — Instagram Graph API ────────────────────────
  // Para usar: descomentar e inserir IG_TOKEN abaixo.
  // O token long-lived é obtido em: developers.facebook.com
  //
  // const IG_TOKEN = 'SEU_TOKEN_LONG_LIVED_AQUI';
  //
  // async function loadInstagramFeed() {
  //   const container = document.getElementById('ig-feed-container');
  //   if (!container) return;
  //
  //   const endpoint = `https://graph.instagram.com/me/media` +
  //     `?fields=id,caption,media_url,media_type,permalink,timestamp` +
  //     `&limit=9&access_token=${IG_TOKEN}`;
  //
  //   try {
  //     showLoading(container);
  //     const res = await fetch(endpoint);
  //     if (!res.ok) throw new Error('Falha na API');
  //     const data = await res.json();
  //     renderCards(container, data.data);
  //   } catch (err) {
  //     console.warn('Instagram API:', err);
  //     showFallback(container);
  //   }
  // }
  //
  // function renderCards(container, posts) {
  //   const filtered = posts.filter(p =>
  //     p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM'
  //   );
  //
  //   container.innerHTML = '';
  //   const grid = document.createElement('div');
  //   grid.className = 'grid grid-3';
  //
  //   filtered.forEach(post => {
  //     const caption  = post.caption || '';
  //     const lines    = caption.split(/\n/);
  //     const title    = lines[0].slice(0, 80).replace(/#\w+/g, '').trim();
  //     const excerpt  = caption.slice(title.length, title.length + 180)
  //                        .replace(/#\w+/g, '').trim();
  //     const date     = new Date(post.timestamp).toLocaleDateString('pt-BR', {
  //                        day: 'numeric', month: 'long', year: 'numeric'
  //                      });
  //
  //     const card = document.createElement('article');
  //     card.className = 'article-card';
  //     card.innerHTML = `
  //       <div class="article-card__img">
  //         <img src="${post.media_url}" alt="${title}" loading="lazy">
  //       </div>
  //       <div class="article-card__body">
  //         <p class="article-card__date">
  //           <i class="ph ph-calendar-blank"></i> ${date}
  //         </p>
  //         <h3 class="article-card__title">${title}</h3>
  //         <p class="article-card__excerpt">${excerpt}</p>
  //         <a href="${post.permalink}" target="_blank" rel="noopener"
  //            class="article-card__link">
  //           Leia no Instagram <i class="ph ph-arrow-right"></i>
  //         </a>
  //       </div>
  //     `;
  //     grid.appendChild(card);
  //   });
  //
  //   container.appendChild(grid);
  // }
  //
  // function showLoading(container) {
  //   container.innerHTML = `
  //     <div style="text-align:center;padding:48px">
  //       <div class="spinner"></div>
  //       <p style="margin-top:16px;color:var(--color-text-light);font-size:0.875rem">
  //         Carregando publicações...
  //       </p>
  //     </div>`;
  // }
  //
  // function showFallback(container) {
  //   container.innerHTML = `
  //     <div class="instagram-placeholder">
  //       <span class="instagram-placeholder__icon">
  //         <i class="ph ph-instagram-logo"></i>
  //       </span>
  //       <p class="instagram-placeholder__title">Siga no Instagram</p>
  //       <p class="instagram-placeholder__desc">
  //         Acompanhe nossos conteúdos em
  //         <a href="https://www.instagram.com/institutosalutem.psiplural"
  //            target="_blank" rel="noopener">@institutosalutem.psiplural</a>
  //       </p>
  //     </div>`;
  // }
  //
  // // Iniciar quando DOM pronto
  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', loadInstagramFeed);
  // } else {
  //   loadInstagramFeed();
  // }

})();
