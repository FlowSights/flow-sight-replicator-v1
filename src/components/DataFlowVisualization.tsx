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
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#059669"];
    const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      z: Math.random() * 100 - 50,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 2,
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
      className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center perspective-1000 select-none"
    >
      {/* EFECTO DE LUZ AMBIENTAL */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* CONTENEDOR 3D PRINCIPAL */}
      <motion.div
        style={{ 
          rotateX, 
          rotateY,
          x: mousePos.x * 40,
          y: mousePos.y * 40,
        }}
        className="relative w-80 h-80 md:w-[450px] md:h-[450px] preserve-3d"
      >
        {/* NÚCLEO DE IA - EFECTO WOW */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 40px 10px rgba(16, 185, 129, 0.3)",
              "0 0 80px 20px rgba(16, 185, 129, 0.5)",
              "0 0 40px 10px rgba(16, 185, 129, 0.3)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-1/4 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 z-20"
        >
          {/* Brillo interno */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)]" />
        </motion.div>

        {/* ANILLOS ORBITALES 3D */}
        {[0, 45, 90, 135].map((rotation, i) => (
          <motion.div
            key={i}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ rotateX: rotation, rotateY: rotation / 2 }}
            className="absolute inset-0 rounded-full border border-emerald-500/20 preserve-3d"
          >
            <motion.div 
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, delay: i }}
              className="absolute top-0 left-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]" 
            />
          </motion.div>
        ))}

        {/* NUBE DE PARTÍCULAS DE DATOS */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              x: [p.x + "%", (p.x + 10) + "%", p.x + "%"],
              y: [p.y + "%", (p.y - 10) + "%", p.y + "%"],
              z: [p.z, p.z + 50, p.z],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
            className="absolute rounded-full blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              left: "50%",
              top: "50%",
            }}
          />
        ))}

        {/* LÍNEAS DE CONEXIÓN NEURALES */}
        <svg className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none opacity-20">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {particles.slice(0, 8).map((p, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${50 + p.x}%`}
              y2={`${50 + p.y}%`}
              stroke="url(#line-grad)"
              strokeWidth="1"
              filter="url(#glow)"
              animate={{ strokeDashoffset: [0, 100], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ strokeDasharray: "5, 5" }}
            />
          ))}
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </svg>
      </motion.div>

      {/* EFECTO DE PROFUNDIDAD DE CAMPO (BLUR EN LOS BORDES) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.2)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* ETIQUETA FLOTANTE PREMIUM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium tracking-widest uppercase text-emerald-500/80">
            Neural Data Engine Active
          </span>
        </div>
      </motion.div>
    </div>
  );
};
