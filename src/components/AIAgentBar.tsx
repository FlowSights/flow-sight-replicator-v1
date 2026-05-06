import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

interface AIAgentBarProps {
  context: {
    businessName: string;
    promote: string;
    idealCustomer: string;
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
      className="fill-cyan-400"
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
  const [isExpanded, setIsExpanded] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [isOpen]);

  useEffect(() => {
    if (fullResponse) {
      setDisplayedResponse('');
      let currentIndex = 0;
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      typingTimerRef.current = setInterval(() => {
        currentIndex++;
        setDisplayedResponse(fullResponse.substring(0, currentIndex));
        if (currentIndex >= fullResponse.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        }
      }, 5);
      return () => { if (typingTimerRef.current) clearInterval(typingTimerRef.current); };
    }
  }, [fullResponse]);



  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAskGemini = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setIsOpen(true);
    setIsExpanded(false);

    setFullResponse(null);
    setDisplayedResponse('');
    setQuery('');
    
    try {
      const systemPrompt = `Eres un Estratega de Marketing Senior experto en Ads.
CLIENTE: "${context.businessName}"
OBJETIVO: "${context.promote}"
AUDIENCIA: "${context.idealCustomer}"

TUS ANUNCIOS ACTUALES (Campaña Activa):
${JSON.stringify(context.generatedAds, null, 2)}

INSTRUCCIÓN TÉCNICA OBLIGATORIA:
Debes ser extremadamente directo y conciso. Evita introducciones largas. Ve directo al grano en no más de 3 líneas a menos que sea estrictamente necesario.
Si el usuario solo te saluda, devuélvele el saludo amablemente de forma muy breve y pregúntale cómo puedes optimizar sus campañas. NO generes anuncios si solo te saludan.
SOLO SI el usuario te pide crear o modificar anuncios, DEBES adjuntar AL FINAL DE TU RESPUESTA exactamente este bloque JSON envuelto en etiquetas XML (usa los símbolos menor que < y mayor que >), tomando como base los anuncios actuales y aplicando ÚNICAMENTE las mejoras solicitadas:

FORMATO EXACTO REQUERIDO:
<update_ads>[{"headline": "Tu Título Atractivo", "description": "Tu descripción persuasiva aquí", "cta": "Comprar ahora", "platform": "meta"}]</update_ads>

Nota: Solo envía las plataformas que fueron modificadas. No uses markdown dentro del bloque JSON.`;

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          messages: [
            { role: 'user', content: query || "Por favor, crea una nueva estrategia y optimiza los copys de mi campaña." }
          ],
          images: [],
          systemPrompt: systemPrompt
        }
      });

      if (error) throw error;
      
      let cleanReply = (data.reply || '').trim();
      const updateRegex = /[<(\[]update_ads[>)\]]([\s\S]*?)[<(\[]\/update_ads[>)\]]/gi;
      const matches = [...cleanReply.matchAll(updateRegex)];
      
      let hasUpdated = false;

      if (matches.length > 0 && onUpdateAds) {
        matches.forEach(match => {
          try {
            let content = match[1].trim();
            content = content.replace(/```json/gi, "").replace(/```/gi, "").trim();
            if (content) {
              onUpdateAds(JSON.parse(content));
              hasUpdated = true;
            }
          } catch (e) { console.error("JSON Parse Error:", e, content); }
        });
      } else if (onUpdateAds) {
        // Fallback robusto: Si la IA olvidó las etiquetas <update_ads>, buscar un array JSON crudo
        const rawJsonMatch = cleanReply.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (rawJsonMatch) {
          try {
            let content = rawJsonMatch[0].trim();
            content = content.replace(/```json/gi, "").replace(/```/gi, "").trim();
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].headline) {
              onUpdateAds(parsed);
              hasUpdated = true;
              // Remover el JSON crudo del texto para que no se vea feo
              cleanReply = cleanReply.replace(rawJsonMatch[0], "").trim();
            }
          } catch (e) { console.error("Raw JSON Parse Error:", e); }
        }
      }

      if (hasUpdated) {
        setShowSuccess(true);
      }

      cleanReply = cleanReply.replace(/[<(\[]update_ads[>)\]][\s\S]*?[<(\[]\/update_ads[>)\]]/gi, "").trim();
      cleanReply = cleanReply.replace(/```json[\s\S]*?```/gi, "").trim();
      
      if (hasUpdated && !cleanReply.includes("✨")) {
        cleanReply += "\n\n✨ He actualizado la estrategia con éxito.";
      }
      
      setFullResponse(cleanReply || "✨ He actualizado los anuncios con las mejoras solicitadas.");
    } catch (err) {
      console.error(err);
      setFullResponse("Error en la conexión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-14 right-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md z-50"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">¡Campaña actualizada por Gemini!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleAskGemini}
        className="relative flex flex-col bg-white/[0.01] backdrop-blur-[60px] border border-white/[0.05] rounded-[32px] p-2 shadow-[0_20px_80px_rgba(0,0,0,0.5)] transition-all group hover:bg-white/[0.03] hover:border-white/10"
      >
        <div className="flex items-center px-4 py-1.5">
          
          <div className="mr-3 shrink-0 drop-shadow-[0_0_12px_rgba(79,172,254,0.4)]">
            <GeminiIcon />
          </div>

          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hasPaid ? "Pregúntale a Gemini..." : "Desbloquea premium para usar la IA"}
            disabled={!hasPaid || loading}
            className="flex-1 bg-transparent border-none outline-none text-lg md:text-xl font-medium text-white placeholder:text-white/20 px-0 h-10 py-0 transition-all caret-white"
          />

          <div className="flex items-center gap-2 ml-3">
            <button 
              type="submit"
              disabled={!query.trim() || loading || !hasPaid}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                query.trim()
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/5 text-white/20'
              } disabled:opacity-50`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </form>

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

            <div className={`text-white/70 text-base leading-relaxed font-medium min-h-[80px] whitespace-pre-wrap ${!isExpanded ? 'line-clamp-4' : ''}`}>
              {displayedResponse}
              {loading && !displayedResponse && (
                <div className="flex gap-2 py-3">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-cyan-400/50"
                    />
                  ))}
                </div>
              )}
            </div>
            
            {fullResponse && fullResponse.length > 250 && !loading && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="mt-3 text-[10px] font-bold text-cyan-400/80 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                {isExpanded ? "Mostrar menos" : "Ver más"}
              </button>
            )}
            
            <div className="flex flex-wrap gap-3 mt-10">
              {['OPTIMIZAR CTR', 'ANÁLISIS DE AUDIENCIA', 'NUEVOS COPYS'].map(label => (
                <button
                  key={label}
                  onClick={() => setQuery(label.toLowerCase())}
                  className="px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-widest"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
