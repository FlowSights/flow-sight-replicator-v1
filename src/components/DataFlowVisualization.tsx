import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Electron {
  id: number;
  orbitId: number;
  speed: number;
  delay: number;
  color: string;
  size: number;
}

export const DataFlowVisualization = () => {
  const [electrons, setElectrons] = useState<Electron[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  useEffect(() => {
    // Titanium / Silver palette
    const colors = ["#ffffff", "#f8fafc", "#cbd5e1", "#94a3b8"];
    
    // Create many more electrons for a denser, more complex look
    const newElectrons: Electron[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      orbitId: i % 6, // 6 complex orbits
      speed: 8 + Math.random() * 12, // Faster, varied speeds
      delay: Math.random() * -20,
      color: colors[i % colors.length],
      size: 2 + Math.random() * 4, // Varied sizes
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

  // More orbits with complex 3D starting positions
  const orbits = [
    { rx: 75, ry: 0, rz: 0, duration: 20 },
    { rx: 75, ry: 60, rz: 0, duration: 25 },
    { rx: 75, ry: 120, rz: 0, duration: 22 },
    { rx: 75, ry: 180, rz: 0, duration: 28 },
    { rx: 75, ry: 240, rz: 0, duration: 18 },
    { rx: 75, ry: 300, rz: 0, duration: 24 }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex items-center justify-center perspective-2000 select-none bg-transparent"
    >
      {/* MASSIVE GLOW BEHIND THE ATOM */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]" />
      </div>

      {/* GLOBAL LEVITATION */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* MAIN 3D CONTAINER */}
        <motion.div
          style={{ 
            rotateX, 
            rotateY,
            x: mousePos.x * 40,
            y: mousePos.y * 40,
          }}
          className="relative w-80 h-80 md:w-[600px] md:h-[600px] preserve-3d"
        >
          {/* DARK TITANIUM CORE */}
          <div className="absolute inset-[38%] rounded-full z-20 border border-white/40 shadow-[0_0_150px_rgba(255,255,255,0.4)] preserve-3d"
            style={{ 
              transform: "translateZ(0px)",
              background: "radial-gradient(circle at 30% 30%, #475569 0%, #0f172a 50%, #000000 100%)"
            }}
          >
            {/* Core inner glow */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.4),transparent_50%)]" />
            {/* Pulsing core energy */}
            <motion.div 
              animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-white/30"
            />
          </div>

          {/* COMPLEX ROTATING ORBITS */}
          {orbits.map((orbit, i) => (
            <motion.div
              key={i}
              animate={{ rotateZ: [0, 360] }}
              transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 preserve-3d"
            >
              <div
                className="absolute inset-0 rounded-full border-[1px] border-white/10 preserve-3d"
                style={{ 
                  transform: `rotateX(${orbit.rx}deg) rotateY(${orbit.ry}deg)` 
                }}
              >
                {/* ORBIT GLOW */}
                <div className="absolute inset-0 rounded-full border-[2px] border-white/5 blur-[2px]" />

                {/* ELECTRONS ON THIS ORBIT */}
                {electrons.filter(e => e.orbitId === i).map((electron) => (
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
                    {/* Electron Particle */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                      style={{ 
                        width: electron.size,
                        height: electron.size,
                        transform: `rotateX(${-orbit.rx}deg) rotateY(${-orbit.ry}deg)`, // Billboarding
                        background: electron.color,
                      }}
                    />
                    {/* Electron Trail/Glow */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[4px]"
                      style={{ 
                        width: electron.size * 4,
                        height: electron.size * 4,
                        background: electron.color,
                        opacity: 0.8,
                        transform: `rotateX(${-orbit.rx}deg) rotateY(${-orbit.ry}deg)`,
                      }}
                    />
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[4px]"
                      style={{ 
                        width: electron.size * 3,
                        height: electron.size * 3,
                        background: electron.color,
                        opacity: 0.5,
                        transform: `rotateX(${-orbit.rx}deg) rotateY(${-orbit.ry}deg)`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* METALLIC LABEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/70">
            Inteligencia Central
          </span>
        </div>
      </motion.div>
    </div>
  );
};
