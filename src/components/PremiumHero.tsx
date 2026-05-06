import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
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
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  return (
    <section ref={containerRef} className="relative min-h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-white/20">
      {/* CINEMATIC LIGHTING */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary/5 blur-[160px] rounded-full opacity-50" />
      </div>

      {/* CORE VISUAL - FLOATING CENTER PIECE */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 z-0 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full max-w-7xl"
        >
          <DataFlowVisualization />
        </motion.div>
        {/* Apple-style soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
      </motion.div>

      {/* CONTENT LAYER */}
      <motion.div 
        style={{ opacity: textOpacity, scale: textScale }}
        className="container relative z-10 flex flex-col items-center"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-10"
        >
          <Link
            to="/flowsight-ads"
            className="group relative flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">Conoce Flowsight Ads</span>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </motion.div>

        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[140px] font-black tracking-[-0.06em] leading-[0.85] text-white"
          >
            Decisiones que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
              multiplican.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="text-xl md:text-3xl text-white/40 max-w-2xl mx-auto font-medium tracking-tight leading-relaxed pt-6"
          >
            Inteligencia Operativa. Control total. <br className="hidden md:block"/>
            Sin adivinanzas, solo resultados.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-16"
        >
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 rounded-full px-12 py-8 text-xl font-bold tracking-tight shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <a href="#contacto" onClick={onContactClick}>
              Diagnóstico gratuito
            </a>
          </Button>
          
          <Link 
            to="/diagnostico"
            className="group flex items-center gap-2 text-white/60 hover:text-white text-lg font-bold transition-all"
          >
            Ver cómo funciona
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
      </motion.div>
    </section>
  );
};
