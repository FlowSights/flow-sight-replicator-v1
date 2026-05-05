import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
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
  const [fullResponse, setFullResponse] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Typing effect logic
  useEffect(() => {
    if (fullResponse) {
      setDisplayedResponse('');
      let index = 0;
      
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      
      typingTimerRef.current = setInterval(() => {
        if (index < fullResponse.length) {
          setDisplayedResponse((prev) => prev + fullResponse.charAt(index));
          index++;
        } else {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        }
      }, 15); // Adjust typing speed here
    }
  }, [fullResponse]);

  const handleAskGemini = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setIsOpen(true);
    setFullResponse(null);
    setDisplayedResponse('');
    
    try {
      logger.info("Enviando consulta a Gemini Pro Agent", { query }, "AIAgentBar");
      
      const systemPrompt = `Eres un experto estratega de marketing digital de FlowSights Ads. 
      Analiza la campaña actual y responde de forma ejecutiva y brillante.
      
      CAMPAÑA:
      - Negocio: ${context.businessName}
      - Promoción: ${context.promote}
      - Público: ${context.idealCustomer}
      - Anuncios: ${context.generatedAds.length} variantes.
      
      Responde de forma concisa (máximo 3 párrafos).`;

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ]
        }
      });

      if (error) throw error;
      setFullResponse(data.reply);
    } catch (err) {
      logger.error("Error en Gemini Agent", formatError(err), "AIAgentBar");
      setFullResponse("Hubo un error en la conexión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* Compact Translucent Glass Bar */}
      <form 
        onSubmit={handleAskGemini}
        className="relative flex items-center bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all group focus-within:bg-white/[0.06] focus-within:border-white/20"
      >
        {/* FlowSight Glass Icon */}
        <div className="relative mr-4 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <Sparkles className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          </div>
        </div>

        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pregunta a la IA sobre tu estrategia..."
          className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 p-0 h-auto text-sm font-medium tracking-tight"
        />

        <div className="flex items-center gap-3 ml-4">
          {query && !loading && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              type="submit"
              className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          )}
          {loading && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
        </div>
      </form>

      {/* AI Response Panel - Premium Style */}
      <AnimatePresence>
        {isOpen && (displayedResponse || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full mt-4 w-full bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[32px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.7)] z-[100]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Análisis Estratégico AI</span>
              </div>
              <button 
                onClick={() => { setIsOpen(false); setFullResponse(null); setDisplayedResponse(''); }}
                className="p-2 -mr-2 text-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-white/80 text-sm leading-relaxed font-medium min-h-[60px]">
              {displayedResponse}
              {loading && !displayedResponse && (
                <div className="flex gap-1.5 py-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" />
                </div>
              )}
              {loading && displayedResponse && <span className="inline-block w-1.5 h-4 ml-1 bg-emerald-500 animate-pulse align-middle" />}
            </div>

            {!loading && displayedResponse === fullResponse && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2"
              >
                {["Mejorar CTR", "Explicar Audiencia", "Variaciones"].map((btn) => (
                  <button 
                    key={btn}
                    onClick={() => { setQuery(`Dime cómo ${btn.toLowerCase()}`); handleAskGemini(); }}
                    className="text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  >
                    {btn}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
