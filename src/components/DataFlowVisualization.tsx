import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const DataFlowVisualization = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Generar partículas de datos
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  const containerVariants = {
    animate: {
      scale: isHovered ? 1.05 : 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const floatVariants = (delay: number) => ({
    animate: {
      y: [0, -20, 0],
      x: [0, Math.sin(delay) * 10, 0],
      transition: {
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
  });

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* FONDO GRADIENTE SUTIL */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 rounded-3xl" />

      {/* CONTENEDOR PRINCIPAL */}
      <motion.div
        variants={containerVariants}
        animate="animate"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer"
      >
        {/* NÚCLEO CENTRAL - Representa la IA */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute inset-1/3 rounded-full bg-gradient-to-br from-primary via-primary/60 to-primary/30 shadow-2xl shadow-primary/50"
        />

        {/* ANILLO EXTERIOR 1 - Órbita de datos */}
        <motion.div
          variants={orbitVariants}
          animate="animate"
          className="absolute inset-0 rounded-full border-2 border-primary/30 opacity-50"
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary/50" />
        </motion.div>

        {/* ANILLO EXTERIOR 2 - Órbita secundaria (rotación inversa) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border border-primary/20 opacity-30"
        >
          <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary/60 transform translate-x-1/2 translate-y-1/2" />
        </motion.div>

        {/* PARTÍCULAS DE DATOS FLOTANTES */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            variants={floatVariants(particle.delay)}
            animate="animate"
            className="absolute rounded-full bg-gradient-to-br from-primary to-primary/40 shadow-lg shadow-primary/30"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${50 + particle.x}%`,
              top: `${50 + particle.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* LÍNEAS DE CONEXIÓN DINÁMICAS */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Líneas conectando el núcleo con los puntos de órbita */}
          <motion.line
            x1="200"
            y1="200"
            x2="200"
            y2="50"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.line
            x1="200"
            y1="200"
            x2="350"
            y2="200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.line
            x1="200"
            y1="200"
            x2="200"
            y2="350"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.line
            x1="200"
            y1="200"
            x2="50"
            y2="200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </svg>

        {/* EFECTO DE GLOW ADICIONAL AL HOVER */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
          />
        )}
      </motion.div>

      {/* TEXTO DESCRIPTIVO DEBAJO (Responsivo) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center px-4 md:px-0"
      >
        <p className="text-xs md:text-sm text-muted-foreground font-medium">
          <span className="text-primary font-semibold">IA impulsada</span> transformando datos en decisiones
        </p>
      </motion.div>
    </div>
  );
};
