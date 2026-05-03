import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Sparkles, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface NavLink {
  label: string;
  href: string;
}

interface DynamicNotchProps {
  navLinks: NavLink[];
  logo: string;
}

export const DynamicNotch = ({ navLinks, logo }: DynamicNotchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Umbral más alto para evitar cambios constantes en móviles
      setIsCollapsed(scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* NOTCH DINÁMICO - OPTIMIZADO PARA EVITAR FLICKERING */}
      <motion.nav
        initial={false}
        animate={{
          width: isCollapsed ? "min(95%, 800px)" : "100%",
          // Eliminamos la animación de 'y' que suele causar saltos en móviles
        }}
        transition={{ 
          duration: 0.6, // Más rápido para evitar sensación de lag
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ willChange: "width, transform" }}
        className={`fixed top-4 left-0 right-0 mx-auto z-40 ${
          isCollapsed ? "rounded-full" : "rounded-none"
        }`}
      >
        <div
          className={`relative transition-all duration-500 ease-out ${
            isCollapsed
              ? "px-4 py-2 rounded-full bg-background/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20"
              : "px-6 md:px-8 py-4 md:py-5 w-full bg-background/40 backdrop-blur-xl border-b border-white/5"
          }`}
          style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsOpen(false);
              }}
              className="flex items-center gap-2 font-display font-bold text-foreground text-lg md:text-xl hover:opacity-80 transition-opacity flex-shrink-0 z-50"
            >
              <img
                src={logo}
                alt="FlowSights"
                className={`object-contain transition-all duration-500 ${
                  isCollapsed ? "w-7 h-7" : "w-8 h-8 md:w-10 md:h-10"
                }`}
              />
              <span className={`transition-all duration-500 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                FlowSights
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, isCollapsed ? 4 : navLinks.length).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-all duration-300 rounded-lg hover:bg-white/5 ${
                    isCollapsed ? "text-[11px] px-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {link === navLinks[0] && (
                      <Sparkles className={`text-primary transition-all duration-500 ${isCollapsed ? "w-3 h-3" : "w-4 h-4"}`} />
                    )}
                    <span>{link.label}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* MOBILE QUICK ACTIONS - OPTIMIZADAS */}
            <div className="flex lg:hidden items-center gap-1.5 flex-1 justify-end">
              <Link 
                to="/flowsight-ads" 
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-tight whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ads</span>
              </Link>
              <Link 
                to="/blog" 
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-foreground/70 text-[10px] font-bold uppercase tracking-tight whitespace-nowrap"
              >
                <BookOpen className="w-3 h-3" />
                <span>Blog</span>
              </Link>
              <a 
                href="#contacto" 
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-foreground/70 text-[10px] font-bold uppercase tracking-tight whitespace-nowrap"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat</span>
              </a>
            </div>

            {/* CONTROLES DERECHA */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className={`text-foreground transition-all ${isCollapsed ? "w-5 h-5" : "w-6 h-6"}`} />
                ) : (
                  <Menu className={`text-foreground transition-all ${isCollapsed ? "w-5 h-5" : "w-6 h-6"}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MENÚ DESPLEGABLE */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-md z-30"
            />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`fixed left-0 right-0 z-30 bg-background/95 backdrop-blur-3xl border-b border-white/10 ${
                isCollapsed ? "top-20 mx-auto w-[95%] rounded-3xl border shadow-2xl" : "top-0 pt-24"
              }`}
            >
              <div className="container py-8 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={handleNavClick}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {link.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="my-6 border-t border-white/10" />

                <div className="flex flex-col gap-3">
                  <a
                    href="#contacto"
                    onClick={handleNavClick}
                    className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-center shadow-lg shadow-primary/20"
                  >
                    Solicitar diagnóstico
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
