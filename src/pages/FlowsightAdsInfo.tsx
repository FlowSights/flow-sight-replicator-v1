import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Target, Rocket, BarChart3, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const FlowsightAdsInfo: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Generación IA',
      description: 'Crea campañas y anuncios optimizados en segundos con inteligencia artificial avanzada.',
    },
    {
      icon: Target,
      title: '4 Plataformas',
      description: 'Lanza tus anuncios en Meta, Google Ads, TikTok y LinkedIn desde una sola interfaz.',
    },
    {
      icon: Rocket,
      title: 'Imágenes Optimizadas',
      description: 'Carga tus fotos y deja que la IA las optimice para cada plataforma automáticamente.',
    },
    {
      icon: BarChart3,
      title: 'Presupuesto Inteligente',
      description: 'Recomendaciones de gasto basadas en tu audiencia y objetivo de campaña.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950 dark:via-teal-950 dark:to-emerald-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30 px-4 py-2 rounded-full transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Volver
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Flowsight Ads
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium mb-4">
            Crea campañas de anuncios con IA en segundos
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Genera copys persuasivos, optimiza imágenes y publica en Meta, Google Ads, TikTok y LinkedIn sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/flowsight-ads')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              Iniciar Sesión
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const element = document.getElementById('contact');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-6 text-lg rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            >
              Contactar
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="glass-card backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 border border-white/20 dark:border-gray-800 hover:shadow-xl transition-all"
              >
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg mb-4 w-fit">
                  <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="my-20 glass-card backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-12 border border-white/20 dark:border-gray-800">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Elige plataforma', desc: 'Selecciona dónde quieres publicar' },
              { step: '2', title: 'Configura campaña', desc: 'Define audiencia y presupuesto' },
              { step: '3', title: 'IA genera contenido', desc: 'Textos e imágenes optimizadas' },
              { step: '4', title: 'Publica', desc: 'Descarga o publica directamente' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="my-20 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Planes y Precios
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'Gratis', features: ['Hasta 5 campañas/mes', 'Todas las plataformas', 'Soporte por email'] },
              { name: 'Pro', price: '$29/mes', features: ['Campañas ilimitadas', 'Análisis avanzado', 'Soporte prioritario', 'API access'] },
              { name: 'Enterprise', price: 'Personalizado', features: ['Solución custom', 'Equipo dedicado', 'Integración completa', 'SLA garantizado'] },
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`glass-card backdrop-blur-xl rounded-2xl p-8 border transition-all ${
                  idx === 1 
                    ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border-emerald-500/50 scale-105 shadow-2xl' 
                    : 'bg-white/90 dark:bg-gray-900/90 border-white/20 dark:border-gray-800'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg"
                  onClick={() => navigate('/flowsight-ads')}
                >
                  Comenzar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">¿Tienes preguntas?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Nuestro equipo está listo para ayudarte a maximizar tus campañas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full flex items-center justify-center gap-2"
              onClick={() => window.open('mailto:contacto@flowsights.com')}
            >
              <Mail className="w-5 h-5" />
              Enviar Email
            </Button>
            <Button 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full flex items-center justify-center gap-2"
              onClick={() => window.open('https://wa.me/5491112345678')}
            >
              <Phone className="w-5 h-5" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Flowsight Ads. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default FlowsightAdsInfo;
