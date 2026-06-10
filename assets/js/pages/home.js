/* ═══════════════════════════════════════════════════════════════════
   HOME.JS — Studio Lanorma

   Script exclusivo de la página de inicio (index.html).

   FUNCIONES:
   1. Activa body.cursor-light sobre el footer CTA (fondo oscuro)
   2. Activa body.dark al llegar al About (modo oscuro scroll-driven)
   3. Nav hide/show basado en el fin del hero (no en 80px como otras páginas)
   4. Nav compact al pasar el hero (en pantallas grandes)

   ═══════════════════════════════════════════════════════════════════ */


/* ── CURSOR-LIGHT SOBRE EL FOOTER CTA ───────────────────────────────
   En la home el footer CTA tiene fondo oscuro (body.dark).
   Al pasar el ratón por encima, el cursor se vuelve blanco.
   ─────────────────────────────────────────────────────────────────── */

document.addEventListener('mousemove', function (e) {
  var overFooterCta = e.target.closest('.footer-cta__inner');
  document.body.classList.toggle('cursor-light', !!overFooterCta);
}, { passive: true });


/* ── MODO OSCURO — SCROLL-DRIVEN ─────────────────────────────────────
   Cuando el About llega al 80% del viewport, body.dark se activa.
   Esto da fondo oscuro a la sección About y al footer CTA.
   El scroll es escuchado a través de Lenis (window.lenis).
   ─────────────────────────────────────────────────────────────────── */

var aboutSection = document.getElementById('about');
if (aboutSection) {
  var isDark = false;

  window.lenis.on('scroll', function (data) {
    var rect    = aboutSection.getBoundingClientRect();
    var windowH = window.innerHeight;

    /* Activa el modo oscuro cuando el about entra en pantalla */
    var shouldBeDark = rect.top < windowH * 0.8;

    if (shouldBeDark !== isDark) {
      isDark = shouldBeDark;
      document.body.classList.toggle('dark', isDark);
    }
  });
}


/* ── NAV HIDE/SHOW — BASADO EN EL FIN DEL HERO ───────────────────────
   A diferencia de otras páginas (80px), el nav se oculta cuando
   el usuario ha scrolleado más de [altura del hero + 80px] píxeles.

   El nav-compact se activa cuando se pasa el final del hero,
   cambiando el padding lateral en pantallas grandes.
   ─────────────────────────────────────────────────────────────────── */

var nav = document.getElementById('nav');
var heroSection = document.querySelector('.hero');
var lastScrollY = 0, navVisible = true, ticking = false;

function getHeroEnd() {
  return heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 80;
}

function updateNavCompact(scroll) {
  nav.classList.toggle('nav-compact', scroll > getHeroEnd() - 1);
}

/* Inicializa el estado del nav-compact en el scroll actual */
updateNavCompact(window.scrollY || 0);

/* Actualiza nav-compact si se redimensiona la ventana */
window.addEventListener('resize', function () {
  updateNavCompact(window.scrollY || 0);
}, { passive: true });

window.lenis.on('scroll', function (data) {
  var scroll = data.scroll;
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(function () {
    var menu = document.getElementById('mobile-menu');

    /* Si el menú está abierto, mantén el nav visible */
    if (menu && menu.classList.contains('open')) {
      nav.classList.remove('nav-hidden');
      navVisible = true;
      lastScrollY = scroll;
      ticking = false;
      return;
    }

    var heroEnd = getHeroEnd();
    updateNavCompact(scroll);

    var delta = scroll - lastScrollY;

    /* Oculta el nav cuando el usuario ha pasado el hero y baja */
    if (scroll > heroEnd + 80 && delta > 6 && navVisible) {
      nav.classList.add('nav-hidden');
      navVisible = false;
    }
    /* Vuelve a mostrar el nav cuando el usuario sube o está al principio */
    else if ((delta < -6 || scroll <= 80) && !navVisible) {
      nav.classList.remove('nav-hidden');
      navVisible = true;
    }

    lastScrollY = scroll;
    ticking = false;
  });
});
