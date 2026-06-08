(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var STAGGER       = 80;   // ms entre elementos dentro de un grupo
  var ANIM_DURATION = 500;  // duración del fade (no-media); determina cuándo "acaba" un grupo
  var GROUP_BREATHE = 80;   // pausa adicional tras que termina el último elemento del grupo
  var INITIAL_DELAY = 120;  // solo en carga directa (recarga / primera visita)
  var initialized   = false;

  // classify() corre en cuanto carga el script — mientras los elementos están
  // ocultos bajo el cover. Así el transform ya está en su estado final
  // (scale 0.97) cuando llegan los reveals, sin transición de transform espuria.
  Array.from(document.querySelectorAll('.reveal')).forEach(function (el) {
    if (
      el.matches('.img-wrap, .studio-photo, .gallery-sticky-wrap') ||
      el.querySelector('.img-wrap, img, video')
    ) {
      el.classList.add('reveal--media');
    }
  });

  function show(el, delay) {
    setTimeout(function () { el.classList.add('visible'); }, delay || 0);
  }

  function sortKey(entry) {
    var d = entry.target.dataset.revealDelay;
    if (d === undefined) d = entry.target.dataset.delay;
    if (d !== undefined && d !== '') return parseInt(d, 10);
    return entry.boundingClientRect.top;
  }

  function getIndex(el, i) {
    var raw = el.dataset.delay !== undefined ? el.dataset.delay : el.dataset.revealDelay;
    return (raw !== undefined && raw !== '') ? parseInt(raw, 10) : i;
  }

  function init(initialDelay) {
    if (initialized) return;
    initialized = true;

    var all = Array.from(document.querySelectorAll('.reveal'));
    if (!all.length) return;

    var aboveFold = [], belowFold = [], vh = window.innerHeight;

    all.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) {
        aboveFold.push(el);
      } else {
        belowFold.push(el);
      }
    });

    // ── Above-fold: grupos por data-reveal-group ─────────────────────────────

    var groups = {};
    var groupOrder = [];

    aboveFold.forEach(function (el) {
      var g = el.dataset.revealGroup || '__default__';
      if (!groups[g]) { groups[g] = []; groupOrder.push(g); }
      groups[g].push(el);
    });

    var baseDelay = initialDelay;

    groupOrder.forEach(function (groupName) {
      var els = groups[groupName];
      var maxIndex = 0;

      els.forEach(function (el, i) {
        var idx = getIndex(el, i);
        if (idx > maxIndex) maxIndex = idx;
        show(el, baseDelay + idx * STAGGER);
      });

      // El siguiente grupo empieza cuando termina la animación del último elemento
      // de este grupo (maxIndex * STAGGER + ANIM_DURATION) más un respiro visual.
      baseDelay += maxIndex * STAGGER + ANIM_DURATION + GROUP_BREATHE;
    });

    // ── Below-fold: IntersectionObserver ─────────────────────────────────────
    if (!belowFold.length) return;

    var observer = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      if (!batch.length) return;
      batch.sort(function (a, b) { return sortKey(a) - sortKey(b); });
      batch.forEach(function (entry, i) {
        observer.unobserve(entry.target);
        show(entry.target, i * STAGGER);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -48px 0px' });

    belowFold.forEach(function (el) { observer.observe(el); });
  }

  function start(initialDelay) {
    requestAnimationFrame(function () { init(initialDelay); });
  }

  if (document.documentElement.classList.contains('page-transition-pending')) {
    // Ruta de navegación: initialDelay=0 para que los reveals arranquen
    // justo cuando desaparece el cover, sin gap visible.
    var mo = new MutationObserver(function () {
      if (!document.documentElement.classList.contains('page-transition-pending')) {
        mo.disconnect();
        start(0);
      }
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  } else {
    // Ruta directa (recarga / primera visita): INITIAL_DELAY da margen para
    // que el browser pinte opacity:0 antes de arrancar la transición.
    start(INITIAL_DELAY);
  }
})();
