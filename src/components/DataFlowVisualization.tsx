import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Electron {
  id: number;
  orbitId: number;
  speed: number;
  size: number;
  delay: number;
  color: string;
}

export const DataFlowVisualization = () => {
  const [electrons, setElectrons] = useState<Electron[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  useEffect(() => {
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#ffffff"];
    // Creamos electrones para cada órbita
    const newElectrons: Electron[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      orbitId: i % 4, // 4 órbitas principales
      speed: Math.random() * 2 + 2, // Velocidad de rotación
      size: Math.random() * 4 + 3,
      delay: Math.random() * -20,
      color: colors[i % colors.length],
    }));
    setElectrons(newElectrons);
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
      {/* LEVITACIÓN GLOBAL */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* CONTENEDOR 3D */}
        <motion.div
          style={{ 
            rotateX, 
            rotateY,
            x: mousePos.x * 40,
            y: mousePos.y * 40,
          }}
          className="relative w-72 h-72 md:w-[450px] md:h-[450px] preserve-3d"
        >
          {/* NÚCLEO ATÓMICO (SOL DE DATOS) */}
          <div className="absolute inset-[35%] preserve-3d" style={{ transform: "translateZ(20px)" }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 40px rgba(16, 185, 129, 0.4)",
                  "0 0 80px rgba(16, 185, 129, 0.7)",
                  "0 0 40px rgba(16, 185, 129, 0.4)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-800 border border-emerald-200/30 relative"
            >
              {/* Brillo interno */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent)]" />
              {/* Aura */}
              <div className="absolute -inset-10 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            </motion.div>
          </div>

          {/* ÓRBITAS Y ELECTRONES */}
          {[
            { rx: 70, ry: 0, rz: 0 },
            { rx: 70, ry: 60, rz: 45 },
            { rx: 70, ry: -60, rz: -45 },
            { rx: 0, ry: 80, rz: 90 }
          ].map((orbit, orbitIdx) => (
            <div
              key={orbitIdx}
              className="absolute inset-0 preserve-3d"
              style={{ 
                transform: `rotateX(${orbit.rx}deg) rotateY(${orbit.ry}deg) rotateZ(${orbit.rz}deg)` 
              }}
            >
              {/* El anillo de la órbita */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
              
              {/* Electrones en esta órbita */}
              {electrons.filter(e => e.orbitId === orbitIdx).map((electron) => (
                <motion.div
                  key={electron.id}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ 
                    duration: electron.speed, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: electron.delay 
                  }}
                  className="absolute inset-0 preserve-3d"
                >
                  {/* El electrón propiamente dicho */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 preserve-3d"
                    style={{ transform: "rotateX(-90deg)" }} // Para que el electrón siempre mire al frente
                  >
                    {/* Cuerpo del electrón con brillo */}
                    <div 
                      className="rounded-full shadow-[0_0_15px_rgba(52,211,153,1)]"
                      style={{ 
                        width: electron.size, 
                        height: electron.size,
                        background: `radial-gradient(circle at 30% 30%, #ffffff, ${electron.color})`
                      }}
                    />
                    {/* Estela de luz (Trail) */}
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-t from-emerald-500/0 to-emerald-400/40 blur-[1px]"
                      style={{ transform: "rotate(180deg) translateY(6px)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ))}

          {/* DESTELLOS DE DATOS ALEATORIOS (FOTONES) */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: [Math.random() * 300 - 150, Math.random() * 300 - 150],
                y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
                z: [Math.random() * 200 - 100, Math.random() * 200 - 100]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 10 
              }}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ETIQUETA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.3)]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute inset-0" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 relative" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-emerald-400">
            Atomic Data Engine v3.0
          </span>
        </div>
      </motion.div>
    </div>
  );
};
