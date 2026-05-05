import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Wrench, ChevronDown, Mic, Send, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { logger, formatError } from '@/lib/logger';

interface AIAgentBarProps {
  context: {
    businessName: string;
    promote: string;
    idealCustomer: string;
    location: string;
    generatedAds: any[];
  };
}

export const AIAgentBar: React.FC<AIAgentBarProps> = ({ context }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAskGemini = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setIsOpen(true);
    
    try {
      logger.info("Enviando consulta a Gemini Agent", { query }, "AIAgentBar");
      
      const systemPrompt = `Eres un experto estratega de marketing digital de la plataforma FlowSights Ads. 
      Tu objetivo es ayudar al usuario a interpretar su campaña actual.
      
      CONTEXTO DE LA CAMPAÑA:
      - Negocio: ${context.businessName}
      - Promoción: ${context.promote}
      - Público Objetivo: ${context.idealCustomer}
      - Ubicación: ${context.location}
      - Anuncios Generados: ${JSON.stringify(context.generatedAds.map(ad => ({ platform: ad.platform, headline: ad.headline, score: ad.score })))}
      
      Responde de forma concisa, profesional y estratégica. Usa un tono que empodere al usuario.`;

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ]
        }
      });

      if (error) throw error;
      setResponse(data.reply);
    } catch (err) {
      logger.error("Error en Gemini Agent", formatError(err), "AIAgentBar");
      setResponse("Lo siento, tuve un problema al procesar tu consulta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={containerRef}>
      {/* Search Bar Pill */}
      <form 
        onSubmit={handleAskGemini}
        className="relative flex items-center bg-[#1a1a1b] hover:bg-[#202124] border border-white/5 rounded-full px-6 py-4 shadow-2xl transition-all group focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <div className="flex items-center gap-3 text-white/40 mr-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-[1px]">
            <div className="w-full h-full bg-[#1a1a1b] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pregunta a Gemini sobre tu estrategia..."
          className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 p-0 h-auto text-sm font-medium"
        />

        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-2 text-white/40 border-r border-white/10 pr-4">
            <Plus className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Wrench className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Herramientas</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white/40 cursor-pointer hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Rápido</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <Mic className="w-4 h-4 text-white/40 cursor-pointer hover:text-white transition-colors" />
            {query && !loading && (
              <motion.button 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                type="submit"
                className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-black"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            )}
            {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
          </div>
        </div>
      </form>

      {/* AI Response Panel */}
      <AnimatePresence>
        {isOpen && (response || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 w-full bg-[#1a1a1b] border border-white/10 rounded-[28px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Gemini Strategy Agent</span>
              </div>
              <button 
                onClick={() => { setIsOpen(false); setResponse(null); }}
                className="text-white/20 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[70%] animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[80%] animate-pulse" />
              </div>
            ) : (
              <div className="text-white/90 text-sm leading-relaxed font-medium">
                {response}
              </div>
            )}

            {!loading && (
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                <button 
                  onClick={() => { setQuery("¿Cómo puedo mejorar el CTR?"); handleAskGemini(); }}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  Mejorar CTR
                </button>
                <button 
                  onClick={() => { setQuery("Explica la audiencia"); handleAskGemini(); }}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  Explicar Audiencia
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
