import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutOptions {
  campaignId: string;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initiateCheckout = async (options: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Debes iniciar sesión para realizar un pago');
      }

      // 1. Crear registro de pago en la tabla 'payments'
      // Validar si campaignId es un UUID válido, si no, no lo enviamos (será null)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(options.campaignId);
      
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: session.user.id,
          campaign_id: isUuid ? options.campaignId : null,
          amount_cents: options.amount,
          currency: options.currency,
          status: 'pending',
          metadata: { platform_hint: options.campaignId }
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // 2. Llamar a la Edge Function para crear la sesión de Stripe
      const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          ...options,
          userId: session.user.id,
        }
      });

      if (functionError) throw functionError;

      // 3. Actualizar el registro de pago con el stripe_session_id
      await supabase
        .from('payments')
        .update({ stripe_session_id: data.sessionId })
        .eq('id', payment.id);

      // 4. Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('No se pudo cargar Stripe');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;

    } catch (err: any) {
      console.error('Error en Checkout:', err);
      setError(err.message);
      toast({
        title: "Error al iniciar el pago",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { initiateCheckout, loading, error };
};
