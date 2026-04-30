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
    light: "backdrop-blur-sm bg-card/40 border-border/30",
    medium: "backdrop-blur-xl bg-card/50 border-border/50",
    strong: "backdrop-blur-2xl bg-card/60 border-border/60",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={
        hoverEffect
          ? {
              y: -8,
              boxShadow: "0 20px 60px -20px hsl(var(--primary) / 0.3)",
            }
          : undefined
      }
      className={`
        relative rounded-2xl border transition-all duration-300
        ${glassEffectClasses[glassEffect]}
        ${hoverEffect ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* EFECTO DE BORDE GRADIENTE AL HOVER */}
      {hoverEffect && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* CONTENIDO */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
