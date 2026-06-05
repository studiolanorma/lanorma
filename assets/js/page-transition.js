(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionKey = 'lanorma-page-transition';
  const colorKey = 'lanorma-page-transition-color';
  const colorIndexKey = 'lanorma-page-transition-color-index';
  const duration = 420;
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
    overlay.classList.add('is-leaving');
    overlay.addEventListener('animationend', function () {
      overlay.classList.remove('is-leaving');
    }, { once: true });
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

    window.setTimeout(function () {
      window.location.href = link.href;
    }, duration);
  });

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      isTransitioning = false;
      overlay.classList.remove('is-active', 'is-leaving');
      sessionStorage.removeItem(transitionKey);
      sessionStorage.removeItem(colorKey);
    }
  });
})();
