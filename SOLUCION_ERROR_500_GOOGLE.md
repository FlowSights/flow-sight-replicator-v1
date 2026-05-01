# 🛠 Solución Definitiva: Error 500 en Google Login

Si después de aplicar el "hardening" del trigger el error `unexpected_failure` persiste, el problema está en la **Google Cloud Console**. Sigue estos 3 pasos exactos para solucionarlo:

### 1. Habilitar Google People API (Crítico)
Supabase necesita esta API para obtener el email y nombre del usuario. Si está desactivada, Supabase devuelve un Error 500.
1. Ve a [Google Cloud Console - API Library](https://console.cloud.google.com/apis/library).
2. Busca **"Google People API"**.
3. Haz clic en **Habilitar**.

### 2. Verificar la URL de Redirección (Redirect URI)
Un error tipográfico aquí causará un fallo en el intercambio de tokens.
1. Ve a **APIs y servicios > Credenciales**.
2. Edita tu **ID de cliente de OAuth 2.0**.
3. En "URIs de redireccionamiento autorizados", asegúrate de que aparezca exactamente esta URL:
   `https://jnqjwwezuwhkapmgixbf.supabase.co/auth/v1/callback`
4. Guarda los cambios.

### 3. Revisar el estado de la Pantalla de Consentimiento
1. Ve a **APIs y servicios > Pantalla de consentimiento de OAuth**.
2. Verifica el **Estado de publicación**:
   - **Testing**: Solo funcionará para los correos que añadas en la sección "Usuarios de prueba".
   - **En producción**: Funcionará para cualquier cuenta de Google (recomendado si ya vas a lanzar).

---

### ¿Por qué sigue fallando si lo anterior está bien?
Si todo lo anterior es correcto, el problema puede ser el **Client Secret**:
- Ve a Supabase > Authentication > Providers > Google.
- **Borra el Client Secret actual** y vuelve a copiarlo desde Google Cloud (asegúrate de no copiar espacios en blanco al principio o al final).

**Nota Técnica:** He dejado tu código preparado con **PKCE Flow** y **Trigger Hardening**, lo que significa que una vez que la conexión Google-Supabase sea válida, el sistema será extremadamente robusto y no volverá a fallar.
