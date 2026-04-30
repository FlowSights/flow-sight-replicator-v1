import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Calendar, LogIn, LogOut, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { blogPosts } from "@/data/blog";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/PremiumCard";

const Blog = () => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors">
      <SEO 
        title="Blog de Inteligencia Operativa" 
        description="Artículos prácticos sobre cómo usar tus datos para vender más y gastar menos. Consejos sobre Excel, Dashboards e IA para PyMEs."
        url="/blog"
      />
      
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-white/80 dark:bg-black/60 border-b border-gray-100 dark:border-white/5">
        <nav className="container flex items-center justify-between h-20">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 font-display font-bold text-xl md:text-2xl hover:opacity-90 transition-opacity"
          >
            <img src={logo} alt="FlowSights logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <span className="text-gray-900 dark:text-white">FlowSights</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-gray-600 dark:text-gray-400">
                <LogOut className="w-4 h-4 mr-2" /> Salir
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-gray-600 dark:text-gray-400">
                <Link to="/auth?redirect=/blog"><LogIn className="w-4 h-4 mr-2" /> Entrar</Link>
              </Button>
            )}
            <Button variant="hero" size="sm" asChild>
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24">
        <section className="container max-w-5xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> Blog FlowSights
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Ideas para operar con <br />
              <span className="text-emerald-500">datos confiables</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-6 text-xl max-w-2xl leading-relaxed">
              Artículos cortos y prácticos sobre operaciones, calidad de datos y decisiones inteligentes para empresas en crecimiento.
            </p>
          </motion.div>
        </section>

        <section className="container max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <PremiumCard className="overflow-hidden h-full glass-card border-gray-100 dark:border-white/5 hover:border-emerald-500/50 transition-all duration-500 flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-white/5">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="absolute top-4 left-4 text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-500 text-white shadow-xl tracking-widest uppercase">GRATIS</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                        <span className="text-emerald-500">{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime}</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-emerald-500 transition-colors duration-300">{post.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                        <span className="flex items-center gap-1 text-emerald-500 group-hover:gap-2 transition-all duration-300">
                          LEER MÁS <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </PremiumCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 dark:border-white/5 py-12 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 FlowSights. Inteligencia Operativa para PyMEs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
