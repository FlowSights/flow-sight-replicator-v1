import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Target, Clock, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

interface DynamicROIEstimatorProps {
  budget: number;
  businessName?: string;
  location?: string;
  idealCustomer?: string;
}

interface PlatformMetrics {
  platform: string;
  avgCPC: number;
  avgConversionRate: number;
  avgOrderValue: number;
  cpcReduction: number;
  conversionBoost: number;
  hoursToSave: number;
}

const PLATFORM_METRICS: Record<string, PlatformMetrics> = {
  google: {
    platform: 'Google Ads',
    avgCPC: 1.5,
    avgConversionRate: 0.03,
    avgOrderValue: 75,
    cpcReduction: 0.15,
    conversionBoost: 0.25,
    hoursToSave: 8,
  },
  meta: {
    platform: 'Meta Ads',
    avgCPC: 0.8,
    avgConversionRate: 0.025,
    avgOrderValue: 60,
    cpcReduction: 0.2,
    conversionBoost: 0.3,
    hoursToSave: 6,
  },
  tiktok: {
    platform: 'TikTok Ads',
    avgCPC: 0.5,
    avgConversionRate: 0.02,
    avgOrderValue: 50,
    cpcReduction: 0.25,
    conversionBoost: 0.35,
    hoursToSave: 5,
  },
  linkedin: {
    platform: 'LinkedIn Ads',
    avgCPC: 3.0,
    avgConversionRate: 0.04,
    avgOrderValue: 150,
    cpcReduction: 0.1,
    conversionBoost: 0.2,
    hoursToSave: 10,
  },
};

const HOURLY_VALUE_USD = 50; // Valor de hora de trabajo profesional

export const DynamicROIEstimator: React.FC<DynamicROIEstimatorProps> = ({
  budget,
  businessName = 'Tu Negocio',
  location = 'Tu Ubicación',
  idealCustomer = 'Tu Cliente Ideal',
}) => {
  const [marginPercentage, setMarginPercentage] = useState(30);
  const [closureRate, setClosureRate] = useState(0.5);
  const [customAOV, setCustomAOV] = useState<number | null>(null);

  const calculations = useMemo(() => {
    const results = Object.entries(PLATFORM_METRICS).map(([key, metrics]) => {
      const aov = customAOV || metrics.avgOrderValue;
      const dailyBudget = budget;

      // Escenario SIN FlowSights
      const clicksWithoutFS = dailyBudget / metrics.avgCPC;
      const conversionsWithoutFS = clicksWithoutFS * metrics.avgConversionRate;
      const revenueWithoutFS = conversionsWithoutFS * aov * closureRate;
      const profitWithoutFS = revenueWithoutFS * (marginPercentage / 100);
      const timeWithoutFS = metrics.hoursToSave;

      // Escenario CON FlowSights
      const improvedCPC = metrics.avgCPC * (1 - metrics.cpcReduction);
      const improvedConversionRate = metrics.avgConversionRate * (1 + metrics.conversionBoost);
      const clicksWithFS = dailyBudget / improvedCPC;
      const conversionsWithFS = clicksWithFS * improvedConversionRate;
      const revenueWithFS = conversionsWithFS * aov * closureRate;
      const profitWithFS = revenueWithFS * (marginPercentage / 100);
      const timeWithFS = 0; // FlowSights automatiza todo

      // Diferencias
      const additionalRevenue = revenueWithFS - revenueWithoutFS;
      const additionalProfit = profitWithFS - profitWithoutFS;
      const timeSavedValue = timeWithoutFS * HOURLY_VALUE_USD;
      const totalBenefit = additionalProfit + timeSavedValue;

      return {
        platform: metrics.platform,
        key,
        // Sin FlowSights
        clicksWithoutFS: Math.round(clicksWithoutFS),
        conversionsWithoutFS: Math.round(conversionsWithFS),
        revenueWithoutFS: Math.round(revenueWithoutFS),
        profitWithoutFS: Math.round(profitWithoutFS),
        // Con FlowSights
        clicksWithFS: Math.round(clicksWithFS),
        conversionsWithFS: Math.round(conversionsWithFS),
        revenueWithFS: Math.round(revenueWithFS),
        profitWithFS: Math.round(profitWithFS),
        // Beneficios
        additionalRevenue: Math.round(additionalRevenue),
        additionalProfit: Math.round(additionalProfit),
        timeSavedValue: Math.round(timeSavedValue),
        totalBenefit: Math.round(totalBenefit),
        roi: Math.round(((totalBenefit / 49) * 100)), // Precio del kit: $49
      };
    });

    return results;
  }, [budget, marginPercentage, closureRate, customAOV]);

  const totalMonthlyBenefit = useMemo(
    () => calculations.reduce((sum, calc) => sum + calc.totalBenefit, 0) * 30,
    [calculations]
  );

  return (
    <div className="space-y-6">
      {/* Controles de entrada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          ⚙️ Personaliza tu Análisis de ROI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Margen de Ganancia */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Margen de Ganancia: {marginPercentage}%
            </label>
            <Slider
              value={[marginPercentage]}
              onValueChange={(value) => setMarginPercentage(value[0])}
              min={10}
              max={80}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Porcentaje de ganancia neta sobre ventas
            </p>
          </div>

          {/* Tasa de Cierre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tasa de Cierre: {(closureRate * 100).toFixed(0)}%
            </label>
            <Slider
              value={[closureRate * 100]}
              onValueChange={(value) => setClosureRate(value[0] / 100)}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              % de leads que se convierten en clientes
            </p>
          </div>

          {/* Ticket Promedio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Ticket Promedio: ${customAOV || 'Automático'}
            </label>
            <Input
              type="number"
              value={customAOV || ''}
              onChange={(e) => setCustomAOV(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Deja en blanco para automático"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Valor promedio de cada venta
            </p>
          </div>
        </div>
      </motion.div>

      {/* Resumen de Beneficio Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold opacity-90 mb-2">💰 Beneficio Mensual Estimado</p>
            <h2 className="text-4xl font-black">
              ${(totalMonthlyBenefit / 1000).toFixed(1)}K
            </h2>
            <p className="text-sm opacity-75 mt-1">
              Ganancia adicional en 30 días con FlowSights Ads
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black opacity-20">📈</div>
            <p className="text-sm font-semibold mt-2">
              ROI: {Math.round((totalMonthlyBenefit / 49) * 100)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Comparativa por Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculations.map((calc, idx) => (
          <motion.div
            key={calc.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">{calc.platform}</h3>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                  +{calc.roi}% ROI
                </div>
              </div>

              <div className="space-y-3">
                {/* Conversiones */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4" />
                    Conversiones
                  </div>
                  <div>
                    <span className="text-gray-500 line-through">{calc.conversionsWithoutFS}</span>
                    <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">
                      {calc.conversionsWithFS}
                    </span>
                  </div>
                </div>

                {/* Ingresos */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    Ingresos
                  </div>
                  <div>
                    <span className="text-gray-500 line-through">${calc.revenueWithoutFS}</span>
                    <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">
                      ${calc.revenueWithFS}
                    </span>
                  </div>
                </div>

                {/* Ganancia */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    Ganancia
                  </div>
                  <div>
                    <span className="text-gray-500 line-through">${calc.profitWithoutFS}</span>
                    <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">
                      ${calc.profitWithFS}
                    </span>
                  </div>
                </div>

                {/* Beneficio Total */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm font-bold">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    Beneficio Total
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ${calc.totalBenefit}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Nota de Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        * Estas proyecciones se basan en métricas promedio de la industria. Los resultados reales pueden variar según tu sector, audiencia y creatividad.
      </p>
    </div>
  );
};
