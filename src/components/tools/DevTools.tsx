import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileJson, 
  Binary, 
  Check, 
  X, 
  Copy, 
  RefreshCw, 
  Code2, 
  Database,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ title, description, icon: Icon, color, children }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", (color as any).replace('text-', 'bg-').concat('/10'))}>
        {(() => { const Comp = Icon as any; return <Comp className={cn("w-6 h-6", color)} />; })()}
      </div>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>
    </div>
    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8">
      {children}
    </div>
  </div>
);

export const JSONValidator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formatted, setFormatted] = useState('');

  const validate = async () => {
    if (!input.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    try {
      const parsed = JSON.parse(input);
      setFormatted(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setFormatted('');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(formatted);
  };

  return (
    <ToolLayout 
      title="Validateur JSON" 
      description="Vérifiez, formatez et validez vos fichiers JSON instantanément."
      icon={FileJson}
      color="text-yellow-600"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Collez votre JSON ici</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{ "key": "value" }'
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 h-48 font-mono text-xs focus:outline-none focus:border-yellow-600 transition-colors resize-none"
          />
        </div>
        <button
          onClick={validate}
          className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Valider & Formater
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        {formatted && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest">
                <Check className="w-4 h-4" />
                JSON Valide
              </div>
              <button onClick={copy} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Copy className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <pre className="bg-white/5 border border-white/10 rounded-2xl p-6 text-xs font-mono overflow-x-auto text-zinc-300">
              {formatted}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export const Base64Tool: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = async () => {
    if (!input.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput('Erreur: Format invalide.');
    }
  };

  return (
    <ToolLayout 
      title="Base64 Tool" 
      description="Encodez ou décodez vos chaînes de caractères en Base64."
      icon={Binary}
      color="text-purple-600"
    >
      <div className="space-y-6">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            onClick={() => setMode('encode')}
            className={cn(
              "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
              mode === 'encode' ? "bg-purple-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Encoder
          </button>
          <button
            onClick={() => setMode('decode')}
            className={cn(
              "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
              mode === 'decode' ? "bg-purple-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Décoder
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Entrée</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 h-32 font-mono text-xs focus:outline-none focus:border-purple-600 transition-colors resize-none"
          />
        </div>

        <button
          onClick={process}
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <ArrowRightLeft className="w-5 h-5" />
          {mode === 'encode' ? 'Encoder' : 'Décoder'}
        </button>

        {output && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <label className="text-sm font-medium text-zinc-400">Résultat</label>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-xs font-mono break-all text-zinc-300">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
