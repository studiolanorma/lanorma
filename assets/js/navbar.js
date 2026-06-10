/* ═══════════════════════════════════════════════════════════════════
   NAVBAR.JS — Studio Lanorma

   Funcionalidad compartida por TODAS las páginas:
   - Inicialización de Lenis (scroll suave)
   - Cursor personalizado (posición + hover ring)
   - Animación del logo al hacer hover
   - Marcado de los links del nav como "listos" (.done)
   - Menú hamburguesa (panel deslizante)
   - navSetupHideShow(threshold, withCompact): utilidad para que
     cada página configure su propio ocultar/mostrar del nav.
     La home tiene su propio listener en pages/home.js.
   ═══════════════════════════════════════════════════════════════════ */


/* ── LENIS (SCROLL SUAVE) ────────────────────────────────────────────
   Se guarda en window.lenis para que los archivos de página puedan
   acceder a él (ej: home.js para escuchar el scroll y activar dark mode).
   ─────────────────────────────────────────────────────────────────── */

window.lenis = new Lenis({
  duration: 1.05,
  easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
});

/* lenis-ready: flag CSS para el fallback de scroll suave (usado en nosotros) */
document.documentElement.classList.add('lenis-ready');

(function rafLoop(time) {
  window.lenis.raf(time);
  requestAnimationFrame(rafLoop);
})(0);


/* ── CURSOR PERSONALIZADO ────────────────────────────────────────────
   El cursor está formado por dos elementos: un punto central (.cursor-dot)
   y un anillo exterior (.cursor-ring) que aparece sobre elementos interactivos.

   La posición se interpola suavemente con lerp (factor 0.18) para que
   el movimiento tenga inercia y se vea fluido.
   ─────────────────────────────────────────────────────────────────── */

var cursorEl = document.getElementById('cursor');
var _mouseX = 0, _mouseY = 0, _curX = 0, _curY = 0;

document.addEventListener('mousemove', function (e) {
  _mouseX = e.clientX;
  _mouseY = e.clientY;

  /* El anillo aparece sobre elementos interactivos (cubren todas las páginas) */
  var overHover =
    e.target.closest('nav .links a')        ||
    e.target.closest('nav .logo')           ||
    e.target.closest('.img-wrap')           ||
    e.target.closest('.card-info')          ||
    e.target.closest('.insight-card')       ||
    e.target.closest('.footer-cta__button') ||
    e.target.closest('.footer-bottom a')    ||
    e.target.closest('.service-item')       ||
    e.target.closest('.gallery-img')        ||
    e.target.closest('.hero-more')          ||
    e.target.closest('.btn-mobile')         ||
    e.target.closest('.about-contact a')    ||
    e.target.closest('.contact-links a')    ||
    e.target.closest('.project-nav-link')   ||
    e.target.closest('.form-submit')        ||
    e.target.closest('.hamburger');

  document.body.classList.toggle('cursor-hover', !!overHover);
}, { passive: true });

(function animateCursor() {
  _curX += (_mouseX - _curX) * 0.18;
  _curY += (_mouseY - _curY) * 0.18;
  if (cursorEl) {
    cursorEl.style.transform = 'translate3d(' + _curX + 'px, ' + _curY + 'px, 0)';
  }
  requestAnimationFrame(animateCursor);
})();


/* ── ANIMACIÓN DEL LOGO ──────────────────────────────────────────────
   Al hacer hover, el nombre "Lanorma" se colapsa y queda solo la N
   más el paréntesis derecho que se desplaza hacia la izquierda.
   ─────────────────────────────────────────────────────────────────── */

var logoEl = document.getElementById('logo-animated');
if (logoEl) {
  var logoParenR = logoEl.querySelector('.logo-paren-right');
  var logoN      = logoEl.querySelector('.logo-n');
  var logoText   = logoEl.querySelector('.logo-text');

  logoEl.addEventListener('mouseenter', function () {
    logoParenR.style.transform = 'translateX(-38px)';
    logoN.style.transform      = 'translateX(-6px)';
    logoText.style.clipPath    = 'inset(0 87% 0 0)';
    logoText.style.transition  = 'clip-path 0.20s cubic-bezier(0.65, 0, 0.35, 0)';
  });

  logoEl.addEventListener('mouseleave', function () {
    logoParenR.style.transform = 'translateX(0)';
    logoN.style.transform      = 'translateX(0)';
    logoText.style.clipPath    = 'inset(0 0 0 0)';
    logoText.style.transition  = 'clip-path 0.40s cubic-bezier(0.65, 0, 0.35, 0)';
  });
}


/* ── LINKS DEL NAV — CLASE .done ─────────────────────────────────────
   Los links del nav tienen una animación de entrada CSS.
   Cuando termina, se añade .done para desactivar la animación
   y activar el hover normal.

   En la home con loader, el delay es más largo (2900ms) para que
   la animación no se superponga con el loader.
   En visitas siguientes (body.no-loader-anim), el delay es 1000ms.
   ─────────────────────────────────────────────────────────────────── */

var navLinks = document.querySelectorAll('nav .links a');
var navDoneDelay = document.body.classList.contains('no-loader-anim') ? 1000 : 2900;

setTimeout(function () {
  navLinks.forEach(function (a) {
    a.style.animation = 'none';
    a.style.transform = '';
    a.classList.add('done');
  });
}, navDoneDelay);


/* ── MENÚ HAMBURGUESA ────────────────────────────────────────────────
   Panel deslizante desde la derecha en móvil.

   El IIFE clona y reemplaza los elementos hamburguesa y menú
   para eliminar cualquier listener anterior que pudiera haberse
   añadido antes de que este script se ejecute.

   Comportamiento:
   - Click en hamburguesa → abre/cierra el panel
   - Click fuera del panel → cierra
   - Escape → cierra
   - Click en cualquier link del menú → cierra
   - Resize a >768px con menú abierto → cierra
   ─────────────────────────────────────────────────────────────────── */

(function () {
  var nav         = document.getElementById('nav');
  var hamburger   = document.getElementById('hamburger');
  var mobileMenu  = document.getElementById('mobile-menu');
  if (!nav || !hamburger || !mobileMenu) return;

  /* Clonar y reemplazar para eliminar listeners previos */
  var cleanHamburger = hamburger.cloneNode(true);
  hamburger.replaceWith(cleanHamburger);
  var cleanMobileMenu = mobileMenu.cloneNode(true);
  mobileMenu.replaceWith(cleanMobileMenu);

  var button = document.getElementById('hamburger');
  var menu   = document.getElementById('mobile-menu');
  var panel  = menu.querySelector('.mobile-menu-panel');
  var menuIsDark = panel && panel.dataset.darkDefault === 'true';
  var root   = document.documentElement;

  function stopSmoothScroll() {
    if (window.lenis && typeof window.lenis.stop === 'function') window.lenis.stop();
  }

  function startSmoothScroll() {
    if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
  }

  function openMenu() {
    button.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Cerrar menú');
    menu.classList.add('open');
    document.body.classList.add('menu-open');
    root.classList.add('menu-open');
    document.body.dataset.menuDark = menuIsDark ? 'true' : 'false';
    nav.classList.remove('nav-hidden');
    document.body.classList.remove('nav-is-hidden');
    stopSmoothScroll();
  }

  function closeMenu() {
    button.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    root.classList.remove('menu-open');
    delete document.body.dataset.menuDark;
    startSmoothScroll();
  }

  button.addEventListener('click', function () {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  menu.addEventListener('click', function (event) {
    if (!panel.contains(event.target)) closeMenu();
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  /* Previene scroll en el fondo mientras el menú está abierto */
  ['wheel', 'touchmove'].forEach(function (eventName) {
    menu.addEventListener(eventName, function (event) {
      if (document.body.classList.contains('menu-open')) event.preventDefault();
    }, { passive: false });
  });

  /* Cierra el menú si se amplía la ventana a modo desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && menu.classList.contains('open')) closeMenu();
  });
})();


/* ── NAV HIDE/SHOW ───────────────────────────────────────────────────
   Cada página gestiona su propio ocultar/mostrar del nav.
   Esta función de utilidad se define aquí para que cualquier script
   inline de página pueda llamarla sin duplicar código.

   Uso desde un script inline de página:
     navSetupHideShow(80);           // umbral estándar
     navSetupHideShow(160, true);    // umbral 160px + nav-compact
   ─────────────────────────────────────────────────────────────────── */

window.navSetupHideShow = function (threshold, withCompact) {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var lastScrollY = 0, navVisible = true, ticking = false;

  window.lenis.on('scroll', function (data) {
    var scroll = data.scroll;
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      var menu = document.getElementById('mobile-menu');
      if (menu && menu.classList.contains('open')) {
        nav.classList.remove('nav-hidden');
        navVisible = true;
        lastScrollY = scroll;
        ticking = false;
        return;
      }

      if (withCompact) nav.classList.toggle('nav-compact', scroll > 80);

      var delta = scroll - lastScrollY;
      if (scroll > threshold && delta > 6 && navVisible) {
        nav.classList.add('nav-hidden');
        navVisible = false;
      } else if ((delta < -6 || scroll <= 80) && !navVisible) {
        nav.classList.remove('nav-hidden');
        navVisible = true;
      }

      lastScrollY = scroll;
      ticking = false;
    });
  });
};
