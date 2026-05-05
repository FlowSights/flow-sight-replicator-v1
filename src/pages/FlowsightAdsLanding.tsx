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
import { motion, AnimatePresence } from 'framer-motion';
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
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all flex items-center gap-3 group"
              >
                <div className="w-1 h-1 bg-white/40 rounded-full group-hover:w-4 group-hover:bg-cyan-400 transition-all" />
                Principal
              </Button>
            </div>
          </nav>
        </header>

        <section className="relative flex items-center justify-center min-h-screen px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[500px] relative"
          >
            {/* Metallic Card Frame */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-[40px] opacity-50" />
            
            <div className="relative p-10 lg:p-14 rounded-[40px] bg-black/40 backdrop-blur-[40px] border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Internal Bevel */}
              <div className="absolute inset-0 rounded-[40px] border border-white/5 pointer-events-none" />
              
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Flowsight Ads Intelligence</span>
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-2xl shadow-emerald-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-black font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    Flowsight <span className="text-emerald-500">Ads</span>
                  </h1>
                </motion.div>
                <p className="text-white/40 text-sm font-medium tracking-tight">Lanza tus campañas en todas las plataformas con IA</p>
              </div>

              <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${isLogin ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-white/40 hover:text-white'}`}
                >
                  Entrar
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${!isLogin ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-white/40 hover:text-white'}`}
                >
                  Unirse
                </button>
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl mb-8 text-[11px] font-black uppercase tracking-widest text-center ${messageType === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
                >
                  {message}
                </motion.div>
              )}

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Identidad Digital (Email)</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                      <Input 
                        type="email" 
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                        placeholder="john@company.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Clave de Acceso</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="h-16 pl-14 pr-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                        placeholder="••••••••" 
                        required 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-white text-black hover:bg-white/90 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] mt-4" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
                  </Button>

                  <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative px-6 bg-black text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Protocolo OAuth</span>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full h-16 bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3"
                    onClick={handleLoginWithGoogle}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 12 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google Sync
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Nombre Completo</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                      <Input 
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                        className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Email Corporativo</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                      <Input 
                        type="email" 
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold placeholder:text-white/10 text-white" 
                        placeholder="john@company.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Contraseña</label>
                      <Input 
                        type="password" 
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="h-16 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold text-white" 
                        required 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Confirmar</label>
                      <Input 
                        type="password" 
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="h-16 bg-white/[0.03] border-white/5 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm font-bold text-white" 
                        required 
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] mt-4" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear Cuenta"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </section>

        {/* Footer info */}
        <footer className="fixed bottom-8 inset-x-0 text-center pointer-events-none">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">FlowSights Ads Intelligence Pipeline</p>
        </footer>
      </div>
      </div>
    </>
  );
};

export default FlowsightAdsLanding;
