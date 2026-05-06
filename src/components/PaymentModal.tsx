import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  Loader2,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: string;
  campaignName?: string;
  amount?: number;
  currency?: string;
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  campaignId = 'flowsights-ads-kit',
  campaignName = 'Campaign Kit',
  amount = 4999,
  currency = 'USD',
}) => {
  const { initiateCheckout, loading } = useStripeCheckout();

  const handlePayment = async () => {
    await initiateCheckout({
      campaignId,
      amount,
      currency,
      successUrl: `${window.location.origin}/flowsight-ads/dashboard?payment=success&campaignId=${campaignId}`,
      cancelUrl: `${window.location.origin}/flowsight-ads/dashboard?payment=cancelled`,
    });
  };

  const validCurrency = currency && /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  
  let formattedAmount = '';
  try {
    formattedAmount = (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: validCurrency,
    });
  } catch (error) {
    formattedAmount = `$${(amount / 100).toFixed(2)}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] rounded-[40px] border border-white/10 bg-[#050505] shadow-[0_0_100px_-20px_rgba(16,185,129,0.3)] overflow-hidden p-0 gap-0">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[400px] h-[400px] blur-[120px] rounded-full opacity-20 bg-emerald-500" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] blur-[120px] rounded-full opacity-10 bg-emerald-600" />
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="p-10 pb-6 text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-emerald-500/40 rounded-full" />
                <div className="relative p-5 rounded-[24px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl border border-white/20">
                  <Zap className="w-10 h-10 fill-white" />
                </div>
              </div>
            </motion.div>

            <DialogHeader className="space-y-4">
              <DialogTitle className="text-4xl font-black text-center text-white tracking-tighter leading-tight">
                Desbloquea tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Campaign Kit</span>
              </DialogTitle>
              <DialogDescription className="text-center text-lg text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                Obtén acceso inmediato a toda la <span className="text-white font-bold">Estrategia Maestra</span> diseñada para <span className="text-white">{campaignName}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Benefits Section */}
          <div className="px-10 py-2">
            <div className="rounded-[32px] bg-white/[0.03] border border-white/5 p-8 space-y-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em] text-emerald-400/80">
                  ¿Qué incluye tu kit?
                </h4>
              </div>

              <ul className="space-y-4 relative z-10">
                {[
                  'Descarga de PDF Premium con todos los anuncios',
                  'Guía visual paso a paso para publicar',
                  'Acceso directo a las plataformas de Ads',
                  'Métricas de ROI proyectadas personalizadas'
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center gap-4 text-sm font-bold text-gray-300"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing & CTA Section */}
          <div className="p-10 pt-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inversión única</p>
                <p className="text-sm font-bold text-gray-300">Acceso de por vida al kit</p>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {formattedAmount}
                </span>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-5">
              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-9 text-xl font-black bg-emerald-500 hover:bg-emerald-400 text-black rounded-[24px] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group relative overflow-hidden border-0"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 relative z-10">
                    <CreditCard className="w-6 h-6" />
                    <span>Proceder al Pago</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-6 opacity-40">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <Lock className="w-5 h-5 text-emerald-500" />
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black flex items-center gap-2">
                  Pago seguro procesado por Stripe
                </p>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

