import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { 
  Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, 
  Zap, Target, Rocket, BarChart3, ChevronRight, CheckCircle2,
  Database, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { AppleLoader } from '@/components/AppleLoader';
import { logger, formatError } from '@/lib/logger';
import { DataFlowVisualization } from '@/components/DataFlowVisualization';

const ADS_AUTH_INTENT_KEY = "flowsight_ads_auth_intent";

const FlowsightAdsLanding: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
  });

  const geminiGradient = "bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] animate-gradient-flow bg-[length:200%_auto]";

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          logger.error("Error al verificar sesión inicial", formatError(error), "AdsLanding");
          return;
        }
        if (session) {
          logger.info("Sesión activa detectada, redirigiendo al dashboard", { userId: session.user.id }, "AdsLanding");
          navigate('/flowsight-ads/dashboard');
        }
      } catch (err) {
        logger.error("Excepción al verificar sesión inicial", err, "AdsLanding");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;
      if (data.session) navigate('/flowsight-ads/dashboard');
    } catch (error: any) {
      setMessageType('error');
      setMessage(error.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      sessionStorage.setItem(ADS_AUTH_INTENT_KEY, "true");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin + '/auth/callback?source=ads'
        },
      });
      if (error) throw error;
    } catch (error: any) {
      sessionStorage.removeItem(ADS_AUTH_INTENT_KEY);
      setMessageType('error');
      setMessage(error.message || 'Error al iniciar sesión con Google');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            full_name: registerData.fullName.trim(),
            phone: registerData.phone.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?source=ads`,
        },
      });
      if (error) throw error;
      setMessageType('success');
      setMessage('¡Registro exitoso! Revisa tu correo.');
    } catch (error: any) {
      setMessageType('error');
      setMessage(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLoader && <AppleLoader onComplete={() => setShowLoader(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden">
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center backdrop-blur-xl border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 transition-all">
              <ArrowRight className="w-4 h-4 rotate-180 text-white/50 group-hover:text-primary" />
            </div>
            <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors uppercase tracking-widest">Volver</span>
          </Link>
          <ThemeToggle />
        </header>

        {/* HERO SECTION - APPLE WIDE STYLE */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="absolute inset-0 z-0 opacity-40">
            <DataFlowVisualization />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          <div className="container relative z-10 px-8 md:px-16 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
              
              {/* LEFT: THE MESSAGE */}
              <div className="max-w-4xl space-y-12 text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <span className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-white font-black uppercase tracking-[0.2em] text-[10px] ${geminiGradient} shadow-[0_0_30px_rgba(66,133,244,0.2)]`}>
                    <Sparkles className="w-4 h-4" />
                    Nueva Era de Publicidad
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl md:text-8xl lg:text-[140px] font-black tracking-[-0.06em] leading-[0.85]"
                >
                  Domina <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">tus Ads.</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="text-xl md:text-3xl text-white/40 max-w-2xl font-medium tracking-tight leading-relaxed"
                >
                  Crea, optimiza y escala campañas en Meta, Google y TikTok con el poder de la Inteligencia Artificial.
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                  {[
                    { icon: Zap, label: "IA Real" },
                    { icon: Target, label: "ROI +40%" },
                    { icon: Rocket, label: "Escala" },
                    { icon: ShieldCheck, label: "Control" }
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-3">
                      <item.icon className="w-6 h-6 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: THE AUTH CARD */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-lg"
              >
                <Card className="border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Lock className="w-32 h-32 text-white" />
                  </div>

                  <div className="flex gap-2 mb-10 bg-white/5 p-1.5 rounded-2xl relative z-10">
                    <button 
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${isLogin ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
                    >
                      Entrar
                    </button>
                    <button 
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${!isLogin ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
                    >
                      Unirse
                    </button>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-tight ${messageType === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {message}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {isLogin ? (
                      <motion.form 
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleLogin} 
                        className="space-y-6 relative z-10"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Acceso</Label>
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input 
                              type="email" 
                              placeholder="Email" 
                              className="pl-14 py-8 rounded-2xl border-white/5 bg-white/5 text-white placeholder:text-white/20 focus:border-white/20" 
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Contraseña"
                              className="pl-14 pr-14 py-8 rounded-2xl border-white/5 bg-white/5 text-white placeholder:text-white/20 focus:border-white/20" 
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 py-9 text-xl font-black rounded-2xl shadow-xl transition-all active:scale-95" disabled={loading}>
                          {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                        
                        <div className="relative my-10">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-black px-4 text-white/20 text-center">O accede con</span></div>
                        </div>

                        <Button type="button" variant="outline" className="w-full py-8 rounded-2xl border-white/5 hover:bg-white/5 flex items-center justify-center gap-3 font-bold" onClick={handleLoginWithGoogle}>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 12 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Google
                        </Button>
                      </motion.form>
                    ) : (
                      <motion.form 
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleRegister} 
                        className="space-y-4 relative z-10"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Datos Personales</Label>
                          <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input 
                              placeholder="Nombre" 
                              className="pl-14 py-7 rounded-2xl border-white/5 bg-white/5 text-white" 
                              value={registerData.fullName}
                              onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input 
                              type="email" 
                              placeholder="Email" 
                              className="pl-14 py-7 rounded-2xl border-white/5 bg-white/5 text-white" 
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            type="password" 
                            placeholder="Contraseña"
                            className="py-7 rounded-2xl border-white/5 bg-white/5 text-white" 
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                          />
                          <Input 
                            type="password" 
                            placeholder="Confirmar"
                            className="py-7 rounded-2xl border-white/5 bg-white/5 text-white" 
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 py-8 text-lg font-black rounded-2xl transition-all" disabled={loading}>
                          {loading ? 'Creando...' : 'Crear Cuenta'}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES FOOTER */}
        <section className="py-20 border-t border-white/5 bg-black">
          <div className="container px-8 md:px-16 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: BarChart3, title: "Analytics Avanzado", desc: "Mide cada centavo invertido con reportes que sí se entienden." },
                { icon: Database, title: "Data Unificada", desc: "Tus campañas de todas las redes en un solo lugar." },
                { icon: Sparkles, title: "Estrategia IA", desc: "Deja que nuestra IA redacte y optimice tus anuncios." }
              ].map((f) => (
                <div key={f.title} className="flex gap-6 items-start">
                  <div className="p-4 rounded-2xl bg-white/5 text-primary">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black mb-2">{f.title}</h4>
                    <p className="text-sm text-white/40 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FlowsightAdsLanding;
