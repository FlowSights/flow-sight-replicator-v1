import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff, Info, Zap, Target, Rocket, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'motion/react';
import { AppleLoader } from '@/components/AppleLoader';
import { logger, formatError } from '@/lib/logger';

const ADS_AUTH_INTENT_KEY = "flowsight_ads_auth_intent";

const FlowsightAdsLanding: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
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
      logger.info("Iniciando sesión con contraseña (Ads)", { email: loginData.email }, "AdsLanding");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) {
        const structured = formatError(error);
        logger.error("Error en login con contraseña (Ads)", structured, "AdsLanding");
        throw error;
      }
      if (data.session) {
        logger.info("Login exitoso (Ads)", { userId: data.user.id }, "AdsLanding");
        navigate('/flowsight-ads/dashboard');
      }
    } catch (error: any) {
      setMessageType('error');
      setMessage(error.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      logger.info("Iniciando OAuth con Google (Ads)", { origin: window.location.origin }, "AdsLanding");
      sessionStorage.setItem(ADS_AUTH_INTENT_KEY, "true");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin + '/auth/callback?source=ads',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) {
        const structured = formatError(error);
        logger.error("Error al iniciar OAuth con Google (Ads)", structured, "AdsLanding");
        throw error;
      }
    } catch (error: any) {
      sessionStorage.removeItem(ADS_AUTH_INTENT_KEY);
      setMessageType('error');
      setMessage(error.message || 'Error al iniciar sesión con Google');
      logger.error("Excepción en handleLoginWithGoogle (Ads)", error, "AdsLanding");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.fullName.trim() || registerData.fullName.length < 2) {
      setMessageType('error');
      setMessage('El nombre debe tener al menos 2 caracteres');
      return;
    }
    
    if (registerData.password.length < 8) {
      setMessageType('error');
      setMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (!/[A-Z]/.test(registerData.password) || !/[0-9]/.test(registerData.password)) {
      setMessageType('error');
      setMessage('La contraseña debe contener mayúsculas y números');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setMessageType('error');
      setMessage('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    try {
      logger.info("Iniciando registro de nuevo usuario (Ads)", { email: registerData.email }, "AdsLanding");
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
      
      if (error) {
        const structured = formatError(error);
        logger.error("Error en registro (Ads)", structured, "AdsLanding");
        throw error;
      }
      
      setMessageType('success');
      setMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      setRegisterData({ email: '', password: '', confirmPassword: '', fullName: '', phone: '', address: '' });
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
        {showLoader && (
          <AppleLoader onComplete={() => setShowLoader(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#020202] flex flex-col transition-colors selection:bg-emerald-500/30 relative overflow-hidden">
        {/* Background Glows */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[25%] w-[700px] h-[700px] bg-emerald-500/[0.04] blur-[180px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[140px] rounded-full" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-sm font-bold tracking-wide"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Volver a la web principal
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[480px]"
          >
            {/* Logo */}
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-2xl shadow-emerald-500/25 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white">
                  Flowsight <span className="text-emerald-500">Ads</span>
                </h1>
              </motion.div>
              <p className="text-gray-500 text-sm font-medium">Lanza tus campañas en todas las plataformas con IA</p>
            </div>

            <div className="rounded-[40px] border border-white/[0.06] shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-[#0A0A0A]/80 backdrop-blur-3xl p-10 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-[200px] bg-gradient-to-t from-emerald-500/[0.02] to-transparent pointer-events-none" />

              {/* Tab Switcher */}
              <div className="flex gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/5 mb-10 relative z-10">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-black text-sm transition-all ${isLogin ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25' : 'text-gray-500 hover:text-white'}`}
                >
                  Entrar
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-black text-sm transition-all ${!isLogin ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25' : 'text-gray-500 hover:text-white'}`}
                >
                  Unirse
                </button>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl mb-6 text-sm font-bold relative z-10 ${messageType === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                  {message}
                </div>
              )}

              <div className="relative z-10">
                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        <Input 
                          type="email" 
                          placeholder="nombre@empresa.com" 
                          className="h-16 pl-14 bg-white/[0.03] border-white/[0.06] rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all text-base font-bold placeholder:text-gray-700 text-white" 
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          className="h-16 pl-14 pr-14 bg-white/[0.03] border-white/[0.06] rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all text-base font-bold placeholder:text-gray-700 text-white" 
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-400 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-black text-base font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] uppercase tracking-widest" disabled={loading}>
                      {loading ? 'Accediendo...' : 'Iniciar Sesión'}
                    </Button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/[0.05]"></span></div>
                      <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="bg-[#0A0A0A]/80 px-4 text-gray-600">O continuar con</span></div>
                    </div>

                    <Button type="button" variant="outline" className="w-full h-16 rounded-2xl border-white/10 bg-black hover:bg-white/[0.04] flex items-center justify-center gap-3 font-bold text-base text-white transition-all" onClick={handleLoginWithGoogle}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 12 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continuar con Google
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        <Input 
                          placeholder="Juan Pérez" 
                          className="h-16 pl-14 bg-white/[0.03] border-white/[0.06] rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all text-base font-bold placeholder:text-gray-700 text-white" 
                          value={registerData.fullName}
                          onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        <Input 
                          type="email" 
                          placeholder="nombre@empresa.com" 
                          className="h-16 pl-14 bg-white/[0.03] border-white/[0.06] rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all text-base font-bold placeholder:text-gray-700 text-white" 
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                          <Input 
                            type="password" 
                            className="h-16 pl-14 bg-white/[0.03] border-white/[0.06] rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all text-base font-bold placeholder:text-gray-700 text-white" 
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirmar</Label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                          <Input 
                            type="password" 
                            className="h-16 pl-14 bg-white/[0.03] border-white/[0.06] rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all text-base font-bold placeholder:text-gray-700 text-white" 
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-black text-base font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] uppercase tracking-widest mt-2" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FlowsightAdsLanding;
