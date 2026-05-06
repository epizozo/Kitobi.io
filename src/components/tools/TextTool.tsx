import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { generateText } from '../../lib/gemini';
import { motion } from 'motion/react';
import { Send, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TextToolProps {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  promptTemplate: (input: string) => string;
  placeholder: string;
  onProcess?: () => Promise<boolean>;
}

export const TextTool: React.FC<TextToolProps> = ({ id, name, description, icon, color, promptTemplate, placeholder, onProcess }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;
    
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setLoading(true);
    try {
      const result = await generateText(promptTemplate(input));
      setOutput(result || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout title={name} description={description} icon={icon} color={color}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full min-h-[500px]">
        <div className="space-y-6 flex flex-col">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Configuration de l'IA</label>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">En ligne</span>
            </div>
          </div>
          
          <div className="flex-1 relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full bg-app-bg border-2 border-app-border rounded-[32px] p-8 text-[15px] leading-relaxed text-app-fg placeholder:text-app-muted/30 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all resize-none font-medium"
            />
            <div className="absolute bottom-6 right-6">
               <div className="text-[10px] font-bold text-app-muted/50 bg-app-bg/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-app-border">
                {input.length} caractères
              </div>
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={loading || !input.trim()}
            className={cn(
              "w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all active:scale-95 group overflow-hidden relative",
              loading 
                ? "bg-app-fg/5 text-app-muted cursor-not-allowed" 
                : "bg-orange-500 text-white hover:bg-orange-600 shadow-2xl shadow-orange-500/30"
            )}
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Générer avec Kitobi AI</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Résultat généré</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-[10px] font-black text-app-muted hover:text-orange-500 transition-all uppercase tracking-widest group"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
                {copied ? 'Copié !' : 'Copier text'}
              </button>
            )}
          </div>
          
          <div className="flex-1 w-full bg-app-fg/[0.02] border-2 border-app-border rounded-[32px] p-8 text-[15px] leading-relaxed text-app-fg overflow-y-auto whitespace-pre-wrap font-medium relative italic selection:bg-orange-500/20">
            {output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert max-w-none"
              >
                {output}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <div className="w-16 h-16 rounded-full bg-app-fg/5 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">En attente de magie...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
