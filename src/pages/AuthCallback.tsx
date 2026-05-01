import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { AppleLoader } from "@/components/AppleLoader";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        // Redirección simple basada en la URL actual
        const params = new URLSearchParams(window.location.search);
        const isAds = params.get('source') === 'ads' || window.location.href.includes('source=ads');

        if (session) {
          navigate(isAds ? "/flowsight-ads/dashboard" : "/", { replace: true });
        } else {
          navigate(isAds ? "/flowsight-ads" : "/auth", { replace: true });
        }
      } catch (err) {
        console.error("Auth error:", err);
        navigate("/auth", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <AppleLoader onComplete={() => {}} />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Cargando...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
