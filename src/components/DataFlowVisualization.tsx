import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export const DataFlowVisualization = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  useEffect(() => {
    const colors = ["#10b981", "#34d399", "#059669", "#6ee7b7"];
    // Aumentamos el número de partículas para mayor densidad
    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 60,
      y: Math.random() * 120 - 60,
      z: Math.random() * 200 - 100, // Mayor rango en Z para profundidad
      size: Math.random() * 4 + 1,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex items-center justify-center perspective-2000 select-none bg-transparent"
    >
      {/* CONTENEDOR DE LEVITACIÓN GLOBAL */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* CONTENEDOR 3D PRINCIPAL */}
        <motion.div
          style={{ 
            rotateX, 
            rotateY,
            x: mousePos.x * 40,
            y: mousePos.y * 40,
          }}
          className="relative w-72 h-72 md:w-[450px] md:h-[450px] preserve-3d"
        >
          {/* NÚCLEO DE IA - EFECTO DE PROFUNDIDAD MEJORADO */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotateZ: [0, 5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[30%] rounded-full bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 z-20 border-2 border-emerald-300/40 shadow-[0_0_80px_rgba(16,185,129,0.5)]"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent)]" />
            <div className="absolute -inset-16 rounded-full bg-emerald-500/15 blur-[60px] pointer-events-none" />
          </motion.div>

          {/* ANILLOS ORBITALES CON PERSPECTIVA */}
          {[0, 45, 90, 135].map((rotation, i) => (
            <motion.div
              key={i}
              animate={{ rotateZ: 360 }}
              transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
              style={{ 
                rotateX: rotation, 
                rotateY: rotation / 3,
                transformStyle: "preserve-3d"
              }}
              className="absolute inset-0 rounded-full border-[1.5px] border-emerald-500/20"
            >
              <motion.div 
                animate={{ 
                  scale: [0.7, 1.3, 0.7],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: i }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.9)]" 
                style={{ transform: "translateZ(20px)" }}
              />
            </motion.div>
          ))}

          {/* NUBE DE PARTÍCULAS CON PROFUNDIDAD REAL (Z-INDEX & SCALE) */}
          {particles.map((p) => {
            // Calculamos la escala y opacidad basada en Z para simular profundidad
            const scale = (p.z + 150) / 200; // Partículas más cerca (Z positivo) son más grandes
            const opacity = (p.z + 150) / 300; // Partículas más cerca son más opacas

            return (
              <motion.div
                key={p.id}
                animate={{
                  x: [p.x + "%", (p.x + 8) + "%", p.x + "%"],
                  y: [p.y + "%", (p.y - 8) + "%", p.y + "%"],
                  rotateZ: [0, 360],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "linear"
                }}
                className="absolute rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                style={{
                  width: p.size * scale,
                  height: p.size * scale,
                  backgroundColor: p.color,
                  opacity: opacity * 0.7,
                  left: "50%",
                  top: "50%",
                  transform: `translateZ(${p.z}px)`,
                  willChange: "transform, opacity"
                }}
              />
            );
          })}

          {/* LÍNEAS DE CONEXIÓN DINÁMICAS */}
          <svg className="absolute inset-[-30%] w-[160%] h-[160%] pointer-events-none opacity-20">
            {particles.slice(0, 8).map((p, i) => (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${50 + p.x}%`}
                y2={`${50 + p.y}%`}
                stroke="url(#lineGradient)"
                strokeWidth="0.8"
                animate={{ 
                  opacity: [0.1, 0.4, 0.1],
                  strokeDashoffset: [0, -20]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: i }}
                style={{ strokeDasharray: "5, 5" }}
              />
            ))}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>

      {/* ETIQUETA FLOTANTE MEJORADA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 relative" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-500">
            FlowSights Engine v2.0
          </span>
        </div>
      </motion.div>
    </div>
  );
};
