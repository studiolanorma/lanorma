#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# VERSION-ASSETS.SH — Studio Lanorma
#
# Cache-busting para CSS/JS. assets/css/*.css y assets/js/*.js se
# sirven con Cache-Control: immutable durante 1 año (ver _headers),
# así que cambiar el contenido de un archivo no basta: el navegador
# de quien ya visitó el sitio nunca vuelve a pedirlo.
#
# Este script calcula un hash del contenido de cada .css/.js y
# reescribe los <link>/<script> de todos los .html para que apunten
# a "archivo.css?v=HASH". Si el contenido no cambió, el hash no
# cambia y no se toca nada. Si cambió, la URL cambia → el navegador
# la trata como un recurso nuevo y lo descarga sin necesidad de
# purgar caché en Cloudflare.
#
# CUÁNDO EJECUTARLO: antes de cada "git push" que incluya cambios en
# assets/css/ o assets/js/. Es seguro ejecutarlo siempre — si nada
# cambió, no genera diffs.
#
# USO: ./scripts/version-assets.sh
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Buscando archivos .css y .js en assets/…"

changed_count=0

while IFS= read -r asset; do
  # Ruta tal como aparece en el HTML: /assets/css/foo.css
  url_path="/${asset}"

  # Hash corto (8 chars) del contenido actual
  hash=$(shasum -a 256 "$asset" | cut -c1-8)

  # Reescribe href="/assets/.../foo.css" o href="/assets/.../foo.css?v=xxxx"
  # → href="/assets/.../foo.css?v=HASH" en todos los .html del proyecto.
  # ASSET_PATH/ASSET_HASH van por entorno para no depender de escapar la
  # ruta a mano; \Q...\E hace que Perl trate ASSET_PATH como texto literal.
  found=$(grep -rl -F -- "${url_path}" --include="*.html" . 2>/dev/null || true)

  if [ -n "$found" ]; then
    while IFS= read -r html_file; do
      before=$(shasum "$html_file")
      ASSET_PATH="$url_path" ASSET_HASH="$hash" perl -pi -e '
        s/\Q$ENV{ASSET_PATH}\E(\?v=[a-f0-9]{8})?(?=["'"'"'])/$ENV{ASSET_PATH}."?v=".$ENV{ASSET_HASH}/ge;
      ' "$html_file"
      after=$(shasum "$html_file")
      if [ "$before" != "$after" ]; then
        changed_count=$((changed_count + 1))
      fi
    done <<< "$found"
  fi
done < <(find assets -type f \( -name "*.css" -o -name "*.js" \) | sort)

echo "Listo. $changed_count referencias actualizadas en archivos .html."
