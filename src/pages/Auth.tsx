import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";
import { ArrowLeft, Loader2, Mail, Lock, User as UserIcon, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { z } from "zod";
import { logger, formatError } from "@/lib/logger";

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(1, "Contraseña requerida").max(72),
});

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") || "/flowsight-ads/dashboard";
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, redirectTo, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ name, email, password });
        if (!parsed.success) {
          toast({ title: "Datos inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
          setLoading(false);
          return;
        }
        
        logger.info("Iniciando registro por email", { email: parsed.data.email }, "Auth");
        
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin + redirectTo,
            data: { full_name: parsed.data.name },
          },
        });
        
        if (error) {
          const structured = formatError(error);
          logger.error("Error en registro Supabase", structured, "Auth");
          throw error;
        }
        
        toast({ title: "¡Cuenta creada!", description: "Revisa tu correo para confirmar tu cuenta y luego inicia sesión." });
        setMode("signin");
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast({ title: "Datos inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
          setLoading(false);
          return;
        }
        
        logger.info("Iniciando sesión por email", { email: parsed.data.email }, "Auth");
        
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        
        if (error) {
          const structured = formatError(error);
          logger.error("Error en login Supabase", structured, "Auth");
          throw error;
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Error desconocido";
      toast({ title: "No pudimos completar la acción", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      logger.info("Iniciando OAuth con Google", { origin: window.location.origin }, "Auth");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) {
        const structured = formatError(error);
        logger.error("Error al iniciar OAuth con Google", structured, "Auth");
        throw error;
      }
    } catch (err: any) {
      const msg = err?.message || "Error al conectar con Google";
      toast({ title: "Error de autenticación", description: msg, variant: "destructive" });
    }
  };

  return (
    <>
      <SEO 
        title="Iniciar Sesión" 
        description="Accede a tu cuenta de FlowSights para gestionar tus proyectos de inteligencia operativa y limpieza de datos."
        url="/auth"
        noindex={true}
      />
      <div className="min-h-screen bg-[#000000] text-white selection:bg-cyan-500/30 overflow-hidden relative">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </div>

        <header className="fixed top-0 inset-x-0 z-50">
          <nav className="container max-w-7xl mx-auto flex items-center justify-between h-24 px-8">
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-white to-white/60 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">FlowSights</span>
            </Link>
            <div className="flex items-center gap-8">
              <ThemeToggle />
              <Link 
                to="/blog" 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all flex items-center gap-3 group"
              >
                <div className="w-1 h-1 bg-white/40 rounded-full group-hover:w-4 group-hover:bg-cyan-400 transition-all" />
                Blog
              </Link>
            </div>
          </nav>
        </header>

        <section className="relative flex items-center justify-center min-h-screen px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[460px] relative"
          >
            {/* Metallic Card Frame */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-[40px] opacity-50" />
            
            <div className="relative p-12 rounded-[40px] bg-black/40 backdrop-blur-[40px] border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Internal Bevel */}
              <div className="absolute inset-0 rounded-[40px] border border-white/5 pointer-events-none" />
              
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sistema Seguro v2.0</span>
                </motion.div>
                <h1 className="text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                  {mode === "signin" ? "Bienvenido" : "Crea tu ID"}
                </h1>
                <p className="text-white/40 text-sm font-medium tracking-tight">
                  {mode === "signin"
                    ? "Acceso exclusivo a la terminal de inteligencia."
                    : "Únete a la nueva era de la pauta publicitaria."}
                </p>
              </div>

              <div className="space-y-8">
                <Button 
                  type="button" 
                  className="w-full h-16 bg-white text-black hover:bg-white/90 rounded-2xl font-black flex items-center justify-center gap-4 transition-all text-sm group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 12 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <span className="relative px-6 bg-black text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Identidad Digital</span>
                </div>

                <form onSubmit={handleEmail} className="space-y-6">
                  {mode === "signup" && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Nombre Completo</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Correo Electrónico</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                        placeholder="john@company.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-[0_10px_30px_rgba(6,182,212,0.2)] mt-4" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "signin" ? "Acceder a Terminal" : "Registrar Identidad")}
                  </Button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-sm font-medium text-white/30">
                    {mode === "signin" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <button 
                      type="button" 
                      onClick={() => setMode(mode === "signin" ? "signup" : "signin")} 
                      className="text-white hover:text-cyan-400 transition-colors underline underline-offset-8 decoration-white/10"
                    >
                      {mode === "signin" ? "Crear ID" : "Iniciar Sesión"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer info */}
        <footer className="fixed bottom-8 inset-x-0 text-center pointer-events-none">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">FlowSights Core Authentication Pipeline</p>
        </footer>
      </div>
    </div>
    </>
  );
};
export default Auth;
