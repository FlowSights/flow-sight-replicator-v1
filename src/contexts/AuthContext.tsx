import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  useEffect(() => {
    // Set listener FIRST, then fetch existing session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Inactivity Auto-Logout (3 min) & Strict Session ---
  useEffect(() => {
    if (!session) return;

    const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("Cerrando sesión por inactividad (3 min)");
        toast.warning("Sesión expirada", { 
          description: "Has sido desconectado por inactividad (3 min)." 
        });
        signOut();
      }, INACTIVITY_TIMEOUT);
    };

    // Events to track activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Force logout on page refresh or close
    const handleBeforeUnload = () => {
      // Limpiar sessionStorage asegura que la sesión de Supabase se pierda al refrescar
      sessionStorage.clear();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Initial start
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};