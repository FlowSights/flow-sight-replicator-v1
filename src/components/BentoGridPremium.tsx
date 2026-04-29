import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Shield,
  Rocket,
  BarChart3,
} from 'lucide-react';

interface BentoItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  span?: string;
}

const BentoItem: React.FC<BentoItemProps> = ({
  icon,
  title,
  description,
  gradient,
  span = 'col-span-1',
}) => (
  <motion.div
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
    className={`${span} group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 border border-white/10 backdrop-blur-xl transition-all duration-500 cursor-pointer`}
  >
    {/* Animated Background Blur */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-colors"
        >
          <div className="text-white/80 group-hover:text-white transition-colors">
            {icon}
          </div>
        </motion.div>

        <div>
          <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-100 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
            {description}
          </p>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
    </div>
  </motion.div>
);

export const BentoGridPremium: React.FC = () => {
  const items = [
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Anuncios Generados por IA',
      description: 'Copys y creatividades optimizadas por machine learning para máxima conversión',
      gradient: 'from-emerald-500/20 to-cyan-500/20',
      span: 'col-span-1 row-span-2',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Segmentación Inteligente',
      description: 'Audiencias micro-segmentadas basadas en psicografía del consumidor',
      gradient: 'from-blue-500/20 to-purple-500/20',
      span: 'col-span-1',
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: 'Análisis Predictivo',
      description: 'Proyecciones de ROI y tendencias de mercado en tiempo real',
      gradient: 'from-pink-500/20 to-rose-500/20',
      span: 'col-span-1',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Optimización Automática',
      description: 'Ajustes continuos de pujas y presupuesto para máxima eficiencia',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      span: 'col-span-1',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Gestión de Audiencias',
      description: 'Sincronización automática de públicos entre plataformas',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      span: 'col-span-1',
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Dashboard Analytics',
      description: 'Reportes detallados con métricas clave y benchmarks de industria',
      gradient: 'from-green-500/20 to-emerald-500/20',
      span: 'col-span-1 row-span-2',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Compliance Automático',
      description: 'Cumplimiento de políticas de cada plataforma garantizado',
      gradient: 'from-cyan-500/20 to-teal-500/20',
      span: 'col-span-1',
    },
    {
      icon: <Rocket className="w-7 h-7" />,
      title: 'Escalado Inteligente',
      description: 'Estrategia de crecimiento progresivo sin perder rentabilidad',
      gradient: 'from-purple-500/20 to-pink-500/20',
      span: 'col-span-1',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
          Lo que Puedes Esperar
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Todas las herramientas y estrategias que necesitas para dominar tu mercado
        </p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <BentoItem {...item} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center pt-8"
      >
        <p className="text-gray-600 dark:text-gray-400">
          Todo integrado en una plataforma intuitiva y poderosa
        </p>
      </motion.div>
    </div>
  );
};
