import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  Rocket, 
  Target, 
  MousePointer2, 
  SearchCode, 
  TrendingUp, 
  ShoppingCart, 
  FileSignature, 
  FileBadge, 
  Terminal,
  Sparkles,
  Send,
  Copy,
  Check,
  Plus,
  Trash2,
  DollarSign,
  Users,
  AlertCircle,
  MessageSquare,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
  LayoutDashboard,
  FileText,
  Database,
  Code2,
  Cpu,
  ArrowRight,
  Download
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

// 1. Générateur de contenus marketing IA
export const MarketingGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [type, setType] = useState<'hook' | 'post' | 'sales-page' | 'video-script'>('hook');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!product) return;
    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    setError(null);
    try {
      const prompts = {
        hook: `Génère 5 hooks viraux pour ${product} ciblant ${audience}. Utilise des structures psychologiques fortes (curiosité, peur de manquer, bénéfice immédiat).`,
        post: `Rédige un post engageant pour Facebook/LinkedIn sur ${product} pour une audience de ${audience}. Inclus des emojis et un appel à l'action.`,
        'sales-page': `Rédige une page de vente persuasive (structure AIDA) pour ${product}. Cible : ${audience}.`,
        'video-script': `Écris un script vidéo TikTok/Reels de 60 secondes pour promouvoir ${product}. Inclus les indications visuelles et le texte parlé.`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompts[type as keyof typeof prompts],
      });
      setResult(response.text || '');
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la génération. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Générateur Marketing IA" 
      description="Créez du contenu viral et persuasif en quelques secondes."
      icon={Rocket}
      color="text-orange-500"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'hook', label: 'Hooks Viraux' },
            { id: 'post', label: 'Posts Sociaux' },
            { id: 'sales-page', label: 'Page de Vente' },
            { id: 'video-script', label: 'Script Vidéo' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                type === t.id ? "bg-orange-500 border-orange-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Produit ou Service</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ex: Formation Dropshipping, Coaching Fitness..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Audience Cible</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Ex: Jeunes entrepreneurs, Mamans débordées..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !product}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Générer le Contenu
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-widest">Résultat</h3>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }} 
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs font-bold"
              >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// 2. Générateur de visuels brandés (Affiches)
export const BrandVisualsGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [template, setTemplate] = useState('cosmetics');
  const [text, setText] = useState('');
  const [color, setColor] = useState('#f97316');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generate = async () => {
    if (!text) return;
    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    setError(null);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: `Crée une affiche publicitaire professionnelle pour ${template}. 
        Le texte principal est : "${text}". 
        Utilise une palette de couleurs basée sur ${color}. 
        Style : Premium, moderne, épuré.`,
      });
      
      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData?.data) {
        setResult(`data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`);
      } else {
        throw new Error("Aucune image générée");
      }
    } catch (err) {
      console.error(err);
      setError("La génération de l'affiche a échoué. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Générateur de Visuels Brandés" 
      description="Créez des affiches publicitaires premium en un clic."
      icon={FileBadge}
      color="text-purple-500"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'cosmetics', label: 'Cosmétiques' },
            { id: 'real-estate', label: 'Immobilier' },
            { id: 'events', label: 'Événements' },
            { id: 'food', label: 'Restauration' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                template === t.id ? "bg-purple-500 border-purple-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Texte de l'affiche</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex: -50% sur toute la collection !"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Couleur de marque</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono"
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !text}
          className="w-full py-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <FileBadge className="w-5 h-5" />}
          Générer l'Affiche
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <img src={result} alt="Affiche générée" className="w-full rounded-2xl border border-white/10 shadow-2xl" />
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = result;
                link.download = `affiche-${template}.png`;
                link.click();
              }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-all"
            >
              Télécharger l'Image
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// 3. Dashboard Mini-ERP
export const MiniERP: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [sales, setSales] = useState<any[]>(() => {
    const saved = localStorage.getItem('afri_erp_sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<any[]>(() => {
    const saved = localStorage.getItem('afri_erp_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAdd, setShowAdd] = useState<'sale' | 'expense' | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    localStorage.setItem('afri_erp_sales', JSON.stringify(sales));
    localStorage.setItem('afri_erp_expenses', JSON.stringify(expenses));
  }, [sales, expenses]);

  const totalSales = sales.reduce((acc, s) => acc + Number(s.amount), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const profit = totalSales - totalExpenses;

  const addEntry = async () => {
    if (!amount) return;
    if (onProcess && !(await onProcess())) return;

    const entry = { id: Date.now(), amount, note, date: new Date().toLocaleDateString() };
    if (showAdd === 'sale') setSales([entry, ...sales]);
    else setExpenses([entry, ...expenses]);
    setAmount('');
    setNote('');
    setShowAdd(null);
  };

  return (
    <ToolLayout 
      title="Mini-ERP Business" 
      description="Gérez vos ventes, dépenses et profits en toute simplicité."
      icon={TrendingUp}
      color="text-emerald-500"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ventes Totales</p>
            <p className="text-3xl font-black text-emerald-500">{totalSales.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dépenses</p>
            <p className="text-3xl font-black text-rose-500">{totalExpenses.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profit Net</p>
            <p className={cn("text-3xl font-black", profit >= 0 ? "text-blue-500" : "text-rose-500")}>
              {profit.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setShowAdd('sale')}
            className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Ajouter une Vente
          </button>
          <button 
            onClick={() => setShowAdd('expense')}
            className="flex-1 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Ajouter une Dépense
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 overflow-hidden"
            >
              <h3 className="font-bold">Ajouter {showAdd === 'sale' ? 'une vente' : 'une dépense'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Montant (FCFA)"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note / Description"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={addEntry} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm">Confirmer</button>
                <button onClick={() => setShowAdd(null)} className="px-6 py-3 text-zinc-500 hover:text-white text-sm font-bold">Annuler</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-widest">Transactions Récentes</h3>
          <div className="space-y-2">
            {[...sales, ...expenses].sort((a, b) => b.id - a.id).slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", sales.includes(t) ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                    {sales.includes(t) ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.note || (sales.includes(t) ? 'Vente' : 'Dépense')}</p>
                    <p className="text-xs text-zinc-500">{t.date}</p>
                  </div>
                </div>
                <p className={cn("font-black", sales.includes(t) ? "text-emerald-500" : "text-rose-500")}>
                  {sales.includes(t) ? '+' : '-'}{Number(t.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// 4. Gestion Commandes Social Commerce
export const SocialCommerceManager: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('afri_social_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [newOrder, setNewOrder] = useState({ client: '', items: '', total: '', platform: 'whatsapp' });

  useEffect(() => {
    localStorage.setItem('afri_social_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = async () => {
    if (!newOrder.client || !newOrder.total) return;
    if (onProcess && !(await onProcess())) return;

    setOrders([{ ...newOrder, id: Date.now(), status: 'pending', date: new Date().toLocaleDateString() }, ...orders]);
    setNewOrder({ client: '', items: '', total: '', platform: 'whatsapp' });
  };

  const updateStatus = (id: number, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <ToolLayout 
      title="Gestion Social Commerce" 
      description="Centralisez vos commandes WhatsApp et Instagram."
      icon={ShoppingCart}
      color="text-green-500"
    >
      <div className="space-y-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
          <h3 className="font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Nouvelle Commande</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newOrder.client}
              onChange={(e) => setNewOrder({ ...newOrder, client: e.target.value })}
              placeholder="Nom du client"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
            />
            <input
              type="number"
              value={newOrder.total}
              onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
              placeholder="Total (FCFA)"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
            />
            <textarea
              value={newOrder.items}
              onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
              placeholder="Articles commandés..."
              className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-24 resize-none"
            />
            <div className="flex gap-2">
              {['whatsapp', 'instagram'].map((p) => (
                <button
                  key={p}
                  onClick={() => setNewOrder({ ...newOrder, platform: p })}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2",
                    newOrder.platform === p ? "bg-green-500 border-green-500 text-white" : "bg-white/5 border-white/10 text-zinc-400"
                  )}
                >
                  {p === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button onClick={addOrder} className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20">
            Enregistrer la Commande
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-widest">Suivi des Commandes</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", o.platform === 'whatsapp' ? "bg-green-500/10 text-green-500" : "bg-pink-500/10 text-pink-500")}>
                      {o.platform === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold">{o.client}</p>
                      <p className="text-xs text-zinc-500">{o.date}</p>
                    </div>
                  </div>
                  <p className="font-black text-lg">{Number(o.total).toLocaleString()} FCFA</p>
                </div>
                <p className="text-sm text-zinc-400 italic">"{o.items}"</p>
                <div className="flex gap-2">
                  {[
                    { id: 'pending', label: 'En attente', color: 'bg-yellow-500' },
                    { id: 'shipped', label: 'Expédié', color: 'bg-blue-500' },
                    { id: 'delivered', label: 'Livré', color: 'bg-green-500' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateStatus(o.id, s.id)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-bold transition-all border",
                        o.status === s.id ? `${s.color} border-transparent text-white` : "bg-white/5 border-white/10 text-zinc-500"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// 5. Générateur d'annonces publicitaires
export const AdGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [platform, setPlatform] = useState<'meta' | 'google'>('meta');
  const [product, setProduct] = useState('');
  const [angle, setAngle] = useState('benefice');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!product) return;
    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    try {
      const prompt = `Génère 3 variantes d'annonces publicitaires pour ${platform === 'meta' ? 'Facebook/Instagram' : 'Google Search'} pour le produit : ${product}. 
      Angle marketing : ${angle}. 
      Inclus : Titre accrocheur, Texte principal (ou description), et Appel à l'action. 
      Pour Meta, inclus des suggestions de visuels. Pour Google, respecte les limites de caractères.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
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
      title="Ads Optimizer IA" 
      description="Générez des annonces publicitaires qui convertissent."
      icon={Target}
      color="text-blue-500"
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          {[
            { id: 'meta', label: 'Meta Ads', icon: Facebook },
            { id: 'google', label: 'Google Ads', icon: Globe }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id as any)}
              className={cn(
                "flex-1 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2",
                platform === p.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              <p.icon className="w-4 h-4" /> {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Produit ou Service</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex: Montre connectée sport, Service de nettoyage..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Angle Marketing</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'benefice', label: 'Bénéfice' },
              { id: 'peur', label: 'Peur / Problème' },
              { id: 'preuve', label: 'Preuve Sociale' },
              { id: 'urgence', label: 'Urgence' }
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => setAngle(a.id)}
                className={cn(
                  "py-2 rounded-lg border text-[10px] font-bold transition-all",
                  angle === a.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white/5 border-white/10 text-zinc-500"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !product}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
          Générer les Variantes A/B
        </button>

        {result && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// 6. Générateur de documents professionnels
export const DocGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [docType, setDocType] = useState('devis');
  const [client, setClient] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const docId = Date.now().toString().slice(-6);

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(docType.toUpperCase(), 20, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`#${docId}`, 20, 38);

    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Kitobi Business', 140, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Solution de gestion intelligente', 140, 35);

    doc.setDrawColor(230);
    doc.line(20, 45, 190, 45);

    // Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(150);
    doc.text('DESTINATAIRE', 20, 60);
    doc.text('DATE', 140, 60);

    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(client || 'Client non spécifié', 20, 68);
    doc.text(date, 140, 68);

    // Table Header
    let y = 90;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(150);
    doc.text('DESCRIPTION', 20, y);
    doc.text('QTÉ', 120, y);
    doc.text('PRIX', 145, y, { align: 'right' });
    doc.text('TOTAL', 180, y, { align: 'right' });

    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    // Table Body
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    items.forEach((item) => {
      doc.text(item.desc || 'Service sans nom', 20, y);
      doc.text(item.qty.toString(), 122, y);
      doc.text(item.price.toLocaleString(), 145, y, { align: 'right' });
      doc.text((item.qty * item.price).toLocaleString(), 180, y, { align: 'right' });
      y += 8;
    });

    // Total
    y += 10;
    doc.line(140, y, 190, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 140, y);
    doc.setTextColor(14, 165, 233); // Sky-600
    doc.setFontSize(14);
    doc.text(`${total.toLocaleString()} FCFA`, 180, y, { align: 'right' });

    doc.save(`${docType}_${docId}.pdf`);
  };

  return (
    <ToolLayout 
      title="Générateur de Documents Pro" 
      description="Créez des devis et factures professionnels en quelques minutes."
      icon={FileSignature}
      color="text-sky-500"
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          {['devis', 'facture', 'contrat'].map((t) => (
            <button
              key={t}
              onClick={() => setDocType(t)}
              className={cn(
                "flex-1 py-3 rounded-xl border text-xs font-bold transition-all",
                docType === t ? "bg-sky-500 border-sky-500 text-white" : "bg-white/5 border-white/10 text-zinc-400"
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Informations Client</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Nom du client, Adresse, Email..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400">Articles / Services</label>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  value={item.desc}
                  onChange={(e) => updateItem(index, 'desc', e.target.value)}
                  placeholder="Description"
                  className="col-span-6 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                  placeholder="Qté"
                  className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                  placeholder="Prix"
                  className="col-span-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs"
                />
                <button onClick={() => removeItem(index)} className="col-span-1 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addItem} className="text-xs font-bold text-sky-500 flex items-center gap-1 hover:underline">
              <Plus className="w-3 h-3" /> Ajouter une ligne
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-zinc-400 font-bold">Total</p>
          <p className="text-2xl font-black text-white">{total.toLocaleString()} FCFA</p>
        </div>

        <button 
          onClick={() => setShowPreview(true)}
          className="w-full py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl font-bold transition-all shadow-lg shadow-sky-500/20"
        >
          Générer le Document
        </button>

        {showPreview && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-white text-zinc-900 w-full max-w-2xl rounded-3xl p-12 space-y-8 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black uppercase">{docType}</h1>
                  <p className="text-zinc-500 font-mono text-xs">#{Date.now().toString().slice(-6)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Kitobi Business</p>
                  <p className="text-xs text-zinc-500">Solution de gestion intelligente</p>
                </div>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Destinataire</p>
                  <p className="font-bold whitespace-pre-wrap">{client || 'Client non spécifié'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Date</p>
                  <p className="font-bold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase">Description</th>
                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase text-center">Qté</th>
                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Prix</th>
                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-zinc-50">
                      <td className="py-4 font-medium text-sm">{item.desc || 'Service sans nom'}</td>
                      <td className="py-4 text-center text-sm">{item.qty}</td>
                      <td className="py-4 text-right text-sm">{item.price.toLocaleString()}</td>
                      <td className="py-4 text-right font-bold text-sm">{(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end pt-4">
                <div className="w-48 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Sous-total</span>
                    <span className="font-bold">{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl border-t border-zinc-100 pt-2">
                    <span className="font-black">TOTAL</span>
                    <span className="font-black text-sky-600">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <button onClick={exportToPDF} className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Télécharger PDF
                </button>
                <button onClick={() => setShowPreview(false)} className="px-6 py-3 text-zinc-500 font-bold text-sm">Fermer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// 7. Assistant Développeur Spécialisé
export const DevAssistant: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [mode, setMode] = useState<'sql' | 'debug' | 'doc' | 'optimize'>('sql');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (!input) return;
    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    try {
      const prompts = {
        sql: `Tu es un expert SQL Server. Génère une requête optimisée pour : "${input}". Explique brièvement le fonctionnement.`,
        debug: `Analyse ces logs d'erreur et suggère des solutions : "${input}".`,
        doc: `Génère une documentation technique claire pour ce code : "${input}".`,
        optimize: `Optimise ce code pour la performance et la lisibilité : "${input}".`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompts[mode],
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
      title="Assistant Dev IA" 
      description="Expert SQL, Debugging et Documentation automatique."
      icon={Terminal}
      color="text-teal-500"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'sql', label: 'SQL Assistant' },
            { id: 'debug', label: 'Debug Logs' },
            { id: 'doc', label: 'Auto-Doc' },
            { id: 'optimize', label: 'Optimisation' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={cn(
                "py-2 rounded-xl border text-[10px] font-bold transition-all",
                mode === m.id ? "bg-teal-500 border-teal-500 text-white" : "bg-white/5 border-white/10 text-zinc-500"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">
            {mode === 'sql' ? 'Décrivez votre besoin SQL' : mode === 'debug' ? 'Collez vos logs ici' : 'Collez votre code ici'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 h-48 focus:outline-none focus:border-teal-500 transition-colors font-mono text-xs resize-none"
          />
        </div>

        <button
          onClick={process}
          disabled={loading || !input}
          className="w-full py-4 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
          Exécuter l'Assistant
        </button>

        {result && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 text-xs font-mono leading-relaxed whitespace-pre-wrap text-zinc-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// 8. Outil Social One-Click
export const OneClickSocial: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generate = async () => {
    if (!topic) return;
    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    try {
      // 1. Generate Text Content
      const textResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère un post social complet pour "${topic}". Inclus : une légende captivante, des hashtags, et une description du visuel idéal.`,
      });

      // 2. Generate Visual
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: `Crée un visuel social média impactant pour : "${topic}". Style : Moderne, vibrant, adapté à Instagram/Facebook.`,
      });

      const imagePart = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      
      setResult({
        text: textResponse.text,
        image: imagePart?.inlineData?.data ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : null
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Social One-Click" 
      description="Générez post + visuel + hashtags en un seul clic."
      icon={MousePointer2}
      color="text-pink-500"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Sujet du post</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Lancement de ma nouvelle boutique de chaussures..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          onClick={generate}
          disabled={loading || !topic}
          className="w-full py-4 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
          Tout Générer en 1 Clic
        </button>

        {result && (
          <div className="space-y-6 pt-6 border-t border-white/5">
            {result.image && (
              <img src={result.image} alt="Visuel généré" className="w-full rounded-2xl border border-white/10" />
            )}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">
              {result.text}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// 9. Analyse Concurrentielle
export const CompetitorAnalysis: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const analyze = async () => {
    if (!url) return;
    if (onProcess && !(await onProcess())) return;

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyse la stratégie marketing et le positionnement de ce concurrent (ou site) : "${url}". 
        Suggère des idées pour se différencier et les types de contenus qui pourraient mieux performer.`,
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
      title="Analyse Concurrentielle" 
      description="Analysez vos concurrents et trouvez votre angle unique."
      icon={SearchCode}
      color="text-indigo-500"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">URL ou Nom du concurrent</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ex: www.concurrent-direct.com ou 'Boutique de cosmétiques X'"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !url}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <SearchCode className="w-5 h-5" />}
          Lancer l'Analyse
        </button>

        {result && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
