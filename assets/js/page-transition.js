(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionKey = 'lanorma-page-transition';
  const colorKey = 'lanorma-page-transition-color';
  const colorIndexKey = 'lanorma-page-transition-color-index';
  const duration = 420;
  const exitDuration = 520;
  const colors = [
    '#FFE44B',
    '#A3A9FF',
    '#C31351',
    '#F98FF1',
    '#333DEC',
    '#FF311F'
  ];
  let isTransitioning = false;

  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function setTransitionColor(color) {
    overlay.style.setProperty('--page-transition-color', color);
  }

  function clearPendingCover() {
    document.documentElement.classList.remove('page-transition-pending', 'page-transition-revealing');
    document.documentElement.style.removeProperty('--page-transition-color');
    document.getElementById('page-transition-pending-style')?.remove();
  }

  function revealPendingCover() {
    let revealDone = false;
    let fallbackTimer;

    const finishReveal = function () {
      if (revealDone) return;
      revealDone = true;
      window.clearTimeout(fallbackTimer);
      clearPendingCover();
    };

    document.documentElement.addEventListener('animationend', finishReveal, { once: true });
    fallbackTimer = window.setTimeout(finishReveal, exitDuration + 120);
    requestAnimationFrame(function () {
      document.documentElement.classList.add('page-transition-revealing');
    });
  }

  function afterPageSettles(callback) {
    const run = function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(callback);
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      run();
    }
  }

  function getNextTransitionColor() {
    const currentIndex = Number(sessionStorage.getItem(colorIndexKey) || 0);
    const safeIndex = Number.isFinite(currentIndex) ? currentIndex : 0;
    const color = colors[safeIndex % colors.length];
    sessionStorage.setItem(colorIndexKey, String((safeIndex + 1) % colors.length));
    sessionStorage.setItem(colorKey, color);
    return color;
  }

  if (!prefersReducedMotion && sessionStorage.getItem(transitionKey) === 'active') {
    setTransitionColor(sessionStorage.getItem(colorKey) || colors[0]);
    sessionStorage.removeItem(transitionKey);
    sessionStorage.removeItem(colorKey);

    afterPageSettles(revealPendingCover);
  } else {
    clearPendingCover();
  }

  function isInternalPageLink(link) {
    if (!link || !link.href) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
    const nextPath = url.pathname.replace(/\/index\.html$/, '/');
    if (currentPath === nextPath && url.hash) return false;

    return true;
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!isInternalPageLink(link) || prefersReducedMotion || isTransitioning) return;

    event.preventDefault();
    isTransitioning = true;
    setTransitionColor(getNextTransitionColor());
    sessionStorage.setItem(transitionKey, 'active');
    overlay.classList.remove('is-leaving');
    overlay.classList.add('is-active');

    let navigationStarted = false;
    let fallbackTimer;
    const goToNextPage = function () {
      if (navigationStarted) return;
      navigationStarted = true;
      window.clearTimeout(fallbackTimer);
      window.location.href = link.href;
    };

    overlay.addEventListener('animationend', goToNextPage, { once: true });
    fallbackTimer = window.setTimeout(goToNextPage, duration + 120);
  });

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
