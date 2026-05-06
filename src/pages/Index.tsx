import { Button } from "@/components/ui/button";
import {
  Database, BarChart3, Factory, Truck, ShoppingBag, UtensilsCrossed,
  Hotel, Stethoscope, HardHat, ShieldCheck, Zap as ZapIcon, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { DynamicNotch } from "@/components/DynamicNotch";
import { PremiumHero } from "@/components/PremiumHero";

const Index = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
      setForm({ name: "", email: "", message: "" });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Inteligencia Operativa"
        description="Transformamos datos en decisiones rentables."
      />

      <DynamicNotch navLinks={navLinks} logo={logo} />

      {/* HERO SECTION */}
      <PremiumHero />

      {/* PHILOSOPHY SECTION - WIDE LAYOUT */}
      <section className="py-40 bg-black">
        <div className="container px-8 md:px-16 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col lg:flex-row justify-between gap-16"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] lg:max-w-4xl">
              Tu negocio genera datos. <br />
              Nosotros generamos <span className="text-white/20">claridad.</span>
            </h2>
            <div className="lg:max-w-md lg:pt-8">
              <p className="text-xl md:text-2xl text-white/40 font-medium leading-relaxed">
                La mayoría de las empresas pierden el 20% de su margen en ineficiencias invisibles. No necesitas más software, necesitas mejores respuestas.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES BENTO - WIDE LAYOUT */}
      <section id="servicios" className="py-40 bg-black">
        <div className="container px-8 md:px-16 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[400px] md:auto-rows-[500px]">
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
              <div className="absolute bottom-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database className="w-64 h-64 text-white" />
              </div>
            </motion.div>

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
                <h4 className="text-2xl font-black mb-3 tracking-tight">Dashboards.</h4>
                <p className="text-sm text-white/40 font-medium">Visualización simple de lo que realmente importa.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-40 bg-black border-y border-white/5">
        <div className="container px-8 md:px-16 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { val: "-30%", label: "Costos Operativos" },
              { val: "10x", label: "Velocidad" },
              { val: "95%", label: "Precisión" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-4"
              >
                <div className="text-7xl md:text-9xl font-black tracking-tighter text-white">{stat.val}</div>
                <h5 className="text-xl font-bold uppercase tracking-[0.2em] text-primary">{stat.label}</h5>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industrias" className="py-40 bg-black">
        <div className="container px-8 md:px-16 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none">Industrias.</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] transition-all duration-500"
              >
                <ind.icon className="w-8 h-8 text-white/20 group-hover:text-primary mb-8" />
                <span className="text-xl font-black text-white/60 group-hover:text-white">{ind.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contacto" className="py-40 bg-black">
        <div className="container px-8 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-12">Hablemos.</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
            </div>
            <textarea 
              placeholder="Mensaje" 
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-lg resize-none"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              required
            />
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full py-8 rounded-2xl bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-gray-200"
            >
              {submitting ? "Enviando..." : "Enviar"}
            </Button>
          </form>
          {submitted && <p className="mt-6 text-primary font-bold">¡Enviado!</p>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5">
        <div className="container px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FlowSights" className="w-8 h-8 opacity-50" />
            <span className="font-black tracking-tighter text-white/50">FlowSights</span>
          </div>
          <p className="text-sm text-white/20 font-medium">© 2026 FlowSights.it.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
