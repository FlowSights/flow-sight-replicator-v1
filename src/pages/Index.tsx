import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight, Check, Sparkles, Database, LineChart,
  Workflow, BarChart3, Activity, Factory, Truck, Hotel, UtensilsCrossed,
  Stethoscope, ShoppingBag, HardHat, Plus, ShieldCheck, Zap, Eye,
  TrendingUp, Clock, DollarSign, ChevronRight, Lock, Unlock, Zap as ZapIcon
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { LinkedIn } from "@/components/icons/LinkedIn";
import logo from "@/assets/logo.png";
import stevenPhoto from "@/assets/team-steven.jpg";
import marcosPhoto from "@/assets/team-marcos.png";
import oscarPhoto from "@/assets/team-oscar.png";
import { useState, useRef } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import SEO from "@/components/SEO";
import { DynamicNotch } from "@/components/DynamicNotch";
import { PremiumHero } from "@/components/PremiumHero";

const Index = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navLinks = [
    { label: "Flowsight Ads", href: "/flowsight-ads" },
    { label: "Servicios", href: "#servicios" },
    { label: "Industrias", href: "#industrias" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "#contacto" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: form,
      });
      if (error) throw error;
      setForm({ name: "", email: "", company: "", message: "" });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "No se pudo enviar",
        description: "Ocurrió un error. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Inteligencia Operativa para PyMEs"
        description="Transformamos datos en decisiones rentables. Limpieza de datos, dashboards y optimización de procesos."
      />

      <DynamicNotch navLinks={navLinks} logo={logo} />

      {/* SECTION 1: HERO */}
      <PremiumHero />

      {/* SECTION 2: THE PHILOSOPHY (Apple Style Text) */}
      <section className="py-40 bg-black">
        <div className="container px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-12"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Tu negocio genera datos. <br />
              Nosotros generamos <span className="text-white/40">claridad.</span>
            </h2>
            <p className="text-xl md:text-3xl text-white/50 max-w-3xl font-medium leading-relaxed">
              La mayoría de las empresas pierden el 20% de su margen en ineficiencias invisibles. No necesitas más software, necesitas mejores respuestas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: BENTO SERVICES */}
      <section id="servicios" className="py-40 bg-black">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
            {/* Main Service */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-8 md:row-span-2 rounded-[40px] bg-white/[0.03] border border-white/5 p-12 flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-xl text-primary">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">Core Intelligence</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Limpieza y <br/> Unificación.</h3>
                <p className="text-xl text-white/40 font-medium max-w-md">Eliminamos el caos. Una sola fuente de verdad para tu inventario, ventas y costos.</p>
              </div>
              <div className="relative z-10 flex gap-4">
                <Badge variant="outline" className="bg-white/5 border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Excel</Badge>
                <Badge variant="outline" className="bg-white/5 border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">POS</Badge>
                <Badge variant="outline" className="bg-white/5 border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">WhatsApp</Badge>
              </div>
              {/* Background Visual Decoration */}
              <div className="absolute bottom-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database className="w-64 h-64 text-white" />
              </div>
            </motion.div>

            {/* Insight Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-4 rounded-[40px] bg-[#111] border border-white/5 p-10 flex flex-col justify-between group"
            >
              <div>
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 w-fit mb-6">
                  <ZapIcon className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-black mb-3 italic">Insights en 48h.</h4>
                <p className="text-sm text-white/40 font-medium">Detectamos fugas de dinero antes de que se conviertan en crisis.</p>
              </div>
              <ArrowRight className="w-8 h-8 text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
            </motion.div>

            {/* Dashboard Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-4 rounded-[40px] bg-white/[0.03] border border-white/5 p-10 flex flex-col justify-between"
            >
              <div>
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 w-fit mb-6">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-black mb-3 tracking-tight">Dashboards Ejecutivos.</h4>
                <p className="text-sm text-white/40 font-medium">Visualización simple de lo que realmente importa.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE "X" FACTOR - STATS */}
      <section className="py-40 bg-black border-y border-white/5">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { val: "-30%", label: "Costos Operativos", desc: "Reducción promedio en mermas y fugas ocultas." },
              { val: "10x", label: "Velocidad de Decisión", desc: "De reportes mensuales a respuestas en segundos." },
              { val: "95%", label: "Precisión de Datos", desc: "Confianza total en cada número que ves." }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-4"
              >
                <div className="text-6xl md:text-8xl font-black tracking-tighter text-white">{stat.val}</div>
                <h5 className="text-xl font-bold uppercase tracking-[0.2em] text-primary">{stat.label}</h5>
                <p className="text-white/40 font-medium leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: INDUSTRIAS (Clean Grid) */}
      <section id="industrias" className="py-40 bg-black">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none">Industrias.</h2>
            <p className="text-xl text-white/40 max-w-md font-medium leading-relaxed">Expertos en manufactura, logística, retail y servicios de alta escala.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Factory, name: "Manufactura" },
              { icon: Truck, name: "Logística" },
              { icon: ShoppingBag, name: "Retail" },
              { icon: UtensilsCrossed, name: "Gastronomía" },
              { icon: Hotel, name: "Hotelería" },
              { icon: Stethoscope, name: "Clínicas" },
              { icon: HardHat, name: "Construcción" },
              { icon: ShieldCheck, name: "Servicios" }
            ].map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] transition-all duration-500 flex flex-col gap-8"
              >
                <ind.icon className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
                <span className="text-xl font-black text-white/60 group-hover:text-white transition-colors">{ind.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT (Minimalist Apple Style) */}
      <section id="contacto" className="py-40 bg-black">
        <div className="container px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-12">Hablemos.</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-medium focus:outline-none focus:border-white/20 transition-all"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-medium focus:outline-none focus:border-white/20 transition-all"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
            </div>
            <textarea 
              placeholder="¿En qué podemos ayudarte?" 
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-lg font-medium focus:outline-none focus:border-white/20 transition-all resize-none"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              required
            />
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full py-8 rounded-2xl bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              {submitting ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
          {submitted && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-primary font-bold"
            >
              ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
            </motion.p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5">
        <div className="container px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FlowSights" className="w-8 h-8 opacity-50" />
            <span className="font-black tracking-tighter text-white/50">FlowSights</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-sm text-white/20 font-medium">© 2026 FlowSights.it.com. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

const Badge = ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
    {children}
  </span>
);

export default Index;
