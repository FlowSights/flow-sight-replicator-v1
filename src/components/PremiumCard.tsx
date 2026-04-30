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
  // Definición de estilos Morphic Glass Premium
  // Eliminamos los grises y usamos blancos/negros puros con alta transparencia y desenfoque
  const glassEffectClasses = {
    light: `
      backdrop-blur-md 
      bg-white/40 dark:bg-black/20 
      border border-white/40 dark:border-white/10 
      shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
    `,
    medium: `
      backdrop-blur-xl 
      bg-white/60 dark:bg-black/40 
      border border-white/50 dark:border-white/15 
      shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    `,
    strong: `
      backdrop-blur-2xl 
      bg-white/80 dark:bg-black/60 
      border border-white/60 dark:border-white/20 
      shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.6)]
    `,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.5, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={
        hoverEffect && typeof window !== 'undefined' && window.innerWidth > 768
          ? {
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }
          : undefined
      }
      style={{ 
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
      className={`
        relative rounded-3xl transition-all duration-500 group overflow-hidden
        ${glassEffectClasses[glassEffect]}
        ${hoverEffect ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* REFLEJO DE LUZ SUPERIOR (Efecto Cristal) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-white/5 to-transparent pointer-events-none" />
      
      {/* EFECTO DE RESPLANDOR AL HOVER - Solo en Desktop */}
      {hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        </div>
      )}

      {/* CONTENIDO */}
      <div className="relative z-10 h-full">{children}</div>
      
      {/* BORDE INTERNO SUTIL (Inner Glow) */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/5 pointer-events-none" />
    </motion.div>
  );
};
