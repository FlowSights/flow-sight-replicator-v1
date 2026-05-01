import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowLeft, Sparkles, LogOut, Zap, Target, 
  Image as ImageIcon, BarChart3, Upload, X, 
  Check, Download, ExternalLink, Maximize2, 
  ChevronLeft, ChevronRight, MapPin, Users, 
  TrendingUp, ShieldCheck, Star, Rocket,
  Globe, MousePointer2, Layout, FileText,
  Lightbulb, Info, ArrowRight, MapPin as MapPinIcon,
  Upload as UploadIcon, X as XIcon, Sparkles as SparklesIcon,
  RefreshCw, Search, Activity, Eye, MousePointer, Camera,
  Moon, Sun, Building2, Link2, Globe2, CreditCard,
  FileDown, ZoomIn, Edit2
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { LocationInput } from '@/components/LocationInput';
import { motion, AnimatePresence } from 'framer-motion';
import { EditablePlatformPreview } from '@/components/EditablePlatformPreview';
import { VisualGuideLightbox } from '@/components/VisualGuideLightbox';
import { useCountUp } from '@/hooks/useCountUp';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { useInactivityTimeoutStrict } from '@/hooks/useInactivityTimeoutStrict';
import { PremiumLoadingScreen } from '@/components/PremiumLoadingScreen';
import { downloadPremiumCampaignKit } from '@/lib/premiumCampaignKitGenerator';
import { PaymentModal } from '@/components/PaymentModal';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { generateAdsWithGeminiIntegration } from '@/lib/dashboardIntegration';
import { useToast } from '@/hooks/use-toast';
import { MockupLightbox } from '@/components/MockupLightbox';

type HeroStat = { value: number; suffix: string; prefix?: string; label: string; decimals?: number };

const AnimatedStat = ({ stat, className = "font-display text-3xl font-bold text-gradient" }: { stat: HeroStat; className?: string }) => {
  const { value, ref } = useCountUp(stat.value, 1800, stat.decimals ?? 0);
  const formatted = (stat.decimals ?? 0) > 0 ? value.toFixed(stat.decimals) : Math.round(value).toString();
  return (
    <div>
      <div className={className}>
        <span ref={ref}>{stat.prefix ?? ""}{formatted}{stat.suffix}</span>
      </div>
      {stat.label ? <div className="text-sm text-muted-foreground mt-1">{stat.label}</div> : null}
    </div>
  );
};

interface GeneratedAd {
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  type: 'Offer' | 'Emotional' | 'Urgency';
  score: number;
  platformUrl: string;
  businessName?: string;
  websiteUrl?: string;
  reasoning?: string;
}

interface CampaignConfig {
  businessName: string;
  websiteUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  promote: string;
  location: string;
  idealCustomer: string;
  budget: number;
  userImage: string | null;
}

const FlowsightAdsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isGuideLightboxOpen, setIsGuideLightboxOpen] = useState(false);
  const [mockupLightboxOpen, setMockupLightboxOpen] = useState(false);
  const [currentMockupAdIndex, setCurrentMockupAdIndex] = useState(0);

  useEffect(() => {
    if (generatedAds.length > 0 && currentMockupAdIndex < generatedAds.length) {
      setSelectedPlatform(generatedAds[currentMockupAdIndex].platform);
    }
  }, [currentMockupAdIndex, generatedAds]);
  const { hasPaid } = usePaymentStatus();

  useInactivityTimeoutStrict(() => {
    setShowInactivityModal(true);
  });

  const [config, setConfig] = useState<CampaignConfig>({
    businessName: '',
    websiteUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    promote: '',
    location: '',
    idealCustomer: '',
    budget: 100,
    userImage: null,
  });

  const [selectedPlatform, setSelectedPlatform] = useState<"google" | "meta" | "tiktok" | "linkedin">("meta");

  const suggestions = [
    { label: "Membresía de Gimnasio", icon: "💪" },
    { label: "Consultoría de Negocios", icon: "📈" },
    { label: "Restaurante Gourmet", icon: "🍳" },
    { label: "Tienda de Ropa Online", icon: "👕" },
    { label: "Servicios de Limpieza", icon: "✨" },
    { label: "Agencia de Viajes", icon: "✈️" }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/flowsight-ads');
  };

  const handleInactivityTimeout = useCallback(async () => {
    setShowInactivityModal(true);
    await supabase.auth.signOut();
  }, []);

  useInactivityTimeout(handleInactivityTimeout, 10 * 60 * 1000);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/flowsight-ads');
        return;
      }
    };
    checkUser();
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig({ ...config, userImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      // Simular progreso para la pantalla de carga
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      const ads = await generateAdsWithGeminiIntegration(config, () => {});
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setGeneratedAds(ads);
        setShowResults(true);
        setIsLoading(false);
        toast({
          title: '✨ Estrategia Maestra Lista',
          description: 'Tu campaña ha sido optimizada por nuestra IA de alto rendimiento.',
        });
      }, 500);

    } catch (error: any) {
      console.error('Error generando anuncios:', error);
      setIsLoading(false);
      toast({
        title: 'Error al generar anuncios',
        description: error.message || 'Por favor, intenta de nuevo',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadMasterKit = () => {
    if (hasPaid) {
      downloadPremiumCampaignKit({
        businessName: config.businessName,
        businessDescription: config.promote,
        targetAudience: config.idealCustomer,
        websiteUrl: config.websiteUrl,
        ads: generatedAds,
      });
      toast({
        title: '✅ Full Campaign Kit Descargado',
        description: 'Tu paquete estratégico completo está listo.',
      });
    } else {
      setShowPaymentModal(true);
    }
  };

  const getPlatformStyle = (platform: string) => {
    const styles: Record<string, any> = {
      meta: {
        gradient: "from-blue-600/20 to-blue-400/20",
        border: "border-blue-500/30",
        accent: "bg-blue-600",
        text: "text-blue-500",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
        name: "Meta (Facebook/Instagram)"
      },
      google: {
        gradient: "from-blue-500/10 via-red-500/10 to-yellow-500/10",
        border: "border-blue-500/30",
        accent: "bg-blue-500",
        text: "text-blue-600",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\'G\'_logo.svg",
        name: "Google Ads"
      },
      tiktok: {
        gradient: "from-black/40 to-pink-500/20",
        border: "border-pink-500/30",
        accent: "bg-black",
        text: "text-pink-500",
        logo: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
        name: "TikTok Ads"
      },
      linkedin: {
        gradient: "from-blue-800/20 to-blue-600/20",
        border: "border-blue-700/30",
        accent: "bg-blue-800",
        text: "text-blue-700",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
        name: "LinkedIn Ads"
      }
    };
    return styles[platform] || styles.meta;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors selection:bg-emerald-500/30">
      <AnimatePresence>
        {isLoading && (
          <PremiumLoadingScreen isVisible={isLoading} progress={loadingProgress} />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 dark:bg-black/60 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white">
              Flowsight <span className="text-emerald-500">Ads</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-all">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button variant="ghost" onClick={handleLogout} className="font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all rounded-xl">
              <LogOut className="w-5 h-5 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <div className="max-w-2xl mx-auto">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                      Bienvenido a la <span className="text-emerald-500">nueva era</span> de la publicidad digital
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Empecemos por lo básico. ¿Cómo se llama tu negocio y dónde podemos encontrarlo en línea?</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">Nombre de tu Negocio</label>
                      <Input
                        placeholder="Ej: Flowsight"
                        value={config.businessName}
                        onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                        className="py-8 px-6 text-xl rounded-3xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">URL de tu Sitio Web</label>
                      <Input
                        placeholder="https://flowsight.com"
                        value={config.websiteUrl}
                        onChange={(e) => setConfig({ ...config, websiteUrl: e.target.value })}
                        className="py-8 px-6 text-xl rounded-3xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">URL de tu Instagram (Opcional)</label>
                      <Input
                        placeholder="https://instagram.com/flowsight"
                        value={config.instagramUrl}
                        onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                        className="py-8 px-6 text-xl rounded-3xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">URL de tu LinkedIn (Opcional)</label>
                      <Input
                        placeholder="https://linkedin.com/company/flowsight"
                        value={config.linkedinUrl}
                        onChange={(e) => setConfig({ ...config, linkedinUrl: e.target.value })}
                        className="py-8 px-6 text-xl rounded-3xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                      />
                    </div>

                    <Button
                      onClick={() => setStep(2)} 
                      disabled={!config.businessName}
                      className="w-full py-10 text-xl font-black bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl hover:scale-[1.02] transition-all"
                    >
                      Continuar <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                      ¿Qué quieres <span className="text-emerald-500">promover?</span>
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Describe tu producto, servicio o la oferta especial que tienes en mente.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">¿Qué quieres promover?</label>
                      <Textarea
                        placeholder="Ej: Un nuevo gimnasio con clases de spinning y yoga para principiantes."
                        value={config.promote}
                        onChange={(e) => setConfig({ ...config, promote: e.target.value })}
                        className="py-8 px-6 text-xl rounded-3xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">¿Dónde quieres promoverlo? (Opcional)</label>
                      <LocationInput
                        value={config.location}
                        onChange={(location) => setConfig({ ...config, location })}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">¿Quién es tu cliente ideal?</label>
                      <Textarea
                        placeholder="Ej: Mujeres de 25-45 años interesadas en fitness y bienestar."
                        value={config.idealCustomer}
                        onChange={(e) => setConfig({ ...config, idealCustomer: e.target.value })}
                        className="py-8 px-6 text-xl rounded-3xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">Presupuesto Diario Estimado</label>
                      <div className="flex items-center gap-4">
                        <Slider
                          min={10}
                          max={1000}
                          step={10}
                          value={[config.budget]}
                          onValueChange={(value) => setConfig({ ...config, budget: value[0] })}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={config.budget}
                          onChange={(e) => setConfig({ ...config, budget: parseFloat(e.target.value) })}
                          className="w-24 text-center py-2 px-2 rounded-xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep(3)}
                      disabled={!config.promote || !config.idealCustomer}
                      className="w-full py-10 text-xl font-black bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl hover:scale-[1.02] transition-all"
                    >
                      Continuar <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                      ¡Casi listo! <span className="text-emerald-500">Un último paso</span>
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Sube una imagen de tu producto o servicio para que la IA pueda crear anuncios visualmente atractivos.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50 dark:bg-white/5 relative">
                      {config.userImage ? (
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                          <img src={config.userImage} alt="Vista previa del usuario" className="w-full h-full object-cover" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 rounded-full"
                            onClick={() => setConfig({ ...config, userImage: null })}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">Arrastra y suelta tu imagen aquí, o</p>
                          <Button onClick={() => fileInputRef.current?.click()} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all">
                            Seleccionar Imagen
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                          />
                        </>
                      )}
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !config.userImage}
                      className="w-full py-10 text-xl font-black bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl hover:scale-[1.02] transition-all"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                          Generando Anuncios...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Sparkles className="w-6 h-6 mr-3" />
                          Generar Anuncios
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  ¡Tu estrategia de anuncios está <span className="text-emerald-500">lista!</span>
                </h2>
                <p className="text-xl text-gray-500 dark:text-gray-400">Hemos generado anuncios optimizados para tu negocio.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {generatedAds.map((ad, index) => (
                  <Card
                    key={index}
                    className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer group
                      ${selectedPlatform === ad.platform ? getPlatformStyle(ad.platform).border : "border-gray-100 dark:border-white/5"}
                      ${selectedPlatform === ad.platform ? getPlatformStyle(ad.platform).gradient : "bg-gray-50 dark:bg-white/5"}
                    `}
                    onClick={() => {
                      setCurrentMockupAdIndex(index);
                      setMockupLightboxOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <img src={getPlatformStyle(ad.platform).logo} alt={ad.platform} className="h-8" />
                      <span className={`text-sm font-bold ${getPlatformStyle(ad.platform).text}`}>{getPlatformStyle(ad.platform).name}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{ad.headline}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">{ad.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center"><Zap className="w-4 h-4 mr-1" /> {ad.type}</span>
                      <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" /> {ad.score.toFixed(1)}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                      <Maximize2 className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleDownloadMasterKit}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  <Download className="w-5 h-5 mr-2" /> Descargar Master Kit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsGuideLightboxOpen(true)}
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  <Lightbulb className="w-5 h-5 mr-2" /> Ver Guía Visual
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>

        <VisualGuideLightbox isOpen={isGuideLightboxOpen} onClose={() => setIsGuideLightboxOpen(false)} platform={generatedAds[currentMockupAdIndex]?.platform || selectedPlatform} />
        <MockupLightbox 
          isOpen={mockupLightboxOpen} 
          onClose={() => setMockupLightboxOpen(false)}
          ad={generatedAds[currentMockupAdIndex]}
          platform={generatedAds[currentMockupAdIndex]?.platform || selectedPlatform}
          onPrevious={() => setCurrentMockupAdIndex(prev => (prev === 0 ? generatedAds.length - 1 : prev - 1))}
          onNext={() => setCurrentMockupAdIndex(prev => (prev === generatedAds.length - 1 ? 0 : prev + 1))}
        />

        <AnimatePresence>
          {showInactivityModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg text-center max-w-md w-full"
              >
                <Info className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sesión Expirada</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Tu sesión ha expirado debido a inactividad. Por favor, inicia sesión de nuevo.</p>
                <Button onClick={() => navigate("/flowsight-ads")} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all">
                  Iniciar Sesión
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
      </main>
    </div>
  );
};

export default FlowsightAdsDashboard;
