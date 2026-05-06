import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { logger, formatError } from '@/lib/logger';

    location: string;
    generatedAds: any[];
    uploadedAssets?: any[];
  };
  hasPaid?: boolean;
  onUpdateAds?: (newAds: any[]) => void;
  onAddAssets?: (files: File[]) => void;
}

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-pulse">
    <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" 
      className="fill-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
      style={{ fill: 'url(#gemini-gradient)' }}
    />
    <defs>
      <linearGradient id="gemini-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
  </svg>
);

export const AIAgentBar: React.FC<AIAgentBarProps> = ({ context, hasPaid = true, onUpdateAds, onAddAssets }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullResponse, setFullResponse] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (fullResponse) {
      setDisplayedResponse('');
      let currentIndex = 0;
      
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      
      typingTimerRef.current = setInterval(() => {
        currentIndex++;
        // Usar substring garantiza que no se salten caracteres por desincronización de estado
        setDisplayedResponse(fullResponse.substring(0, currentIndex));
        
        if (currentIndex >= fullResponse.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        }
      }, 20);
    }
  }, [fullResponse]);

  const handleAskGemini = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setIsOpen(true);
    setFullResponse(null);
    setDisplayedResponse('');
    setQuery('');
    
      const systemPrompt = `Eres el cerebro estratégico de FlowSights. Tu objetivo es ayudar al usuario a optimizar su campaña en tiempo real.
      
      ACCIONES ESPECIALES:
      Si el usuario te pide cambiar los copys, textos o mejorar los anuncios, DEBES responder con tu análisis normal Y AL FINAL incluir un bloque JSON con el nuevo estado de los anuncios envuelto en etiquetas <update_ads>.
      Ejemplo: <update_ads>[{"headline": "Nuevo Titulo", "description": "Nueva Desc", "cta": "Comprar", "platform": "meta"}]</update_ads>
      
      CONTEXTO ACTUAL:
      CAMPAÑA: ${context.businessName}, Promoción: ${context.promote}.
      Anuncios actuales: ${JSON.stringify(context.generatedAds)}.
      Archivos subidos: ${context.uploadedAssets?.map(a => a.name).join(', ') || 'Ninguno aún'}.`;

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ]
        }
      });

      if (error) throw error;
      
      let cleanReply = (data.reply || '').trim();
      cleanReply = cleanReply.replace(/^\s*hla\b/i, 'Hola');

      // Detectar comando de actualización de anuncios
      const updateMatch = cleanReply.match(/<update_ads>([\s\S]*?)<\/update_ads>/);
      if (updateMatch && onUpdateAds) {
        try {
          const newAds = JSON.parse(updateMatch[1]);
          onUpdateAds(newAds);
          // Ocultar el JSON del usuario en la respuesta visual
          cleanReply = cleanReply.replace(/<update_ads>[\s\S]*?<\/update_ads>/, "\n\n✨ He actualizado los anuncios con estas mejoras.");
        } catch (e) {
          console.error("Error parsing ads update", e);
        }
      }
      
      setFullResponse(cleanReply);
    } catch (err) {
      setFullResponse("Error en la conexión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Ultra Translucent Glass Bar */}
      <form 
        onSubmit={handleAskGemini}
        className="relative flex items-center bg-white/[0.01] backdrop-blur-[60px] border border-white/[0.05] rounded-[24px] px-6 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all group hover:bg-white/[0.03] hover:border-white/10"
      >
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && onAddAssets) {
              onAddAssets(Array.from(e.target.files));
            }
          }}
        />
        
        <div className="flex items-center gap-3 mr-5 shrink-0">
          <div className="drop-shadow-[0_0_10px_rgba(79,172,254,0.4)]">
            <GeminiIcon />
          </div>
          <button
            type="button"
            disabled={!hasPaid}
            onClick={() => fileInputRef.current?.click()}
            className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all ${!hasPaid ? 'opacity-30 cursor-not-allowed' : 'opacity-60 hover:opacity-100'}`}
          >
            <span className="text-xl font-light text-cyan-400">+</span>
          </button>
        </div>

        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={hasPaid ? "Pregúntale a Gemini sobre tu campaña" : "🔒 Desbloquea para hablar con Gemini"}
          readOnly={!hasPaid}
          className={`bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 p-0 h-auto text-base font-medium tracking-tight shadow-none ${!hasPaid ? 'cursor-not-allowed' : ''}`}
          style={{ boxShadow: 'none' }}
        />

        <div className="flex items-center gap-3 ml-4">
          {query && !loading && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              type="submit"
              className="w-10 h-10 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Send className="w-6 h-6" />
            </motion.button>
          )}
          {loading && <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />}
        </div>
      </form>

      {/* Response Panel - Immersive Glass */}
      <AnimatePresence>
        {isOpen && (displayedResponse || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-6 w-full bg-[#050505]/60 backdrop-blur-[80px] border border-white/[0.03] rounded-[40px] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[100]"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Estratega Virtual Gemini</span>
              </div>
              <button 
                onClick={() => { setIsOpen(false); setFullResponse(null); setDisplayedResponse(''); }}
                className="p-3 -mr-3 text-white/5 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-white/70 text-base leading-relaxed font-medium min-h-[80px]">
              {displayedResponse}
              {loading && !displayedResponse && (
                <div className="flex gap-2 py-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-cyan-500/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
              {loading && displayedResponse && <span className="inline-block w-2 h-5 ml-2 bg-cyan-400 animate-pulse align-middle rounded-full" />}
            </div>

            {!loading && displayedResponse === fullResponse && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mt-10 pt-8 border-t border-white/[0.03] flex flex-wrap gap-3"
              >
                {["Optimizar CTR", "Análisis de Audiencia", "Nuevos Copys"].map((btn) => (
                  <button 
                    key={btn}
                    onClick={() => { setQuery(`Ayúdame a ${btn.toLowerCase()}`); handleAskGemini(); }}
                    className="text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] text-white/40 hover:text-white transition-all shadow-xl"
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
