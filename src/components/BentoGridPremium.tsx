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
  MessageSquare,
  Layout,
  CheckCircle2
} from 'lucide-react';

interface BentoItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconColor: string;
}

const BentoItem: React.FC<BentoItemProps> = ({
  icon,
  title,
  description,
  className = '',
  iconColor
}) => (
  <motion.div
    whileHover={{ y: -8 }}
    className={`group relative overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-500 ${className}`}
  >
    <div className="relative z-10 flex flex-col h-full space-y-6">
      <div className={`w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center border border-black/5 dark:border-white/20 transition-colors ${iconColor}`}>
        {icon}
      </div>

      <div>
        <h3 className="text-xl font-bold text-black dark:text-white mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
    
    {/* Decorative Gradient */}
    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full blur-3xl transition-all group-hover:bg-emerald-500/10" />
  </motion.div>
);

export const BentoGridPremium: React.FC = () => {
  const items = [
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Estrategia de Alto Impacto',
      description: 'Análisis profundo de tu mercado para conectar emocionalmente con tus clientes.',
      className: 'md:col-span-2 md:row-span-2',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: 'Textos Persuasivos',
      description: 'Copywriting diseñado para captar la atención y generar ventas inmediatas.',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Público Objetivo',
      description: 'Segmentación precisa para llegar a las personas que realmente quieren comprar.',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Optimización IA',
      description: 'Nuestra tecnología ajusta cada detalle para maximizar tu inversión publicitaria.',
      className: 'md:col-span-2',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Resultados Estimados',
      description: 'Proyecciones realistas basadas en el rendimiento actual de tu industria.',
      iconColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      icon: <Layout className="w-7 h-7" />,
      title: 'Guía de Lanzamiento',
      description: 'Pasos claros y sencillos para publicar tus anuncios sin complicaciones técnicas.',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="w-full space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Contenido del Kit</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tight">
          Lo que incluye tu <span className="text-emerald-600 dark:text-emerald-500">Campaign Kit</span>
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Todo lo necesario para que tu negocio destaque y atraiga nuevos clientes desde el primer día.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <BentoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
