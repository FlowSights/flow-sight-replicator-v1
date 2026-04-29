# Guía de Prueba y Validación - FlowSights Ads Restoration

## Descripción General

Este documento proporciona instrucciones paso a paso para probar y validar todos los cambios realizados en la herramienta de ads de FlowSights.

---

## Parte 1: Preparación del Entorno

### 1.1 Verificar la compilación
```bash
cd /home/ubuntu/flowsights
npm run build
```
**Resultado esperado:** Compilación exitosa sin errores (✓ built in X.XXs)

### 1.2 Iniciar el servidor de desarrollo
```bash
npm run dev
```
**Resultado esperado:** Servidor iniciado en `http://localhost:5173`

### 1.3 Acceder a la aplicación
- Abre tu navegador en `http://localhost:5173/flowsight-ads/dashboard`
- Inicia sesión con tu cuenta de usuario

---

## Parte 2: Pruebas de Flujo de Generación

### 2.1 Generar una campaña
1. Completa todos los pasos del formulario:
   - **Paso 1:** Selecciona un negocio (ej: "Restaurante Gourmet")
   - **Paso 2:** Ingresa detalles del negocio
   - **Paso 3:** Selecciona ubicación y audiencia
   - **Paso 4:** Sube una imagen para el anuncio
   - **Paso 5:** Ajusta el presupuesto ($100-$5000)
2. Haz clic en "Generar Campaña Premium"
3. Espera a que se generen los anuncios (verás mensajes de carga)

**Resultado esperado:** Se generan 4 anuncios (uno por plataforma: Meta, Google, TikTok, LinkedIn)

---

## Parte 3: Validar el Componente AdsResultsShowcase

### 3.1 Verificar que aparece el componente
Después de generar la campaña, deberías ver:
- **Título:** "Tus anuncios están listos"
- **Selector de plataformas:** 4 botones (Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads)
- **Mockup principal:** Vista previa del anuncio en la plataforma seleccionada

### 3.2 Probar el selector de plataformas
1. Haz clic en cada botón de plataforma
2. Verifica que:
   - El mockup cambia según la plataforma seleccionada
   - El color del botón seleccionado cambia
   - La información del anuncio se actualiza

### 3.3 Probar la navegación entre anuncios
Si hay múltiples anuncios por plataforma:
1. Verifica que aparecen flechas de navegación (< >)
2. Haz clic en las flechas para cambiar entre anuncios
3. Verifica que el contador muestra "X de Y"

### 3.4 Verificar información del anuncio
Debajo del mockup deberías ver:
- **Badge de tipo:** OFERTA, EMOCIONAL o URGENCIA (con color diferente)
- **Puntuación:** Número /100 en color verde
- **Razonamiento:** Texto explicativo del por qué se eligió este anuncio

---

## Parte 4: Validar Botones de Acción

### 4.1 Prueba SIN pagar (Usuario no autenticado o sin pago)

#### 4.1.1 Botón "Guía Visual"
1. Haz clic en el botón "Guía Visual"
2. **Resultado esperado:** Se abre un modal con la guía paso a paso para publicar en la plataforma

#### 4.1.2 Botón "Publicar Ahora"
1. Haz clic en el botón "Publicar Ahora"
2. **Resultado esperado:**
   - El botón muestra un icono de candado
   - Se abre el `PaymentModal` mostrando:
     - Título: "Desbloquea tu Campaign Kit"
     - Descripción con el nombre del negocio
     - Lista de qué incluye el kit
     - Precio: $49.99 USD
     - Botón "Proceder al Pago"

#### 4.1.3 Botón "Descargar Kit"
1. Haz clic en el botón "Descargar Kit"
2. **Resultado esperado:**
   - El botón muestra un icono de candado
   - Se abre el `PaymentModal` (igual que en 4.1.2)

#### 4.1.4 Mensaje de acceso premium
Debajo de los botones debería haber un mensaje:
- **Icono:** Candado
- **Título:** "Acceso Premium Requerido"
- **Descripción:** Explicación sobre qué se desbloquea con el pago

### 4.2 Prueba CON pago (Simular pago exitoso)

#### 4.2.1 Iniciar el flujo de pago
1. Haz clic en "Proceder al Pago" en el `PaymentModal`
2. **Resultado esperado:** Se abre Stripe Checkout en una nueva ventana

#### 4.2.2 Simular pago exitoso (Modo de prueba de Stripe)
1. En Stripe Checkout, usa tarjeta de prueba: `4242 4242 4242 4242`
2. Ingresa cualquier fecha futura y CVC
3. Haz clic en "Pay"
4. **Resultado esperado:** Se redirige a `/flowsight-ads/dashboard?payment=success`

#### 4.2.3 Verificar actualización de estado
1. Después de regresar del pago:
   - Deberías ver un toast (notificación) verde: "✅ ¡Pago Exitoso!"
   - El mensaje "Acceso Premium Requerido" debería desaparecer
   - Los botones ya NO mostrarán el icono de candado

#### 4.2.4 Probar botones después del pago

**Botón "Publicar Ahora":**
1. Haz clic en "Publicar Ahora"
2. **Resultado esperado:** Se abre la plataforma correspondiente en una nueva pestaña
   - Meta → `https://ads.facebook.com/`
   - Google → `https://ads.google.com/`
   - TikTok → `https://ads.tiktok.com/`
   - LinkedIn → `https://www.linkedin.com/campaignmanager/`

**Botón "Descargar Kit":**
1. Haz clic en "Descargar Kit"
2. **Resultado esperado:** Se descarga un PDF con nombre como:
   - `FlowSight-Premium-Kit-meta-XXXXXX.pdf`
   - Donde XXXXXX es un ID único de campaña

---

## Parte 5: Validar PDF Premium

### 5.1 Estructura del PDF
Abre el PDF descargado y verifica que tiene estas páginas:

#### Página 1: Portada Premium
- [ ] Fondo negro con barra de color por plataforma
- [ ] Logo "FLOWSIGHT ADS" en color de plataforma
- [ ] Badge "PREMIUM KIT"
- [ ] Título "Campaign Kit"
- [ ] Nombre de la plataforma en grande
- [ ] Información del negocio (Negocio, Producto, Mercado, Audiencia, Inversión)
- [ ] Footer con fecha, ID de campaña y nota de confidencialidad

#### Página 2: Resumen de Estrategia
- [ ] Descripción introductoria
- [ ] 6 cards informativos (Empresa, Producto, Mercado, Audiencia, Inversión, Plataforma)
- [ ] Cada card con etiqueta, valor y descripción

#### Página 3: Proyecciones Estimadas
- [ ] 4 tarjetas negras con métricas en verde:
  - [ ] Alcance estimado (personas)
  - [ ] Clics estimados
  - [ ] ROI proyectado
  - [ ] Costo por clic (CPC)

#### Página 4: Tus Anuncios Listos para Publicar
- [ ] Descripción de cómo usar los textos
- [ ] Sección de imagen del anuncio (si se subió)
- [ ] Cards de anuncios con:
  - [ ] Badge de tipo (Oferta/Emocional/Urgencia)
  - [ ] Plataforma
  - [ ] Score /100
  - [ ] Headline
  - [ ] Descripción
  - [ ] Botón CTA

#### Páginas 5+: Guía de Lanzamiento Paso a Paso
- [ ] 6 pasos genéricos para lanzar la campaña
- [ ] Cada paso con número, título, descripción y consejos

### 5.2 Verificar contenido dinámico
- [ ] El nombre del negocio aparece en todas las páginas
- [ ] Las métricas se calculan correctamente basadas en el presupuesto
- [ ] La imagen del anuncio se incluye (si se subió)
- [ ] Los textos de los anuncios coinciden con lo generado por Gemini

### 5.3 Verificar diseño
- [ ] Colores específicos por plataforma
- [ ] Líneas decorativas en color de plataforma
- [ ] Badges con esquinas redondeadas
- [ ] Espaciado consistente
- [ ] Tipografía legible

---

## Parte 6: Validar Integración con Stripe

### 6.1 Verificar tabla de pagos en Supabase
1. Accede a Supabase Dashboard
2. Ve a la tabla `payments`
3. Verifica que hay un registro con:
   - `user_id`: Tu ID de usuario
   - `stripe_session_id`: ID de sesión de Stripe
   - `amount_cents`: 4999 (equivalente a $49.99)
   - `currency`: USD
   - `status`: completed (después del pago)
   - `completed_at`: Fecha y hora del pago

### 6.2 Verificar webhook de Stripe
1. En Stripe Dashboard, ve a "Developers" > "Webhooks"
2. Verifica que hay eventos registrados:
   - `checkout.session.completed`
   - `payment_intent.succeeded`

---

## Parte 7: Pruebas de Edición de Anuncios

### 7.1 Editar anuncios en vivo
1. Desplázate hacia abajo hasta la sección "Edita tus Anuncios en Vivo"
2. Haz clic en el icono de edición (lápiz) en uno de los mockups
3. Modifica el headline, descripción o CTA
4. Haz clic en "Guardar Cambios"
5. **Resultado esperado:** El mockup se actualiza con los nuevos textos

---

## Parte 8: Pruebas de Rendimiento

### 8.1 Velocidad de carga
- [ ] La página carga en menos de 3 segundos
- [ ] Los mockups se renderizan sin lag
- [ ] Las transiciones entre plataformas son suaves

### 8.2 Responsividad
- [ ] En desktop: Todo se ve correctamente
- [ ] En tablet: Los botones se adaptan
- [ ] En móvil: El layout es responsive

### 8.3 Modo oscuro
- [ ] Cambia el tema a oscuro
- [ ] Verifica que todos los colores se ven bien
- [ ] Los textos son legibles

---

## Parte 9: Pruebas de Errores

### 9.1 Simular error de pago
1. En Stripe Checkout, usa tarjeta rechazada: `4000 0000 0000 0002`
2. **Resultado esperado:** Stripe muestra error, no se redirige
3. Cierra el modal y vuelve a intentar

### 9.2 Simular cancelación de pago
1. En Stripe Checkout, haz clic en "Back" o cierra la ventana
2. **Resultado esperado:** Se redirige a `/flowsight-ads/dashboard?payment=cancelled`
3. Deberías ver un toast rojo indicando la cancelación

### 9.3 Simular error de generación
1. Intenta generar una campaña sin completar todos los campos
2. **Resultado esperado:** Se muestra un error o el botón está deshabilitado

---

## Parte 10: Casos de Uso Completos

### 10.1 Flujo completo: Usuario nuevo
1. Inicia sesión
2. Genera una campaña (Paso 1-5)
3. Ve los mockups en AdsResultsShowcase
4. Intenta descargar el PDF (se abre PaymentModal)
5. Realiza el pago
6. Descarga el PDF exitosamente
7. Abre el PDF y verifica el contenido

### 10.2 Flujo completo: Usuario que ya pagó
1. Inicia sesión
2. Genera una campaña
3. Ve los mockups en AdsResultsShowcase
4. Los botones NO muestran candado
5. Descarga el PDF directamente (sin PaymentModal)
6. Abre el PDF y verifica el contenido

### 10.3 Flujo completo: Edición y publicación
1. Genera una campaña
2. Edita los anuncios (cambia headlines, descripciones)
3. Realiza el pago
4. Haz clic en "Publicar Ahora"
5. Se abre la plataforma en nueva pestaña
6. Verifica que puedes copiar los textos

---

## Checklist de Validación Final

- [ ] Compilación exitosa sin errores
- [ ] Componente AdsResultsShowcase aparece después de generar campaña
- [ ] Selector de plataformas funciona correctamente
- [ ] Navegación entre anuncios funciona
- [ ] Botón "Guía Visual" abre el modal
- [ ] Botón "Publicar Ahora" abre PaymentModal (sin pago) o plataforma (con pago)
- [ ] Botón "Descargar Kit" abre PaymentModal (sin pago) o descarga PDF (con pago)
- [ ] PaymentModal muestra información correcta
- [ ] Flujo de pago con Stripe funciona
- [ ] PDF se descarga correctamente
- [ ] PDF tiene todas las páginas esperadas
- [ ] PDF contiene información dinámica correcta
- [ ] Notificación de pago exitoso aparece
- [ ] Estado de pago se persiste en la BD
- [ ] Edición de anuncios funciona
- [ ] Modo oscuro se ve bien
- [ ] Responsive en móvil

---

## Troubleshooting

### Problema: El componente AdsResultsShowcase no aparece
**Solución:**
1. Verifica que `generatedAds` no está vacío
2. Revisa la consola del navegador para errores
3. Verifica que el componente está importado correctamente

### Problema: Los botones no funcionan
**Solución:**
1. Verifica que `hasPaid` se actualiza correctamente
2. Revisa que `usePaymentStatus` está funcionando
3. Verifica los logs en la consola

### Problema: El PDF no se descarga
**Solución:**
1. Verifica que `downloadPremiumPDFV2` está importado
2. Revisa que `userImage` es válido (base64)
3. Verifica que jsPDF está instalado

### Problema: Stripe Checkout no abre
**Solución:**
1. Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` está configurado
2. Revisa que la Edge Function `create-checkout-session` existe
3. Verifica los logs de Supabase Functions

---

## Notas Importantes

- ⚠️ Usa tarjetas de prueba de Stripe en desarrollo
- ⚠️ El estado de pago se almacena en la tabla `payments` de Supabase
- ⚠️ El hook `usePaymentStatus` verifica pagos completados
- ⚠️ El PDF se genera dinámicamente con jsPDF
- ⚠️ Los anuncios se generan con Gemini (requiere API key)

---

## Soporte

Si encuentras problemas:
1. Revisa los logs de la consola del navegador
2. Revisa los logs de Supabase (Functions, Database)
3. Verifica que todas las variables de entorno están configuradas
4. Contacta al equipo de desarrollo
