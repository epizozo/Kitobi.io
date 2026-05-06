import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Code2, 
  Terminal, 
  Key, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Rocket,
  Settings,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LordIcon } from './ui/LordIcon';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
  }
}

interface DevSpaceViewProps {
  userKey: string | null;
  setUserKey: (key: string | null) => void;
}

export const DevSpaceView: React.FC<DevSpaceViewProps> = ({ userKey, setUserKey }) => {
  const [apiKey, setApiKey] = useState(userKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [hasSelectedPlatformKey, setHasSelectedPlatformKey] = useState(false);

  useEffect(() => {
    const checkPlatformKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasSelectedPlatformKey(has);
      }
    };
    checkPlatformKey();
  }, []);

  const handleSaveKey = () => {
    setIsValidating(true);
    // Simulation d'une validation d'API
    setTimeout(() => {
      if (apiKey.startsWith('AIza')) {
        setStatus('valid');
        setUserKey(apiKey);
      } else {
        setStatus('invalid');
      }
      setIsValidating(false);
    }, 1500);
  };

  const handleSelectPlatformKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      const has = await window.aistudio.hasSelectedApiKey();
      setHasSelectedPlatformKey(has);
      // On considère que si l'utilisateur a sélectionné une clé via la plateforme, 
      // il utilise le mode "Platform Managed"
      if (has) setStatus('valid');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mx-auto mb-8 border border-orange-500/20"
        >
          <LordIcon src="https://cdn.lordicon.com/ofwpzftr.json" size={48} trigger="loop" />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight italic">
          Espace <span className="text-orange-500 underline decoration-white/20">Développeur</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Prenez le contrôle total de Kitobi. Utilisez votre propre clé Gemini API et bénéficiez de limites illimitées via notre forfait <span className="text-white font-bold italic">"Bring Your Own Key"</span>.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* API Key Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Key className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Configuration Gemini API</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-black">Sécurisé & Privé</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 px-2 block">
                  Votre Clé API Gemini (Paid Project)
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                    />
                    {status === 'valid' && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                    {status === 'invalid' && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                  </div>
                  <button 
                    onClick={handleSaveKey}
                    disabled={isValidating || !apiKey}
                    className="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isValidating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
                  </button>
                </div>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black uppercase text-zinc-600 tracking-[.5em]">OU UTILISER LA PLATEFORME</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button 
                onClick={handleSelectPlatformKey}
                className={cn(
                  "w-full py-4 rounded-2xl border transition-all flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest",
                  hasSelectedPlatformKey 
                    ? "bg-green-500/10 border-green-500/30 text-green-500" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                )}
              >
                <Globe className="w-5 h-5" />
                {hasSelectedPlatformKey ? 'Clé Plateforme Activée' : 'Sélectionner une clé Google Cloud'}
              </button>

              <p className="text-[10px] text-zinc-500 leading-relaxed px-2">
                Note: En utilisant votre propre clé, vous acceptez les conditions de facturation de Google. Kitobi ne facture aucun frais supplémentaire par requête en mode Développeur. 
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-orange-500 ml-1 hover:underline">Documentation Billing <ExternalLink className="inline w-3 h-3" /></a>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
              <Zap className="w-8 h-8 text-orange-500" />
              <h4 className="font-bold">Requêtes Illimitées</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Fini les quotas quotidiens. Vos outils fonctionnent tant que votre quota Google Cloud est disponible.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <h4 className="font-bold">Confidentialité Maximale</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Vos données utilisent votre infrastructure sécurisée. Nous ne stockons jamais vos prompts ni vos clés.</p>
            </div>
          </div>
        </div>

        {/* Developer Plan Pricing */}
        <div className="space-y-8">
          <div className="p-1 w-full bg-gradient-to-b from-orange-500 to-red-600 rounded-[3rem]">
            <div className="bg-[#050505] rounded-[2.8rem] p-10 space-y-8 h-full">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-orange-500">Abonnement Spécial</span>
                <h3 className="text-3xl font-black italic tracking-tighter">DEV-MODE</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">$0</span>
                  <span className="text-zinc-500 text-sm font-bold">/mois</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  'Accès à tous les outils standard',
                  'Accès aux outils Beta & Preview',
                  'Génération Haute Résolution',
                  'Support API Prioritaire',
                  'Modèles Gemini Pro 1.5 & Plus',
                  'Exportation de code propre'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-xs font-medium text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5 group">
                Activer le Forfait Dev <Rocket className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[9px] text-zinc-600 text-center uppercase font-black tracking-widest">
                Requiert une clé Gemini Pay-as-you-go
              </p>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10 space-y-4">
             <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h5 className="text-sm font-bold">Pourquoi le mode Dev ?</h5>
             </div>
             <p className="text-[11px] text-zinc-500 italic leading-relaxed">
               "Pour les créateurs qui veulent s'affranchir des limites sans payer de marge supplémentaire. C'est l'essence même de Kitobi : donner le pouvoir aux builders."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
