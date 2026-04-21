# Instrucciones para Verificación de Google Search Console

Para que Google indexe tu sitio rápidamente, sigue estos pasos:

1. Ve a [Google Search Console](https://search-console.google.com/).
2. Añade una nueva propiedad de tipo **Prefijo de la URL** con `https://flowsights.it.com`.
3. Selecciona el método de verificación **Archivo HTML**.
4. Descarga el archivo que te proporciona Google (ejemplo: `google123456789.html`).
5. Sube ese archivo a la carpeta `public/` de este repositorio.
6. Haz un `git push` de los cambios.
7. Haz clic en **Verificar** en la consola de Google.

Una vez verificado, Google empezará a usar el `sitemap.xml` que ya configuré para indexar todos tus artículos.
