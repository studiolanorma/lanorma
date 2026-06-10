/* ═══════════════════════════════════════════════════════════════════
   CONTACTO.JS — Studio Lanorma

   Script exclusivo de la página de contacto.

   FUNCIONES:
   1. Envío del formulario vía Formspree (async, sin recarga)
   2. Nav hide/show estándar (umbral 80px)

   El cursor, Lenis, logo y menú móvil están en navbar.js.
   ═══════════════════════════════════════════════════════════════════ */


/* ── NAV HIDE/SHOW ────────────────────────────────────────────────── */

window.navSetupHideShow(80);


/* ── FORMULARIO DE CONTACTO (FORMSPREE) ──────────────────────────────
   El formulario envía los datos a Formspree sin recargar la página.

   Flujo:
   1. El usuario hace submit → el botón cambia a "Enviando…"
   2. Si la respuesta es OK → se oculta el botón y aparece el mensaje
      de éxito (.form-success), el formulario se limpia
   3. Si hay error → el botón vuelve a activo con mensaje de error
   ─────────────────────────────────────────────────────────────────── */

var form    = document.getElementById('contact-form');
var btn     = document.getElementById('form-btn');
var success = document.getElementById('form-success');

if (form && btn && success) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    var data = new FormData(form);
    var res;

    try {
      res = await fetch('https://formspree.io/f/xnjoawyn', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
    } catch (err) {
      btn.textContent = 'Error al enviar. Inténtalo de nuevo.';
      btn.disabled = false;
      return;
    }

    if (res.ok) {
      btn.style.display    = 'none';
      success.style.display = 'block';
      form.reset();
    } else {
      btn.textContent = 'Error al enviar. Inténtalo de nuevo.';
      btn.disabled = false;
    }
  });
}
