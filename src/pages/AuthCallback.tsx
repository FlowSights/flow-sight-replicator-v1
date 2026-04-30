import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { AppleLoader } from "@/components/AppleLoader";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase maneja automáticamente el intercambio de tokens en la URL
        // Solo necesitamos verificar si ahora tenemos una sesión activa
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          // Si hay sesión, redirigimos al dashboard
          navigate("/flowsight-ads/dashboard", { replace: true });
        } else {
          // Si no hay sesión después del callback, algo salió mal
          // Redirigimos al login principal
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Error en el callback de autenticación:", error);
        navigate("/auth?error=callback_failed", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <AppleLoader onComplete={() => {}} />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Sincronizando tu cuenta...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
