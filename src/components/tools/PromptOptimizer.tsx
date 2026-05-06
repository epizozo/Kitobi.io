import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wand2, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  Layout, 
  UserCheck, 
  Palette,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateText } from '../../lib/gemini';

interface PromptOptimizerProps {
  onProcess?: () => Promise<boolean>;
}

interface OptimizedPrompts {
  standard: string;
  expert: string;
  creative: string;
}

export const PromptOptimizer: React.FC<PromptOptimizerProps> = ({ onProcess }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OptimizedPrompts | null>(null);
  const [activeTab, setActiveTab] = useState<keyof OptimizedPrompts>('standard');
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!input.trim() || loading) return;

    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    setError(null);

    try {
      const systemPrompt = `
        Tu es un expert en ingénierie de prompts (Prompt Engineering). 
        Ton but est de transformer une idée simple ou un prompt médiocre en un prompt puissant et efficace pour les modèles d'IA.

        Pour chaque demande, fournis 3 versions optimisées :
        1. **standard** : Un prompt clair, direct et bien structuré.
        2. **expert** : Un prompt qui définit un rôle spécifique pour l'IA (ex: "Agis en tant que..."), avec des contraintes et un contexte précis.
        3. **creative** : Un prompt qui encourage l'IA à être plus créative, à utiliser des métaphores ou à suivre une structure narrative spécifique.

        Réponds UNIQUEMENT au format JSON valide suivant :
        {
          "standard": "...",
          "expert": "...",
          "creative": "..."
        }
      `;

      const response = await generateText(`${systemPrompt}\n\nL'idée de l'utilisateur : "${input}"`);
      
      // Extract JSON from response (Gemini sometimes wraps it in markdown)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as OptimizedPrompts;
        setResults(parsed);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (err) {
      console.error(err);
      setError("Désolé, une erreur est survenue lors de l'optimisation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'standard', name: 'Standard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'expert', name: 'Expert (Rôle)', icon: UserCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'creative', name: 'Créatif', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Optimiseur de Prompt</h3>
            <p className="text-sm text-gray-500">Transformez vos idées en instructions puissantes pour l'IA.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">
            Votre idée ou prompt actuel
          </label>
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Écris-moi un article sur le café..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-6 text-sm focus:outline-none focus:border-orange-500/50 transition-all min-h-[160px] resize-none group-hover:bg-white/[0.05]"
            />
            <div className="absolute bottom-4 right-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOptimize}
                disabled={loading || !input.trim()}
                className="p-4 bg-orange-500 rounded-2xl text-white hover:bg-orange-600 transition-all disabled:opacity-50 shadow-xl shadow-orange-500/20 flex items-center justify-center"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex p-1.5 bg-white/[0.02] border border-white/10 rounded-[2rem] gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as keyof OptimizedPrompts)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-white/[0.05] text-white shadow-lg" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                  )}
                >
                  <tab.icon className={cn("w-4 h-4", tab.color)} />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(results[activeTab], activeTab)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                >
                  {copied === activeTab ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", tabs.find(t => t.id === activeTab)?.color.replace('text-', 'bg-'))} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    Version {tabs.find(t => t.id === activeTab)?.name}
                  </span>
                </div>
                <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap pr-12">
                  {results[activeTab]}
                </div>
              </div>

              {/* Decorative background */}
              <div className={cn(
                "absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-all duration-700",
                tabs.find(t => t.id === activeTab)?.bg
              )} />
            </div>

            {/* Copy Formats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleCopy(results[activeTab], 'plain')}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layout className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Copier en Texte Brut</p>
                    <p className="text-[10px] text-gray-500">Format simple sans fioritures</p>
                  </div>
                </div>
                {copied === 'plain' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
              </button>

              <button
                onClick={() => handleCopy(`\`\`\`markdown\n${results[activeTab]}\n\`\`\``, 'markdown')}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Copier en Markdown</p>
                    <p className="text-[10px] text-gray-500">Idéal pour les docs et GitHub</p>
                  </div>
                </div>
                {copied === 'markdown' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
