import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { Instagram } from "@/components/icons/Instagram";
import { useEffect } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/flowsights_cr/";

export const InstagramFeed = () => {
  useEffect(() => {
    // Cargar el script de Instagram para embeber posts
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Si Instagram ya está cargado, procesar embeds
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }

    return () => {
      // Limpiar el script si es necesario
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Instagram className="w-4 h-4" /> Instagram
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              ¿Ya nos sigues en <span className="text-gradient">Instagram</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compartimos consejos diarios sobre optimización de procesos, análisis de datos y cómo hacer crecer tu negocio.
            </p>
          </motion.div>
        </div>

        {/* Instagram Feed Embebido */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <iframe
              src="https://www.instagram.com/flowsights_cr/embed"
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              className="rounded-xl shadow-lg"
            ></iframe>
          </motion.div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold rounded-full hover:shadow-lg transition-all hover:scale-105"
          >
            Ver más en @flowsights_cr
          </a>
        </div>
      </div>
    </section>
  );
};
