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
  Download, 
  CheckCircle2, 
  CreditCard,
  Loader2
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignName: string;
  amount: number;
  currency: string;
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  amount,
  currency,
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

  const formattedAmount = (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none bg-white dark:bg-gray-900 shadow-2xl overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
        
        <div className="p-8 space-y-6">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                <Zap className="w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-black text-center text-gray-900 dark:text-white">
              Desbloquea tu <span className="text-emerald-500">Campaign Kit</span>
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-500 dark:text-gray-400 mt-2">
              Estás a un paso de obtener todo el material profesional para tu campaña de <span className="font-bold text-gray-900 dark:text-white">{campaignName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> ¿Qué incluye este kit?
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Descarga de PDF Premium con todos los anuncios
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Guía visual paso a paso para publicar
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Acceso directo a las plataformas de Ads
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Métricas de ROI proyectadas personalizadas
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between px-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Total a pagar:</span>
              <span className="text-3xl font-black text-emerald-500">{formattedAmount}</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-8 text-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  Proceder al Pago
                </>
              )}
            </Button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Pago seguro procesado por Stripe
            </p>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
