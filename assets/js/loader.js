/* ═══════════════════════════════════════════════════════════════════
   LOADER.JS — Studio Lanorma

   Animación del loader de la página de inicio.
   Solo se muestra UNA VEZ por sesión (controlado con sessionStorage).

   ¿CÓMO FUNCIONA?
   1. Primera visita: body.loader-running oculta el contenido,
      el loader anima 3 imágenes aleatorias mientras cuenta 0%→100%.
   2. Visitas siguientes: el loader se elimina inmediatamente y
      se añade body.no-loader-anim para usar delays cortos de nav.

   SOLO SE USA EN: index.html (home)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  var loader    = document.getElementById('loader');
  var percentEl = document.getElementById('loader-percent');
  var imgWrap   = document.getElementById('loader-img-wrap');
  var imgEl     = document.getElementById('loader-img-el');

  /* ── Imágenes disponibles (coge 3 aleatorias) ─────────────────── */
  var allImgs = [
    '/assets/img/home-1.webp',
    '/assets/img/goodsmatcha.webp',
    '/assets/img/saifai.webp',
    '/assets/img/home-4.webp',
    '/assets/img/home-5.webp',
    '/assets/img/home-7.webp',
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  var loaderImgs = shuffle(allImgs).slice(0, 3);

  /* ── Muestra el contenido de la página ───────────────────────── */
  function revealContent() {
    document.body.classList.remove('loader-running');
    var hero = document.querySelector('.hero');
    if (hero) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hero.classList.add('animate');
        });
      });
    }
  }

  /* ── Una sola vez por sesión ─────────────────────────────────── */
  if (sessionStorage.getItem('loaderShown')) {
    document.body.classList.add('no-loader-anim');
    loader.remove();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', revealContent, { once: true });
    } else {
      revealContent();
    }
    return;
  }

  /* ── Primera visita: oculta el contenido durante la animación ── */
  document.body.classList.add('loader-running');

  /* ── Easing cúbico para las animaciones del loader ───────────── */
  function cubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* ── Animación de interpolación (de → a, duración en ms) ─────── */
  function tween(from, to, dur, fn) {
    return new Promise(function (resolve) {
      var t0 = performance.now();
      function frame(now) {
        var raw = Math.min((now - t0) / dur, 1);
        fn(from + (to - from) * cubic(raw));
        if (raw < 1) requestAnimationFrame(frame);
        else { fn(to); resolve(); }
      }
      requestAnimationFrame(frame);
    });
  }

  function delay(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  /* Funciones de ayuda para animar el clip-path */
  function setClipImg(v)    { imgWrap.style.clipPath = 'inset(' + v + '% 0 0 0)'; }
  function setClipImgOut(v) { imgWrap.style.clipPath = 'inset(0 0 ' + v + '% 0)'; }
  function setClipPct(v)    { percentEl.style.clipPath = 'inset(' + v + '% 0 0 0)'; }
  function updatePct(v)     { percentEl.textContent = Math.round(v) + '%'; }
  function setImg(src)      { imgEl.src = src; }

  /* ── Secuencia principal del loader ─────────────────────────── */
  async function runLoader() {
    /* Imagen 1 entra con efecto cortina */
    setImg(loaderImgs[0]);
    tween(100, 0, 600, setClipPct);       /* porcentaje aparece al mismo tiempo */
    await tween(100, 0, 750, setClipImg);
    await tween(0, 33, 600, updatePct);

    await delay(280);

    /* Imagen 2 — aparece directamente */
    setImg(loaderImgs[1]);
    await tween(33, 66, 600, updatePct);

    await delay(280);

    /* Imagen 3 — aparece directamente */
    setImg(loaderImgs[2]);
    await tween(66, 100, 600, updatePct);

    await delay(350);

    /* Imagen 3 sale con cortina hacia arriba */
    await tween(0, 100, 750, setClipImgOut);

    await delay(180);

    /* Loader entero sale como persiana */
    sessionStorage.setItem('loaderShown', '1');
    await tween(0, 100, 850, function (v) {
      loader.style.clipPath = 'inset(0 0 ' + v + '% 0)';
    });

    loader.remove();
    revealContent();
  }

  /* Fallback de seguridad: si el loader no termina en 6s, lo elimina */
  var safetyTimer = setTimeout(function () {
    loader.remove();
    revealContent();
  }, 6000);

  runLoader().then(function () { clearTimeout(safetyTimer); });
})();
