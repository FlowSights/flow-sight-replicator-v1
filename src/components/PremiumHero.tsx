import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronRight, Layout, BarChart3, Database, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataFlowVisualization } from "./DataFlowVisualization";
import { useRef } from "react";

interface PremiumHeroProps {
  onContactClick?: () => void;
}

export const PremiumHero = ({ onContactClick }: PremiumHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  const geminiGradient = "bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] animate-gradient-flow bg-[length:200%_auto]";

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-white/20 pt-32 md:pt-0">
      {/* BACKGROUND VISUAL - PUSHED TO THE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30">
          <DataFlowVisualization />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* CONTENT - EXPANDED HORIZONTALLY */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="container relative z-10 px-8 md:px-16"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-20">
          
          {/* LEFT SIDE: THE MESSAGE */}
          <div className="max-w-4xl space-y-12 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Link
                to="/flowsight-ads"
                className={`group relative inline-flex items-center gap-3 px-8 py-3 rounded-full text-white font-black uppercase tracking-[0.2em] text-[11px] ${geminiGradient} shadow-[0_0_40px_rgba(66,133,244,0.3)] transition-all hover:scale-105 active:scale-95`}
              >
                <Sparkles className="w-4 h-4 text-white" />
                Flowsight Ads — Impulsado por IA
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[130px] font-black tracking-[-0.06em] leading-[0.85] text-white"
            >
              Decisiones <br />
              <span className="text-white/20">reales.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="text-xl md:text-3xl text-white/50 max-w-2xl font-medium tracking-tight leading-relaxed"
            >
              Transformamos el caos en control absoluto. No más adivinanzas, solo datos que multiplican tus ganancias.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center gap-8"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 rounded-full px-12 py-9 text-2xl font-black tracking-tight shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all hover:scale-105"
                asChild
              >
                <a href="#contacto" onClick={onContactClick}>
                  Diagnóstico gratis
                </a>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT SIDE: THE "HERO MENU" (Interactive list) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:max-w-md space-y-4"
          >
            <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-8 text-center lg:text-left">Soluciones Estratégicas</p>
            
            {[
              { icon: Layout, title: "Flowsight Ads", desc: "Campañas ganadoras con IA." },
              { icon: Database, title: "Limpieza de Datos", desc: "Unifica tu inventario y ventas." },
              { icon: BarChart3, title: "Insights 48h", desc: "Detecta fugas de dinero rápido." },
              { icon: MessageSquare, title: "Soporte VIP", desc: "Consultoría directa 24/7." }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="group flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.02] border border-white/5 cursor-pointer transition-all duration-500"
              >
                <div className="p-3 rounded-2xl bg-white/5 text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-sm text-white/40 font-medium">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-white/10 group-hover:text-white transition-all" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* DECORATIVE LIGHTING */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </section>
  );
};
