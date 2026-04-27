import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface ROIEstimatorProps {
  budget: number;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
}

// Average industry benchmarks for ROI by platform
const PLATFORM_BENCHMARKS: Record<string, { avgCTR: number; avgCPC: number; avgConversionRate: number; avgOrderValue: number }> = {
  google: {
    avgCTR: 0.04, // 4%
    avgCPC: 1.5,
    avgConversionRate: 0.03, // 3%
    avgOrderValue: 50
  },
  meta: {
    avgCTR: 0.015, // 1.5%
    avgCPC: 0.8,
    avgConversionRate: 0.025, // 2.5%
    avgOrderValue: 45
  },
  tiktok: {
    avgCTR: 0.025, // 2.5%
    avgCPC: 0.5,
    avgConversionRate: 0.02, // 2%
    avgOrderValue: 35
  },
  linkedin: {
    avgCTR: 0.018, // 1.8%
    avgCPC: 2.5,
    avgConversionRate: 0.04, // 4%
    avgOrderValue: 100
  }
};

export const ROIEstimator: React.FC<ROIEstimatorProps> = ({ budget, platform }) => {
  const [conversionMultiplier, setConversionMultiplier] = useState(1);
  
  const benchmarks = PLATFORM_BENCHMARKS[platform];
  
  const calculations = useMemo(() => {
    const clicks = (budget / benchmarks.avgCPC);
    const conversions = clicks * benchmarks.avgConversionRate * (conversionMultiplier / 100);
    const revenue = conversions * benchmarks.avgOrderValue;
    const roi = ((revenue - budget) / budget) * 100;
    const roiMultiplier = revenue / budget;
    
    return {
      clicks: Math.round(clicks),
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      roi: Math.round(roi),
      roiMultiplier: roiMultiplier.toFixed(2)
    };
  }, [budget, benchmarks, conversionMultiplier]);

  const platformColors: Record<string, { bg: string; text: string; icon: string }> = {
    google: { bg: 'from-blue-500/20 to-blue-600/20', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500' },
    meta: { bg: 'from-blue-600/20 to-purple-600/20', text: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-600' },
    tiktok: { bg: 'from-black/20 to-pink-600/20', text: 'text-gray-900 dark:text-white', icon: 'text-pink-500' },
    linkedin: { bg: 'from-blue-700/20 to-blue-800/20', text: 'text-blue-800 dark:text-blue-300', icon: 'text-blue-700' }
  };

  const colors = platformColors[platform];
  const isPositiveROI = calculations.roi >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className={`p-6 border-0 bg-gradient-to-br ${colors.bg} backdrop-blur-sm overflow-hidden relative group`}>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-white/10 ${colors.icon}`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Estimador de ROI</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{platform.toUpperCase()}</p>
              </div>
            </div>
            <div className={`text-right ${isPositiveROI ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">ROI Estimado</p>
              <p className="text-3xl font-black">{isPositiveROI ? '+' : ''}{calculations.roi}%</p>
            </div>
          </div>

          {/* Conversion Rate Slider */}
          <div className="mb-6 p-4 bg-white/5 dark:bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                Ajusta tu tasa de conversión
              </label>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{conversionMultiplier}%</span>
            </div>
            <Slider
              value={[conversionMultiplier]}
              onValueChange={(value) => setConversionMultiplier(value[0])}
              min={50}
              max={200}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Ajusta según tu experiencia con optimizaciones de landing page o copywriting
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Clics Estimados', value: calculations.clicks.toLocaleString(), icon: Zap, color: 'text-yellow-500' },
              { label: 'Conversiones', value: calculations.conversions.toLocaleString(), icon: Target, color: 'text-emerald-500' },
              { label: 'Ingresos Estimados', value: `$${calculations.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
              { label: 'Multiplicador', value: `${calculations.roiMultiplier}x`, icon: TrendingUp, color: 'text-blue-500' }
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{metric.label}</p>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            💡 Estos son estimados basados en benchmarks de la industria. Los resultados reales varían según tu industria y optimización.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
