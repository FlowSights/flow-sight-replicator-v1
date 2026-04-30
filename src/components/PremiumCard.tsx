import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  index?: number;
  glassEffect?: "light" | "medium" | "strong";
}

export const PremiumCard = ({
  children,
  className = "",
  hoverEffect = true,
  index = 0,
  glassEffect = "medium",
}: PremiumCardProps) => {
  const glassEffectClasses = {
    // Optimizamos las clases para móviles: menos blur y fondos ligeramente más opacos para evitar flickering
    light: "backdrop-blur-sm md:backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-sm",
    medium: "backdrop-blur-md md:backdrop-blur-xl bg-white/15 dark:bg-white/8 border border-white/25 dark:border-white/15 shadow-lg shadow-black/10 dark:shadow-black/30",
    strong: "backdrop-blur-lg md:backdrop-blur-2xl bg-white/20 dark:bg-white/12 border border-white/30 dark:border-white/20 shadow-2xl shadow-black/20 dark:shadow-black/40",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05, // Reducimos el delay para que sea más fluido
        duration: 0.4, 
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-50px" }}
      // Desactivamos el hover animado en móviles para evitar problemas de rendimiento
      whileHover={
        hoverEffect && window.innerWidth > 768
          ? {
              y: -12,
              boxShadow: "0 30px 80px -20px rgba(16, 185, 129, 0.25)",
            }
          : undefined
      }
      style={{ 
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        WebkitFontSmoothing: "antialiased"
      }}
      className={`
        relative rounded-2xl transition-all duration-300 group
        ${glassEffectClasses[glassEffect]}
        ${hoverEffect ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* EFECTO DE BORDE GRADIENTE AL HOVER - Solo visible en desktop */}
      {hoverEffect && (
        <div className="hidden md:block">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 pointer-events-none" />
        </div>
      )}

      {/* CONTENIDO */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
