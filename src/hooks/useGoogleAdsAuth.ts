import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

export function useGoogleAdsAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we are returning from OAuth flow
  useEffect(() => {
    const handleAuthCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Error al conectar con Google Ads');
        // Clean URL
        searchParams.delete('error');
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        return;
      }

      if (code) {
        setIsConnecting(true);
        toast.loading('Finalizando conexión con Google...', { id: 'google-auth' });
        
        try {
          // 1. Get tokens from Edge Function
          const { data: authData, error: authError } = await supabase.functions.invoke('google-ads-auth', {
            body: { 
              action: 'exchangeCode', 
              code, 
              redirect_uri: `${window.location.origin}${location.pathname}` 
            }
          });

          if (authError) throw authError;

          // 2. Save integration in DB
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) throw new Error('No user found');

          const { error: dbError } = await supabase
            .from('user_integrations')
            .upsert({
              user_id: userData.user.id,
              platform: 'google_ads',
              access_token: authData.access_token,
              refresh_token: authData.refresh_token,
              // Note: Getting the actual customer_id might require a separate API call to Google
              // For now we just mark the connection as successful.
            }, {
              onConflict: 'user_id,platform'
            });

          if (dbError) throw dbError;

          toast.success('¡Google Ads conectado exitosamente!', { id: 'google-auth' });
          setIsConnected(true);
          
          // Clean URL
          searchParams.delete('code');
          searchParams.delete('scope');
          searchParams.delete('prompt');
          searchParams.delete('authuser');
          const newUrl = searchParams.toString() ? `${location.pathname}?${searchParams.toString()}` : location.pathname;
          navigate(newUrl, { replace: true });

        } catch (err: any) {
          console.error('Google Auth Error:', err);
          toast.error(`Error: ${err.message || 'No se pudo guardar la integración'}`, { id: 'google-auth' });
        } finally {
          setIsConnecting(false);
        }
      }
    };

    handleAuthCallback();
  }, [location, navigate]);

  // Check initial connection state
  useEffect(() => {
    const checkConnection = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('platform', 'google_ads')
        .single();
        
      if (data) {
        setIsConnected(true);
      }
    };
    checkConnection();
  }, []);

  const connectGoogleAds = async () => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-ads-auth', {
        body: { 
          action: 'getAuthUrl',
          redirect_uri: `${window.location.origin}${location.pathname}`
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al iniciar la conexión con Google Ads');
      setIsConnecting(false);
    }
  };

  return { isConnecting, isConnected, connectGoogleAds };
}
