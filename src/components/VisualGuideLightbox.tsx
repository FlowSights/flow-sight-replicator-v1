import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Copy,
  X
} from 'lucide-react';

interface GuideStep {
  step: number;
  title: string;
  description: string;
  action: string;
  tips?: string[];
  link?: string;
  image?: string;
}

interface PlatformGuide {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  platformName: string;
  color: string;
  steps: GuideStep[];
  platformUrl: string;
}

const platformGuides: Record<string, PlatformGuide> = {
  meta: {
    platform: 'meta',
    platformName: 'Meta Ads (Facebook & Instagram)',
    color: 'from-blue-500 to-blue-600',
    platformUrl: 'https://adsmanager.facebook.com/adsmanager/manage/campaigns',
    steps: [
      {
        step: 1,
        title: 'Accede al Administrador de Anuncios',
        description: 'Abre tu cuenta publicitaria de Meta. Este es tu centro de control para todas tus campañas.',
        action: 'Haz clic en el botón verde "Abrir Meta Ads Manager" para ir directamente',
        tips: [
          'Asegúrate de estar logueado en tu cuenta de Meta',
          'Si es tu primera vez, puede que necesites crear una cuenta publicitaria',
          'Tienes acceso a Facebook, Instagram, Messenger y Audience Network'
        ],
        link: 'https://adsmanager.facebook.com/adsmanager/manage/campaigns'
      },
      {
        step: 2,
        title: 'Haz clic en "+ Crear"',
        description: 'Busca el botón verde en la esquina superior izquierda que dice "+ Crear". Este botón inicia el proceso de creación de tu campaña.',
        action: 'Localiza y pulsa el botón verde de creación',
        tips: [
          'El botón está siempre visible en la parte superior',
          'Si no lo ves, recarga la página',
          'Deberías ver opciones para Campaña, Conjunto de anuncios y Anuncio'
        ]
      },
      {
        step: 3,
        title: 'Elige tu objetivo',
        description: 'Meta te preguntará qué deseas lograr. Para esta campaña, selecciona "Tráfico" (visitas a tu web) o "Ventas" (conversiones).',
        action: 'Selecciona el objetivo que mejor se adapte a tu negocio',
        tips: [
          'Tráfico: ideal para aumentar visitas',
          'Ventas/Clientes Potenciales: para conversiones directas',
          'Activa "Presupuesto de la campaña Advantage+" para optimización automática'
        ]
      },
      {
        step: 4,
        title: 'Configura tu audiencia',
        description: 'Define dónde quieres que aparezca tu anuncio. Ingresa la ubicación, edad y género de tu cliente ideal.',
        action: 'Completa los campos de ubicación, edad y género',
        tips: [
          'Ubicación: ingresa la ciudad o país que definiste',
          'Edad: elige el rango de edad de tu audiencia',
          'Usa "Ubicaciones Advantage+" para dejar que Meta optimice automáticamente'
        ]
      },
      {
        step: 5,
        title: 'Sube tu imagen y textos',
        description: 'Carga la imagen que preparaste y copia los textos (headline y descripción) del kit que descargaste.',
        action: 'Sube la imagen y pega los textos en los campos correspondientes',
        tips: [
          'Imagen recomendada: 1200x628 píxeles',
          'Copia exactamente los textos del kit para máximo impacto',
          'Elige un botón CTA que invite a la acción (Más información, Comprar, etc.)'
        ]
      },
      {
        step: 6,
        title: 'Revisa y publica',
        description: 'Revisa la vista previa de tu anuncio. Si todo se ve bien, presiona el botón "Publicar".',
        action: 'Haz clic en el botón verde "Publicar" para lanzar tu campaña',
        tips: [
          'La vista previa muestra cómo se verá en Facebook, Instagram y Messenger',
          'Meta revisará tu anuncio en minutos',
          '¡Felicidades! Tu campaña está en vivo'
        ]
      }
    ]
  },
  google: {
    platform: 'google',
    platformName: 'Google Ads',
    color: 'from-red-500 to-yellow-500',
    platformUrl: 'https://ads.google.com/aw/campaigns/new',
    steps: [
      {
        step: 1,
        title: 'Entra a Google Ads',
        description: 'Accede a tu cuenta de Google Ads. Este es el lugar donde aparecerás en los resultados de búsqueda.',
        action: 'Haz clic en "Abrir Google Ads Manager"',
        tips: [
          'Necesitas una cuenta de Google',
          'Si es tu primera vez, Google te guiará en la configuración inicial',
          'Tienes acceso a búsqueda, display, shopping y más'
        ],
        link: 'https://ads.google.com/aw/campaigns/new'
      },
      {
        step: 2,
        title: 'Crea una nueva campaña',
        description: 'Haz clic en el botón "Nueva campaña" para comenzar. Google te pedirá que definas tu objetivo.',
        action: 'Selecciona "Nueva campaña" en la interfaz principal',
        tips: [
          'Elige el tipo de campaña "Búsqueda" (Search)',
          'Esto asegura que aparezcas en los resultados de texto de Google',
          'Selecciona tu objetivo: Ventas, Clientes potenciales o Tráfico'
        ]
      },
      {
        step: 3,
        title: 'Define tu presupuesto',
        description: 'Ingresa tu presupuesto diario. Google te mostrará proyecciones de alcance basadas en tu inversión.',
        action: 'Completa el campo de presupuesto diario',
        tips: [
          'Presupuesto diario = tu inversión mensual ÷ 30',
          'Puedes cambiar esto en cualquier momento',
          'En la sección de "Pujas", elige "Clics" para maximizar tráfico inicial'
        ]
      },
      {
        step: 4,
        title: 'Agrega palabras clave',
        description: 'Ingresa las palabras clave por las que quieres aparecer. Piensa en cómo tu cliente ideal buscaría tu producto.',
        action: 'Ingresa 5-10 palabras clave específicas',
        tips: [
          'Usa frases específicas, no palabras sueltas',
          'Ejemplo: "comprar zapatos deportivos online" en lugar de solo "zapatos"',
          'Google te sugerirá palabras clave relacionadas'
        ]
      },
      {
        step: 5,
        title: 'Copia tus anuncios',
        description: 'Copia los títulos (headlines) y descripciones del kit que descargaste y pégalos en Google Ads.',
        action: 'Completa los campos de título y descripción',
        tips: [
          'Google rotará automáticamente tus anuncios para encontrar la mejor combinación',
          'Llena todos los espacios posibles para máximo impacto',
          'Los textos están optimizados para persuadir y convertir'
        ]
      },
      {
        step: 6,
        title: 'Publica tu campaña',
        description: 'Revisa el resumen de tu campaña. Si todo está correcto, haz clic en "Publicar campaña".',
        action: 'Haz clic en el botón "Publicar campaña"',
        tips: [
          'Google revisará tu campaña en unas horas',
          'Recibirás notificaciones cuando esté aprobada',
          '¡Ya estás en el buscador más grande del mundo!'
        ]
      }
    ]
  },
  tiktok: {
    platform: 'tiktok',
    platformName: 'TikTok Ads',
    color: 'from-gray-900 to-black',
    platformUrl: 'https://ads.tiktok.com/i18n/dashboard',
    steps: [
      {
        step: 1,
        title: 'Accede a TikTok Ads Manager',
        description: 'Abre tu panel de control de TikTok. Aquí es donde crearás y gestionarás tus anuncios.',
        action: 'Haz clic en "Abrir TikTok Ads Manager"',
        tips: [
          'Necesitas una cuenta de TikTok Business',
          'Si no tienes una, puedes convertir tu cuenta personal en Business',
          'TikTok tiene acceso a millones de usuarios activos'
        ],
        link: 'https://ads.tiktok.com/i18n/dashboard'
      },
      {
        step: 2,
        title: 'Crea una nueva campaña',
        description: 'En la pestaña de Campañas, haz clic en el botón "Crear" para iniciar una nueva campaña.',
        action: 'Localiza y pulsa el botón rosa "Crear"',
        tips: [
          'Asegúrate de estar en la pestaña "Campañas"',
          'TikTok te guiará a través de un asistente paso a paso',
          'Tendrás opciones para diferentes objetivos publicitarios'
        ]
      },
      {
        step: 3,
        title: 'Elige tu objetivo',
        description: 'TikTok te preguntará qué deseas lograr. Para empezar rápido, selecciona "Tráfico" o "Conversiones".',
        action: 'Selecciona el objetivo que mejor se adapte a tu negocio',
        tips: [
          'Tráfico: para aumentar visitas a tu sitio web',
          'Conversiones: si tienes el píxel de TikTok instalado',
          'Engagement: para aumentar interacción en TikTok'
        ]
      },
      {
        step: 4,
        title: 'Configura tu audiencia',
        description: 'Define a quién quieres alcanzar. Ingresa ubicación, edad, género e intereses de tu cliente ideal.',
        action: 'Completa los campos de segmentación de audiencia',
        tips: [
          'Ubicación: ingresa la ciudad o país que definiste',
          'En TikTok, a menudo es mejor dejar los intereses amplios',
          'Deja que el algoritmo encuentre a tu audiencia basándose en el comportamiento'
        ]
      },
      {
        step: 5,
        title: 'Sube tu contenido visual',
        description: 'Carga la imagen o video que preparaste. En TikTok, el formato vertical (9:16) es el rey.',
        action: 'Sube tu contenido visual y pega el texto del anuncio',
        tips: [
          'Formato recomendado: vertical (9:16)',
          'Tamaño máximo: 287.6 MB',
          'Mantén el texto breve y directo al punto'
        ]
      },
      {
        step: 6,
        title: 'Envía a revisión',
        description: 'Revisa la vista previa de tu anuncio en formato móvil. Si se ve bien, presiona "Enviar".',
        action: 'Haz clic en el botón "Enviar" para lanzar tu campaña',
        tips: [
          'La vista previa muestra exactamente cómo se verá en TikTok',
          'TikTok revisará tu anuncio en unas horas',
          '¡Prepárate para conquistar el feed "Para Ti"!'
        ]
      }
    ]
  },
  linkedin: {
    platform: 'linkedin',
    platformName: 'LinkedIn Ads',
    color: 'from-blue-700 to-blue-800',
    platformUrl: 'https://www.linkedin.com/campaignmanager/accounts',
    steps: [
      {
        step: 1,
        title: 'Accede a Campaign Manager',
        description: 'Abre tu administrador de campañas de LinkedIn. Este es tu espacio para conectar con profesionales.',
        action: 'Haz clic en "Abrir LinkedIn Campaign Manager"',
        tips: [
          'Necesitas una cuenta de LinkedIn con acceso a publicidad',
          'LinkedIn es ideal para B2B y profesionales',
          'Tienes acceso a millones de tomadores de decisiones'
        ],
        link: 'https://www.linkedin.com/campaignmanager/accounts'
      },
      {
        step: 2,
        title: 'Selecciona tu cuenta publicitaria',
        description: 'Elige la cuenta publicitaria con la que quieres trabajar. Luego haz clic en "Crear" > "Campaña".',
        action: 'Selecciona tu cuenta y crea una nueva campaña',
        tips: [
          'Si no tienes cuenta publicitaria, puedes crearla aquí',
          'Asegúrate de estar en la cuenta correcta',
          'Tendrás acceso a reportes y análisis detallados'
        ]
      },
      {
        step: 3,
        title: 'Elige tu objetivo',
        description: 'LinkedIn te pedirá que selecciones un objetivo. Elige "Visitas al sitio web" o "Generación de contactos".',
        action: 'Selecciona el objetivo que mejor se adapte a tu estrategia',
        tips: [
          'Visitas al sitio web: para tráfico a tu web',
          'Generación de contactos: para recopilar datos de prospectos',
          'Engagement: para aumentar interacción en LinkedIn'
        ]
      },
      {
        step: 4,
        title: 'Segmenta profesionalmente',
        description: 'Aquí es donde LinkedIn brilla. Define tu audiencia usando filtros profesionales: cargo, sector, tamaño de empresa.',
        action: 'Completa los filtros de segmentación profesional',
        tips: [
          'Cargos: "Director de Marketing", "CEO", etc.',
          'Sectores: "Tecnología", "Salud", etc.',
          'Mantén tu audiencia entre 50,000 y 300,000 personas'
        ]
      },
      {
        step: 5,
        title: 'Sube tu imagen y textos',
        description: 'Selecciona el formato "Anuncio con una sola imagen", sube tu imagen y copia los textos del kit.',
        action: 'Carga la imagen y pega los textos del anuncio',
        tips: [
          'Formato recomendado: 1200x628 píxeles',
          'Los textos están optimizados para profesionales',
          'Elige un CTA profesional: "Más información", "Descargar", etc.'
        ]
      },
      {
        step: 6,
        title: 'Lanza tu campaña',
        description: 'Revisa todos los detalles de tu campaña. Confirma tu presupuesto diario y haz clic en "Lanzar campaña".',
        action: 'Haz clic en "Lanzar campaña" para activarla',
        tips: [
          'LinkedIn revisará tu anuncio en unas horas',
          'Recibirás notificaciones sobre el estado de tu campaña',
          '¡Tu mensaje está en camino a los profesionales correctos!'
        ]
      }
    ]
  }
};

interface VisualGuideLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
}

export const VisualGuideLightbox: React.FC<VisualGuideLightboxProps> = ({ 
  isOpen, 
  onClose, 
  platform 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const guide = platformGuides[platform];
  const step = guide.steps[currentStep];

  const handleNext = () => {
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-0 shadow-2xl">
        <DialogHeader className="relative pb-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guide.color} flex items-center justify-center text-white text-2xl font-bold`}>
              {guide.platform === 'meta' && 'f'}
              {guide.platform === 'google' && 'G'}
              {guide.platform === 'tiktok' && '♪'}
              {guide.platform === 'linkedin' && 'in'}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-black text-gray-900 dark:text-white">
                Guía Paso a Paso: {guide.platformName}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Paso {currentStep + 1} de {guide.steps.length}
              </p>
            </div>
            <DialogClose className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </DialogClose>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="py-8 space-y-8"
          >
            {/* Número y título del paso */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${guide.color} flex items-center justify-center text-white font-black text-lg`}>
                  {step.step}
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {step.title}
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed ml-15">
                {step.description}
              </p>
            </div>

            {/* Acción principal */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">
                    {step.action}
                  </p>
                  {step.link && (
                    <Button
                      onClick={() => window.open(step.link, '_blank')}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ir a {guide.platformName}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tips y consejos */}
            {step.tips && step.tips.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  Consejos Pro
                </h3>
                <ul className="space-y-2">
                  {step.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Indicador de progreso */}
            <div className="space-y-3">
              <div className="flex gap-1">
                {guide.steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx <= currentStep
                        ? `bg-gradient-to-r ${guide.color}`
                        : 'bg-gray-200 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Progreso: {currentStep + 1} / {guide.steps.length}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-white/10">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 py-6 rounded-xl font-bold gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === guide.steps.length - 1}
            className={`flex-1 py-6 rounded-xl font-bold gap-2 text-white bg-gradient-to-r ${guide.color} hover:shadow-lg transition-all`}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Botón final */}
        {currentStep === guide.steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <Button
              onClick={handleClose}
              className="w-full py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              ¡Entendido! Voy a publicar mi campaña
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
