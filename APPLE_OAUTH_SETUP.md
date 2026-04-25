# Guía de Configuración - Apple OAuth en Supabase

## ¿Es fácil? Respuesta corta: **Moderadamente fácil, pero requiere más pasos que Google**

Apple OAuth es más complejo que Google porque requiere crear múltiples identificadores en el Apple Developer Console. Sin embargo, el proceso es directo si sigues los pasos correctamente.

**Tiempo estimado:** 20-30 minutos

---

## Requisitos Previos

1. **Cuenta de Apple Developer Program** ($99/año)
   - Necesaria para acceder a Apple Developer Console
   - Enlace: https://developer.apple.com/account/

2. **Acceso a Supabase Dashboard**
   - Tu proyecto de Supabase debe estar creado

---

## Paso 1: Obtener tu Team ID

1. Ve a https://developer.apple.com/account/
2. Inicia sesión con tu cuenta de Apple Developer
3. En la esquina superior derecha, verás tu **Team ID** (10 caracteres alfanuméricos)
4. **Guarda este valor**, lo necesitarás después

**Ejemplo:** `ABCD1234EF`

---

## Paso 2: Crear un App ID

1. En Apple Developer Console, ve a **Certificates, Identifiers & Profiles**
2. Selecciona **Identifiers** en el menú izquierdo
3. Haz clic en el botón **+** para crear un nuevo identificador
4. Selecciona **App IDs** y haz clic en **Continue**
5. Selecciona **App** como tipo y haz clic en **Continue**
6. Completa los campos:
   - **Description:** "FlowSights Ads" (o el nombre de tu app)
   - **Bundle ID:** Usa formato reverse domain, ej: `com.flowsights.ads`
7. En **Capabilities**, busca y marca **Sign in with Apple**
8. Haz clic en **Continue** y luego **Register**

**Guarda el Bundle ID**, lo necesitarás después.

---

## Paso 3: Crear un Services ID (Client ID)

Este es el identificador que usará Supabase para web.

1. En **Identifiers**, haz clic en **+** nuevamente
2. Selecciona **Services IDs** y haz clic en **Continue**
3. Completa los campos:
   - **Description:** "FlowSights Ads Web" (o similar)
   - **Identifier:** Usa formato reverse domain, ej: `com.flowsights.ads.web`
4. Marca **Sign in with Apple**
5. Haz clic en **Continue** y luego **Register**

**Este Services ID es tu Client ID para Supabase**

---

## Paso 4: Configurar Website URLs para el Services ID

1. Vuelve a **Identifiers** y selecciona el Services ID que acabas de crear
2. Haz clic en **Configure** en la sección "Sign in with Apple"
3. En **Website URLs**, agrega:
   - **Primary Domain:** `supabase.co` (o tu dominio personalizado)
   - **Return URLs:** `https://<tu-project-id>.supabase.co/auth/v1/callback`

**Ejemplo:**
```
Primary Domain: supabase.co
Return URL: https://abc123def456.supabase.co/auth/v1/callback
```

4. Haz clic en **Save**

---

## Paso 5: Crear una Signing Key

1. En Apple Developer Console, ve a **Keys** (en el menú izquierdo)
2. Haz clic en **+** para crear una nueva key
3. Dale un nombre descriptivo, ej: "FlowSights Ads Key"
4. Marca **Sign in with Apple**
5. Haz clic en **Configure** y selecciona el **App ID** que creaste en Paso 2
6. Haz clic en **Save** y luego **Continue**
7. Haz clic en **Register**
8. **IMPORTANTE:** Descarga el archivo `.p8` (AuthKey_XXXXXXXXXX.p8)
   - Guarda este archivo en un lugar seguro
   - **NO lo compartas nunca**
   - Si lo pierdes, deberás crear una nueva key

---

## Paso 6: Generar el Secret Key

Necesitas convertir el archivo `.p8` en un secret key que Supabase pueda usar.

### Opción A: Usar la herramienta de Supabase (Recomendado)

1. Ve a https://supabase.com/docs/guides/auth/social-login/auth-apple
2. Desplázate hasta encontrar la sección "Generate a new Apple client secret"
3. Completa los campos:
   - **Key ID:** Los últimos 10 caracteres del nombre del archivo (ej: `XXXXXXXXXX` de `AuthKey_XXXXXXXXXX.p8`)
   - **Team ID:** El Team ID que obtuviste en Paso 1
   - **Client ID:** El Services ID que creaste en Paso 3
   - **Certificate:** Copia el contenido completo del archivo `.p8` (abre con un editor de texto)
4. Haz clic en **Generate**
5. Copia el secret generado

**Nota:** Esta herramienta NO funciona en Safari. Usa Firefox o Chrome.

### Opción B: Generar manualmente (Avanzado)

Si la herramienta no funciona, puedes usar JWT.io o una librería JWT para generar el secret.

---

## Paso 7: Configurar en Supabase Dashboard

1. Ve a tu **Supabase Dashboard**
2. Selecciona tu proyecto
3. Ve a **Authentication → Providers**
4. Busca **Apple** y haz clic en **Enable**
5. Completa los campos:
   - **Enabled:** Toggle ON
   - **Client ID:** El Services ID de Paso 3 (ej: `com.flowsights.ads.web`)
   - **Secret:** El secret generado en Paso 6
6. Haz clic en **Save**

---

## Resumen de Credenciales Necesarias

| Credencial | Dónde obtenerla | Ejemplo |
|-----------|-----------------|---------|
| **Team ID** | Apple Developer Console (esquina superior derecha) | `ABCD1234EF` |
| **Client ID** | Services ID creado en Paso 3 | `com.flowsights.ads.web` |
| **Secret** | Generado en Paso 6 | `eyJhbGciOiJFUzI1NiIsImtpZCI6...` |

---

## Verificación

Una vez configurado, prueba el flujo:

1. Ve a tu aplicación en `/flowsight-ads`
2. Haz clic en el botón **Apple**
3. Deberías ser redirigido a Apple ID
4. Completa la autenticación
5. Deberías ser redirigido a `/flowsight-ads/dashboard`

---

## Troubleshooting

### Error: "Invalid redirect URL"
- Verifica que la URL de retorno en Apple Developer Console sea exacta
- Debe ser: `https://<project-id>.supabase.co/auth/v1/callback`
- Asegúrate de incluir `https://` (no `http://`)

### Error: "Invalid client ID"
- Verifica que el Services ID sea correcto
- Debe ser el identificador del Services ID, no el App ID

### Error: "Invalid secret"
- Regenera el secret usando la herramienta de Supabase
- Asegúrate de copiar todo el contenido del archivo `.p8`
- No uses Safari para generar el secret

### El botón de Apple no aparece
- Verifica que Apple esté habilitado en Supabase
- Recarga la página (Ctrl+F5 o Cmd+Shift+R)
- Verifica que no haya errores en la consola del navegador

---

## Comparación: Google vs Apple OAuth

| Aspecto | Google | Apple |
|--------|--------|-------|
| **Dificultad** | Muy fácil | Moderadamente fácil |
| **Pasos** | 3-4 | 7 |
| **Tiempo** | 5-10 min | 20-30 min |
| **Costo** | Gratis | $99/año (Apple Developer) |
| **Credenciales** | Client ID, Secret | Team ID, Client ID, Secret |
| **Renovación de keys** | No requerida | Cada 6 meses (Secret Key Rotation) |

---

## Notas Importantes

1. **Secret Key Rotation:** Apple requiere que rotes tu secret key cada 6 meses. Supabase te notificará cuando sea necesario.

2. **Revocación de Keys:** Si accidentalmente compartes tu archivo `.p8`, revócalo inmediatamente en Apple Developer Console.

3. **Múltiples Dominios:** Si tienes múltiples dominios (staging, producción), debes crear Services IDs separados para cada uno.

4. **Email Relay:** Apple puede ocultar el email del usuario. Supabase maneja esto automáticamente.

---

## Recursos Útiles

- **Apple Developer Console:** https://developer.apple.com/account/
- **Supabase Apple OAuth Docs:** https://supabase.com/docs/guides/auth/social-login/auth-apple
- **Apple Sign in with Apple:** https://developer.apple.com/sign-in-with-apple/
- **Supabase Secret Generator:** https://supabase.com/docs/guides/auth/social-login/auth-apple (busca "Generate a new Apple client secret")

---

## ¿Necesitas ayuda?

Si tienes problemas durante la configuración:

1. Verifica que todas las URLs sean exactas (sin espacios, mayúsculas/minúsculas correctas)
2. Asegúrate de usar un navegador basado en Chrome o Firefox (no Safari)
3. Revisa los logs de Supabase en el dashboard
4. Consulta la documentación oficial de Supabase y Apple
