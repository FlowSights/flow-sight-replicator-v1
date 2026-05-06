import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Sparkles, BookOpen, MessageSquare, ArrowRight } from "lucide-react";
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
      setIsCollapsed(scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          width: isCollapsed ? "min(90%, 1000px)" : "100%",
          top: isCollapsed ? "20px" : "0px",
        }}
        transition={{ 
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed left-0 right-0 mx-auto z-50 pointer-events-none"
      >
        <div
          className={`mx-auto pointer-events-auto transition-all duration-700 ease-[0.16,1,0.3,1] ${
            isCollapsed
              ? "px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              : "px-8 md:px-12 py-6 w-full bg-transparent border-b border-white/0"
          }`}
        >
          <div className="flex items-center justify-between gap-8">
            {/* LOGO */}
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 z-50 group"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="FlowSights"
                  className={`object-contain transition-all duration-500 group-hover:scale-110 ${
                    isCollapsed ? "w-6 h-6" : "w-8 h-8"
                  }`}
                />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className={`font-display font-black tracking-tighter text-white transition-all duration-500 ${isCollapsed ? "text-base" : "text-xl md:text-2xl"}`}>
                FlowSights
              </span>
            </Link>

            {/* DESKTOP NAV - THINNER & CLEANER */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.slice(0, isCollapsed ? 5 : navLinks.length).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-[13px] font-bold text-white/50 hover:text-white transition-all duration-300 rounded-full hover:bg-white/5 tracking-tight uppercase"
                >
                  <div className="flex items-center gap-2">
                    {link === navLinks[0] && (
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    )}
                    {link.label}
                  </div>
                </a>
              ))}
            </div>

            {/* CONTROLES DERECHA */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full transition-all duration-300 border ${
                  isOpen 
                    ? "bg-white text-black border-white" 
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* OVERLAY MENU - APPLE STYLE FULLSCREEN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black backdrop-blur-3xl overflow-y-auto"
          >
            <div className="container min-h-screen flex flex-col justify-center py-32">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 max-w-5xl mx-auto w-full">
                <div className="space-y-4">
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-8">Navegación</p>
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="group block"
                    >
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <span className="text-4xl md:text-6xl font-black text-white/40 group-hover:text-white group-hover:translate-x-4 transition-all duration-500 tracking-tighter">
                          {link.label}
                        </span>
                        <ArrowRight className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-10 group-hover:translate-x-0" />
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="space-y-12">
                  <div>
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">Contacto Directo</p>
                    <div className="space-y-6">
                      <a href="https://wa.me/message/FVHDA5OZHN66P1" className="block text-2xl font-bold text-white hover:text-primary transition-colors">WhatsApp Business</a>
                      <a href="mailto:contacto@flowsights.it.com" className="block text-2xl font-bold text-white hover:text-primary transition-colors">contacto@flowsights.it.com</a>
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
                    <h4 className="text-xl font-bold text-white mb-4">¿Listo para escalar?</h4>
                    <p className="text-white/50 mb-8 leading-relaxed">Únete a más de 150 empresas que ya están tomando decisiones basadas en datos reales.</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                    >
                      Comenzar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
