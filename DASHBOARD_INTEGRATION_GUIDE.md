# Guía de Integración: Gemini AI en FlowSights Ads Dashboard

## 📋 Cambios Necesarios en `FlowsightAdsDashboard.tsx`

### 1. Importar los nuevos módulos

En la sección de imports, añade:

```typescript
import { generateAdsWithGeminiIntegration, getBestAdByPlatform } from '@/lib/dashboardIntegration';
import { downloadPremiumPDF } from '@/lib/premiumPDFExporter';
import { downloadAssetsPackage } from '@/lib/assetsExporter';
import { EditablePlatformPreview } from '@/components/EditablePlatformPreview';
import { DynamicROIEstimator } from '@/components/DynamicROIEstimator';
import { PremiumResultsDashboard } from '@/components/PremiumResultsDashboard';
```

### 2. Reemplazar la función `handleGenerate`

**ANTES (Plantillas estáticas):**
```typescript
const handleGenerate = async () => {
  setIsLoading(true);
  setLoadingStep(0);
  
  for (let i = 0; i < loadingMessages.length; i++) {
    setLoadingStep(i);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Código con plantillas estáticas...
  const ads: GeneratedAd[] = [
    { type: 'Offer', headline: `¡${biz}: ${config.promote}...`, ... },
    // ... más anuncios estáticos
  ];

  setGeneratedAds(ads);
  setShowResults(true);
  setIsLoading(false);
};
```

**DESPUÉS (Con Gemini AI):**
```typescript
const handleGenerate = async () => {
  setIsLoading(true);
  setLoadingStep(0);

  try {
    // Llamar a Gemini a través de la Edge Function
    const generatedAds = await generateAdsWithGeminiIntegration(config, (step) => {
      setLoadingStep(step);
    });

    setGeneratedAds(generatedAds);
    setShowResults(true);
    
    // Mostrar métricas después de 500ms
    setTimeout(() => setMetricsVisible(true), 500);
  } catch (error: any) {
    console.error('Error generando anuncios:', error);
    toast({
      title: 'Error al generar anuncios',
      description: error.message || 'Por favor, intenta de nuevo',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Actualizar los mensajes de carga

Reemplaza `loadingMessages`:

```typescript
const loadingMessages = [
  'Analizando tu modelo de negocio...',
  'Consultando IA para generar copys únicos...',
  'Optimizando textos para máxima conversión...',
  'Estructurando tu Campaign Kit Premium...'
];
```

### 4. Crear funciones de exportación

Añade estas funciones en el componente:

```typescript
const handleExportPDF = () => {
  if (generatedAds.length === 0) return;
  
  const pdfData = {
    businessName: config.businessName,
    websiteUrl: config.websiteUrl,
    promote: config.promote,
    location: config.location,
    idealCustomer: config.idealCustomer,
    budget: config.budget,
    platform: 'meta' as const, // O la plataforma seleccionada
    ads: generatedAds.map(ad => ({
      type: ad.type,
      headline: ad.headline,
      description: ad.description,
      cta: ad.cta,
      reasoning: ad.reasoning || 'Optimizado para conversión',
      score: ad.score,
    })),
  };
  
  downloadPremiumPDF(pdfData);
};

const handleDownloadAssets = () => {
  if (generatedAds.length === 0) return;
  
  const assetsData = {
    businessName: config.businessName,
    platform: 'meta' as const, // O la plataforma seleccionada
    ads: generatedAds.map(ad => ({
      headline: ad.headline,
      description: ad.description,
      cta: ad.cta,
      imageUrl: ad.imageUrl,
      type: ad.type,
    })),
    websiteUrl: config.websiteUrl,
  };
  
  downloadAssetsPackage(assetsData);
};

const handleViewDashboard = () => {
  // Scroll a la sección de resultados o abrir modal
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

### 5. Actualizar la sección de resultados

En la sección donde se muestran los resultados, reemplaza el código de previsualizaciones estáticas con:

```typescript
{showResults && (
  <>
    {/* Dashboard Premium */}
    <PremiumResultsDashboard
      campaignName={config.businessName}
      businessName={config.businessName}
      platform={selectedPlatform}
      generatedAds={generatedAds}
      onExportPDF={handleExportPDF}
      onViewDashboard={handleViewDashboard}
      onDownloadAssets={handleDownloadAssets}
    />

    {/* ROI Dinámico */}
    <DynamicROIEstimator
      budget={config.budget}
      businessName={config.businessName}
      location={config.location}
      idealCustomer={config.idealCustomer}
    />

    {/* Previsualizaciones Editables */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {generatedAds.map((ad, idx) => (
        <EditablePlatformPreview
          key={idx}
          platform={ad.platform}
          headline={ad.headline}
          description={ad.description}
          cta={ad.cta}
          imageUrl={ad.imageUrl}
          businessName={ad.businessName}
          websiteUrl={ad.websiteUrl}
          onUpdate={(updates) => {
            const updatedAds = [...generatedAds];
            updatedAds[idx] = {
              ...updatedAds[idx],
              ...updates,
            };
            setGeneratedAds(updatedAds);
          }}
        />
      ))}
    </div>
  </>
)}
```

### 6. Actualizar tipos si es necesario

Asegúrate de que `GeneratedAd` tenga el campo `reasoning`:

```typescript
interface GeneratedAd {
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  type: 'Offer' | 'Emotional' | 'Urgency';
  score: number;
  platformUrl: string;
  businessName?: string;
  websiteUrl?: string;
  reasoning?: string; // ← Añadir este campo
}
```

## ✅ Checklist de Integración

- [ ] Importar todos los módulos nuevos
- [ ] Reemplazar `handleGenerate` con la versión de Gemini
- [ ] Actualizar `loadingMessages`
- [ ] Crear funciones de exportación (`handleExportPDF`, `handleDownloadAssets`)
- [ ] Actualizar la sección de resultados con componentes nuevos
- [ ] Verificar que `GeneratedAd` tenga el campo `reasoning`
- [ ] Probar el flujo completo end-to-end
- [ ] Verificar que Gemini se llama correctamente
- [ ] Probar exportación de PDF
- [ ] Probar descarga de assets

## 🚀 Flujo Completo Después de la Integración

1. Usuario llena el formulario (negocio, ubicación, cliente ideal, presupuesto)
2. Usuario sube una imagen
3. Usuario hace clic en "Generar Campaña"
4. **Gemini AI genera 12 copys únicos** (3 por plataforma)
5. Se muestran las previsualizaciones editables
6. Usuario puede editar los copys directamente
7. Se muestra el ROI dinámico personalizado
8. Usuario puede:
   - Descargar PDF Premium
   - Descargar Assets (CSV, JSON, TXT)
   - Ver Dashboard Personalizado
9. Usuario procede al pago ($49)
10. Acceso completo a todos los entregables

## 📝 Notas Importantes

- La API Key de Gemini debe estar en Supabase Secrets
- El plan gratuito de Gemini es suficiente para este uso
- Cada generación consume ~2,000-3,000 tokens
- El límite es 15 RPM (solicitudes por minuto), más que suficiente
- Los errores de Gemini se manejan gracefully con mensajes amigables

## 🔧 Debugging

Si algo no funciona:

1. Verifica que `GEMINI_API_KEY` esté en Supabase Secrets
2. Revisa la consola del navegador para errores
3. Verifica que la Edge Function `generate-ads-with-gemini` esté deployada
4. Prueba la Edge Function directamente con curl o Postman
5. Revisa los logs de Supabase en el dashboard

---

**¡Listo para integrar!** 🚀
