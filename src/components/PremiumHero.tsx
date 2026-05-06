import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
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

  // Scale down and fade out the text as user scrolls down
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  // Scale up the background visual
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* INITIAL BLACK REVEAL OVERLAY */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 z-50 bg-black pointer-events-none"
      />

      {/* IMMERSIVE BACKGROUND VISUAL */}
      <motion.div 
        style={{ scale: bgScale }}
        className="absolute inset-0 z-0 flex items-center justify-center opacity-100 mix-blend-screen"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
          className="w-full h-full"
        >
          <DataFlowVisualization />
        </motion.div>
        {/* Dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)] pointer-events-none" />
      </motion.div>

      {/* FOREGROUND TEXT */}
      <motion.div 
        style={{ opacity: textOpacity, scale: textScale }}
        className="container relative z-10 pt-20"
      >
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Link
              to="/flowsight-ads"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white/80 text-sm font-medium hover:bg-white/10 transition-all"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Conoce Flowsight Ads
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tighter leading-[0.95] text-white"
          >
            Decisiones que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              multiplican ganancias.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-xl md:text-3xl text-white/50 max-w-3xl font-medium tracking-tight"
          >
            Inteligencia Operativa. Control total. <br className="hidden md:block"/>
            Sin adivinanzas.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mt-12"
          >
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold tracking-tight"
              asChild
            >
              <a href="#contacto" onClick={onContactClick}>
                Diagnóstico gratuito
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg tracking-tight backdrop-blur-md"
              asChild
            >
              <a href="https://wa.me/message/FVHDA5OZHN66P1" target="_blank" rel="noopener noreferrer">
                Hablemos por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
