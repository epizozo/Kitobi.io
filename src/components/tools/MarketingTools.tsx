import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Linkedin, 
  Instagram, 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  Send,
  Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../../lib/utils';

import { getAI } from '../../lib/ai';
const ai = getAI();

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

export const LinkedInGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [audience, setAudience] = useState('entrepreneurs');
  const [lang, setLang] = useState('français');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!topic) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère un post LinkedIn viral en ${lang} sur le sujet suivant : "${topic}". 
        Le ton doit être ${tone} et la cible est ${audience}. 
        Inclus des emojis et des hashtags pertinents. 
        Structure le post avec une accroche forte, un corps de texte aéré et un appel à l'action clair.`,
      });
      setResult(response.text || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="LinkedIn Post Generator" 
      description="Créez des posts engageants et viraux pour votre réseau professionnel."
      icon={Linkedin}
      color="text-blue-600"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Sujet ou idée du post</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Les avantages du télétravail pour la productivité..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 h-32 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Audience cible</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Ex: Recruteurs, Développeurs..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Langue</label>
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none"
              >
                <option value="français">Français</option>
                <option value="anglais">Anglais</option>
                <option value="espagnol">Espagnol</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Professionnel', 'Inspirant', 'Humoristique', 'Éducatif'].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t.toLowerCase())}
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                tone === t.toLowerCase() 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading || !topic}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Générer le Post
        </button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-6 border-t border-white/5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-widest">Post Généré</h3>
              <button onClick={copy} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs font-bold">
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">
              {result}
            </div>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export const InstagramCaptionGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [desc, setDesc] = useState('');
  const [style, setStyle] = useState('minimalist');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!desc) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère 3 variantes de légendes Instagram pour cette photo : "${desc}". 
        Le style doit être ${style}. Inclus des hashtags pertinents et des emojis.`,
      });
      setResult(response.text || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Instagram Caption" 
      description="Des légendes qui captivent votre audience."
      icon={Instagram}
      color="text-pink-600"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Décrivez votre photo</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Ex: Un coucher de soleil sur la plage avec un cocktail..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 h-32 focus:outline-none focus:border-pink-500 transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Minimaliste', 'Storytelling', 'Drôle', 'Aventurier'].map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s.toLowerCase())}
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                style === s.toLowerCase() 
                  ? "bg-pink-600 border-pink-600 text-white" 
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          disabled={loading || !desc}
          className="w-full py-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Générer les Légendes
        </button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-6 border-t border-white/5"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export const HashtagGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!keyword) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère une liste de 30 hashtags optimisés pour le mot-clé suivant : "${keyword}". 
        Classe-les par popularité (Top, Medium, Niche).`,
      });
      setResult(response.text || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Hashtag Generator" 
      description="Optimisez la portée de vos publications avec les bons tags."
      icon={Hash}
      color="text-zinc-400"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Mot-clé principal</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Ex: Fitness, Voyage, Tech..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !keyword}
          className="w-full py-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Hash className="w-5 h-5" />}
          Générer les Hashtags
        </button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-6 border-t border-white/5"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};
