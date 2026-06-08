(function () {

  // ─────────────────────────────────────────────────────────────────────────
  // CONSTANTES Y ESTADO
  // ─────────────────────────────────────────────────────────────────────────

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionKey  = 'lanorma-page-transition';
  const colorKey       = 'lanorma-page-transition-color';
  const colorIndexKey  = 'lanorma-page-transition-color-index';
  const exitDuration   = 520; // duración de la animación de reveal (entrada)
  const exitHold       = 140; // pausa antes de iniciar el reveal
  const colors = ['#FFE44B', '#A3A9FF', '#C31351', '#F98FF1', '#333DEC', '#FF311F'];

  let isTransitioning = false;

  // ─────────────────────────────────────────────────────────────────────────
  // OVERLAY (div para la animación de salida)
  // ─────────────────────────────────────────────────────────────────────────

  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function setTransitionColor(color) {
    overlay.style.setProperty('--page-transition-color', color);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COLOR ROTATIVO
  // ─────────────────────────────────────────────────────────────────────────

  function getNextTransitionColor() {
    const raw   = Number(sessionStorage.getItem(colorIndexKey) || 0);
    const index = Number.isFinite(raw) ? raw : 0;
    const color = colors[index % colors.length];
    sessionStorage.setItem(colorIndexKey, String((index + 1) % colors.length));
    sessionStorage.setItem(colorKey, color);
    return color;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ENTRADA — gestión del cover (html::before) en la página nueva
  // ─────────────────────────────────────────────────────────────────────────

  function clearPendingCover() {
    document.documentElement.classList.add('page-transition-no-bg-transition');
    document.documentElement.classList.remove('page-transition-pending', 'page-transition-revealing');
    document.documentElement.style.removeProperty('--page-transition-color');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('page-transition-no-bg-transition');
      });
    });
  }

  function revealPendingCover() {
    let done = false;
    let fallback;

    function finish(event) {
      if (event && event.animationName !== 'pageTransitionOut') return;
      if (done) return;
      done = true;
      window.clearTimeout(fallback);
      document.documentElement.removeEventListener('animationend', finish);
      clearPendingCover();
    }

    document.documentElement.addEventListener('animationend', finish);
    fallback = window.setTimeout(function () { finish(null); }, exitDuration + 120);

    requestAnimationFrame(function () {
      document.documentElement.classList.add('page-transition-revealing');
    });
  }

  function afterPageSettles(callback) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        window.setTimeout(callback, exitHold);
      });
    });
  }

  if (!prefersReducedMotion && sessionStorage.getItem(transitionKey) === 'active') {
    setTransitionColor(sessionStorage.getItem(colorKey) || colors[0]);
    sessionStorage.removeItem(transitionKey);
    sessionStorage.removeItem(colorKey);
    afterPageSettles(revealPendingCover);
  } else {
    clearPendingCover();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SALIDA — click → overlay visible → navegar
  // ─────────────────────────────────────────────────────────────────────────

  function isInternalPageLink(link) {
    if (!link || !link.href) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
    const nextPath    = url.pathname.replace(/\/index\.html$/, '/');
    if (currentPath === nextPath && url.hash) return false;
    return true;
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!isInternalPageLink(link) || prefersReducedMotion || isTransitioning) return;

    event.preventDefault();
    isTransitioning = true;
    const targetHref = link.href;

    setTransitionColor(getNextTransitionColor());
    sessionStorage.setItem(transitionKey, 'active');
    overlay.classList.remove('is-leaving');
    overlay.classList.add('is-active');

    // Navegar cuando la animación de salida termina completamente.
    // Fallback a 540ms por si animationend no llega.
    let navigated = false;

    function onExitEnd(event) {
      if (event.animationName !== 'pageTransitionIn') return;
      if (navigated) return;
      navigated = true;
      overlay.removeEventListener('animationend', onExitEnd);
      window.location.href = targetHref;
    }

    overlay.addEventListener('animationend', onExitEnd);

    window.setTimeout(function () {
      if (navigated) return;
      navigated = true;
      overlay.removeEventListener('animationend', onExitEnd);
      window.location.href = targetHref;
    }, 420 + 120);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PREFETCH — cargar la página destino en segundo plano al pasar el cursor
  // ─────────────────────────────────────────────────────────────────────────

  function prefetchLink(link) {
    if (!isInternalPageLink(link)) return;
    const href = link.href;
    if (document.querySelector('link[rel="prefetch"][href="' + href + '"]')) return;
    const el = document.createElement('link');
    el.rel  = 'prefetch';
    el.href = href;
    document.head.appendChild(el);
  }

  document.addEventListener('mouseover',  function (e) { prefetchLink(e.target.closest('a')); }, { passive: true });
  document.addEventListener('touchstart', function (e) { prefetchLink(e.target.closest('a')); }, { passive: true });

  // ─────────────────────────────────────────────────────────────────────────
  // BFCACHE — restaurar estado si el navegador recupera la página del historial
  // ─────────────────────────────────────────────────────────────────────────

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      isTransitioning = false;
      overlay.classList.remove('is-active', 'is-leaving');
      clearPendingCover();
      sessionStorage.removeItem(transitionKey);
      sessionStorage.removeItem(colorKey);
    }
  });

})();
