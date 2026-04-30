import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataFlowVisualization } from "./DataFlowVisualization";

interface PremiumHeroProps {
  onContactClick?: () => void;
}

export const PremiumHero = ({ onContactClick }: PremiumHeroProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
      {/* FONDO GRADIENTE ANIMADO */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
        >
          {/* CONTENIDO IZQUIERDO */}
          <div className="space-y-8">
            {/* BADGE */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Inteligencia Operativa con IA
              </span>
              <Link
                to="/flowsight-ads"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Flowsight Ads NUEVO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* HEADLINE */}
            <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
              Tu IA para decisiones que{" "}
              <span className="text-gradient">multiplican ganancias</span>
            </motion.h1>

            {/* SUBHEADLINE */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Transformamos tus datos dispersos (Excel, POS, WhatsApp) en inteligencia operativa. Descubre con precisión dónde optimizar costos, disparar ventas y actuar hoy.
            </motion.p>

            {/* CARACTERÍSTICAS DESTACADAS */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-3">
              {["Insights impulsados por IA", "Decisiones rápidas y rentables", "Control total, sin esfuerzo"].map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-sm font-medium hover:bg-card/80 transition-colors"
                >
                  <Check className="w-4 h-4 text-primary" />
                  {feature}
                </span>
              ))}
            </motion.div>

            {/* BOTONES CTA */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                variant="hero"
                asChild
                className="group"
              >
                <a href="#contacto" onClick={onContactClick} className="flex items-center gap-2">
                  Solicitar diagnóstico gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group"
              >
                <a href="https://wa.me/message/FVHDA5OZHN66P1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Hablar por WhatsApp
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </div>

          {/* ELEMENTO 3D DERECHO - LIBERADO Y AMPLIADO */}
          <motion.div
            variants={itemVariants}
            className="relative h-[500px] md:h-[700px] flex items-center justify-center lg:-mr-20 xl:-mr-40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent blur-3xl opacity-30 pointer-events-none" />
            <DataFlowVisualization />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
