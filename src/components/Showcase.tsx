import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3 as BarChartIcon, 
  Layout as LayoutIcon, 
  Activity as ActivityIcon, 
  Brain as BrainIcon,
  ArrowRight as ArrowRightIcon
} from "lucide-react";
import showcase1 from "@/assets/showcase-1.png";
import showcase2 from "@/assets/showcase-2.webp";
import showcase3 from "@/assets/showcase-3.png";
import showcase4 from "@/assets/showcase-4.png";

const showcaseItems = [
  {
    title: "Dashboard de Ventas e Ingresos",
    description: "Visualización en tiempo real de ingresos mensuales, estado de ventas y rendimiento por categoría. Diseñado para identificar tendencias y cuellos de botella de forma inmediata.",
    image: showcase1,
    tags: ["Power BI", "Ventas", "Análisis Mensual"],
    icon: BarChartIcon,
    color: "text-sky-500",
    bg: "bg-sky-500/10"
  },
  {
    title: "Monitor de Operaciones en Tiempo Real",
    description: "Control total de la planta: potencia de salida, eficiencia energética y ahorro de CO2. Incluye alertas predictivas y consejos de optimización de costos.",
    image: showcase2,
    tags: ["Operaciones", "Energía", "IoT"],
    icon: LayoutIcon,
    color: "text-violet-500",
    bg: "bg-violet-500/10"
  },
  {
    title: "Panel de Gestión para Retail",
    description: "Control operativo para cadenas de supermercados. Monitoreo de reducción de costos, precisión de datos y detección automática de insights como duplicados de stock y oportunidades de ahorro logístico.",
    image: showcase3,
    tags: ["Retail", "Logística", "Insights IA"],
    icon: ActivityIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Mapa de Habilidades y Talento",
    description: "Análisis estratégico de capital humano. Identificación de habilidades en riesgo de obsolescencia frente a demandas emergentes, permitiendo una planificación de capacitación basada en datos.",
    image: showcase4,
    tags: ["RRHH", "Estrategia", "Talento"],
    icon: BrainIcon,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  }
];

export const Showcase = () => {
  return (
    <section id="showcase" className="py-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10" />

      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary uppercase tracking-wider"
          >
            Showcase
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mt-3"
          >
            Qué hacemos y <span className="text-gradient">cómo lo hacemos</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 text-lg"
          >
            Transformamos datos complejos en herramientas visuales simples que impulsan decisiones estratégicas. Aquí algunos ejemplos de soluciones que hemos implementado.
          </motion.p>
        </div>

        <div className="grid gap-12">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className={`overflow-hidden glass-card border-border/50 hover:border-primary/30 transition-all duration-500 group`}>
                <div className={`grid lg:grid-cols-2 gap-0`}>
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className={`w-12 h-12 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-secondary/50 text-xs font-medium">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-semibold group/link cursor-pointer">
                      Ver detalles del proyecto 
                      <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className={`relative aspect-video lg:aspect-auto overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
