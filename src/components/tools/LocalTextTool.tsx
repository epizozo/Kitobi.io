import React, { useState, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { Play, Copy, Check, Hash } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface LocalTextToolProps {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  process: (input: string) => string;
  placeholder: string;
  actionLabel?: string;
  showLive?: boolean;
}

export const LocalTextTool: React.FC<LocalTextToolProps> = ({ 
  id, name, description, icon, color, process, placeholder, actionLabel = 'Traiter', showLive = false 
}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (showLive) {
      setOutput(process(input));
    }
  }, [input, showLive, process]);

  const handleProcess = () => {
    setOutput(process(input));
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
            <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Données locales</label>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Traitement Local</span>
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
                {input.split(/\s+/).filter(Boolean).length} mots
              </div>
            </div>
          </div>

          {!showLive && (
            <button
              onClick={handleProcess}
              className="w-full py-5 rounded-3xl bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-emerald-600 shadow-2xl shadow-emerald-500/30 transition-all active:scale-95 group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {actionLabel}
            </button>
          )}
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Résultat immédiat</label>
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
          
          <div className="flex-1 w-full bg-app-fg/[0.02] border-2 border-app-border rounded-[32px] p-8 text-[15px] leading-relaxed text-app-fg overflow-y-auto whitespace-pre-wrap font-mono relative selection:bg-blue-500/20">
            {output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {output}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <div className="w-16 h-16 rounded-full bg-app-fg/5 flex items-center justify-center">
                  <Hash className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">En attente de texte...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
