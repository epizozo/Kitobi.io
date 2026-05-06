import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Twitter, 
  UserCircle, 
  CreditCard, 
  Wallet, 
  Code, 
  CheckSquare, 
  Timer, 
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Hash,
  Type,
  Zap
} from 'lucide-react';
import { ToolLayout } from './ToolLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- MARKETING ---

export const VideoScriptGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const generateScript = async () => {
    if (!topic.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setLoading(true);
    // Simulate generation
    setTimeout(() => {
      setScript(`
[ACCROCHE - 0:00-0:05]
"Saviez-vous que ${topic || 'ce sujet'} peut changer votre quotidien ?" (Visuel dynamique)

[INTRODUCTION - 0:05-0:15]
"Salut à tous ! Aujourd'hui on plonge dans ${topic || 'le vif du sujet'}. Restez bien jusqu'à la fin pour l'astuce bonus."

[CORPS - 0:15-0:45]
1. Problème : Pourquoi c'est difficile ?
2. Solution : Voici comment faire.
3. Résultat : Ce que vous allez obtenir.

[CONCLUSION - 0:45-1:00]
"Si ça vous a plu, abonnez-vous et dites-moi en commentaire ce que vous en pensez !"
      `.trim());
      setLoading(false);
    }, 1500);
  };

  return (
    <ToolLayout title="Générateur de Script Vidéo" description="Structurez vos vidéos TikTok, Reels ou Shorts pour un impact maximum." icon={Zap} color="text-yellow-400">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Sujet de la vidéo (ex: Recette rapide, Astuce Code...)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4"
          />
          <button
            onClick={generateScript}
            disabled={loading}
            className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            Générer le Script
          </button>
        </div>

        {script && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8"
          >
            <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed">{script}</pre>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export const TwitterThreadGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [text, setText] = useState('');
  const [threads, setThreads] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generateThreads = async () => {
    if (!text.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const chunks = text.match(/.{1,240}(\s|$)/g) || [];
    setThreads(chunks.map((c, i) => `${i + 1}/${chunks.length}\n\n${c.trim()}`));
  };

  return (
    <ToolLayout title="Générateur de Threads X" description="Transformez vos longs textes en threads captivants pour Twitter/X." icon={Twitter} color="text-blue-400">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Collez votre long texte ici..."
            className="w-full h-48 bg-transparent border-none focus:ring-0 text-lg resize-none"
          />
          <button
            onClick={generateThreads}
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all"
          >
            Découper en Thread
          </button>
        </div>

        <div className="space-y-4">
          {threads.map((thread, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 relative group"
            >
              <pre className="whitespace-pre-wrap font-sans text-zinc-300">{thread}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(thread);
                  setCopied(i);
                  setTimeout(() => setCopied(null), 2000);
                }}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
              >
                {copied === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
};

export const BioOptimizer: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [bio, setBio] = useState('');
  const [platform, setPlatform] = useState<'insta' | 'twitter' | 'linkedin'>('insta');
  const [optimized, setOptimized] = useState('');

  const handleOptimize = async () => {
    if (!bio.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setOptimized(bio); // In a real app, this would call an AI
  };

  const limits = { insta: 150, twitter: 160, linkedin: 220 };

  return (
    <ToolLayout title="Optimiseur de Bio" description="Créez des biographies percutantes pour vos réseaux sociaux." icon={UserCircle} color="text-pink-400">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-center gap-4">
          {(['insta', 'twitter', 'linkedin'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                platform === p ? 'bg-pink-500 text-white' : 'bg-white/5 text-zinc-500'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, limits[platform]))}
              placeholder={`Écrivez votre bio ${platform}...`}
              className="w-full h-32 bg-transparent border-none focus:ring-0 text-xl resize-none"
            />
            <div className={`absolute bottom-0 right-0 text-xs font-bold ${bio.length >= limits[platform] ? 'text-red-500' : 'text-zinc-500'}`}>
              {bio.length} / {limits[platform]}
            </div>
          </div>
          <button
            onClick={handleOptimize}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all"
          >
            Optimiser la Bio
          </button>
        </div>

        {optimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2"
          >
            <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest">Bio Optimisée</h4>
            <p className="text-zinc-300">{optimized}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-pink-400 uppercase">Conseil Pro</h4>
            <p className="text-sm text-zinc-400">Utilisez des emojis pour structurer et des mots-clés pour le SEO de votre profil.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-pink-400 uppercase">Call to Action</h4>
            <p className="text-sm text-zinc-400">N'oubliez pas d'inclure un lien ou une instruction claire (ex: "Contactez-moi 👇").</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// --- BUSINESS ---

export const SellingPriceCalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [cost, setCost] = useState(0);
  const [margin, setMargin] = useState(20);
  const [vat, setVat] = useState(20);
  const [result, setResult] = useState<{ sellingPrice: number; profit: number } | null>(null);

  const calculate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const sellingPrice = cost * (1 + margin / 100) * (1 + vat / 100);
    const profit = sellingPrice / (1 + vat / 100) - cost;
    setResult({ sellingPrice, profit });
  };

  return (
    <ToolLayout title="Calculateur Prix Vente" description="Définissez le prix idéal pour vos produits en incluant marge et taxes." icon={DollarSign} color="text-lime-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10">
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Coût de revient (FCFA)</label>
            <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold" />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Marge souhaitée (%)</label>
            <input type="number" value={margin} onChange={e => setMargin(parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold" />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">TVA (%)</label>
            <input type="number" value={vat} onChange={e => setVat(parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold" />
          </div>
          <button
            onClick={calculate}
            className="w-full py-4 bg-lime-500 text-black rounded-2xl font-bold hover:bg-lime-600 transition-all"
          >
            Calculer le Prix
          </button>
        </div>

        <div className="space-y-8">
          {result ? (
            <>
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-lime-500/10 to-green-500/10 border border-lime-500/20 text-center">
                <p className="text-xs font-bold text-lime-400 uppercase tracking-widest mb-2">Prix de Vente TTC</p>
                <h2 className="text-6xl font-black text-white">{result.sellingPrice.toFixed(0)} <span className="text-2xl text-lime-500">FCFA</span></h2>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-center">
                <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Bénéfice Net (Hors TVA)</p>
                <p className="text-3xl font-bold text-lime-400">+{result.profit.toFixed(0)} FCFA</p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic gap-4 py-12">
              <DollarSign className="w-16 h-16 opacity-20" />
              <p className="text-center max-w-[200px]">Ajustez les paramètres et cliquez sur calculer pour voir les résultats.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export const ExpenseTracker: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [expenses, setExpenses] = useState<{ id: string; label: string; amount: number; category: string }[]>([]);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Autre');

  const addExpense = async () => {
    if (!label || !amount) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setExpenses([...expenses, { id: Date.now().toString(), label, amount: parseFloat(amount), category }]);
    setLabel('');
    setAmount('');
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const data = Object.entries(
    expenses.reduce((acc: any, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  return (
    <ToolLayout title="Suivi de Dépenses" description="Gérez vos finances personnelles ou pro en toute simplicité." icon={Wallet} color="text-green-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-4">
            <input
              placeholder="Libellé (ex: Loyer)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 appearance-none"
              >
                <option>Alimentation</option>
                <option>Transport</option>
                <option>Loisirs</option>
                <option>Santé</option>
                <option>Autre</option>
              </select>
            </div>
            <button
              onClick={addExpense}
              className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Ajouter
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold">{exp.label}</p>
                  <p className="text-xs text-zinc-500">{exp.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-mono font-bold text-green-400">{exp.amount.toLocaleString()} FCFA</p>
                  <button onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))} className="text-zinc-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Total Dépenses</p>
            <h2 className="text-5xl font-black text-white">{total.toLocaleString()} <span className="text-2xl text-green-500">FCFA</span></h2>
          </div>

          {expenses.length > 0 && (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

// --- DEV ---

export const RegexTester: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!regex) {
      setMatches([]);
      setError(null);
      return;
    }

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    try {
      const re = new RegExp(regex, flags);
      const m = Array.from(testText.matchAll(re));
      setMatches(m);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  return (
    <ToolLayout title="Testeur de Regex" description="Validez vos expressions régulières en temps réel avec des exemples." icon={Code} color="text-teal-400">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">/</span>
            <input
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="expression_reguliere"
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-8 pr-4 py-4 font-mono text-teal-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">/</span>
          </div>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags (g, i, m)"
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-4 font-mono text-zinc-400"
          />
        </div>

        <button
          onClick={handleTest}
          className="w-full py-4 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all"
        >
          Tester le Regex
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Texte de Test</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Collez votre texte ici pour tester le regex..."
              className="w-full h-64 bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 font-mono text-sm resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Résultats ({matches.length})</label>
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 h-64 overflow-y-auto space-y-3">
              {matches.length > 0 ? (
                matches.map((match, i) => (
                  <div key={i} className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 font-mono text-xs">
                    <span className="text-teal-500 mr-2">Match {i+1}:</span>
                    {match[0]}
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600 italic text-sm">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// --- LIFE ---

export const HabitTracker: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [habits, setHabits] = useState<{ id: string; name: string; streak: number; lastDone: string | null }[]>([]);
  const [newHabit, setNewHabit] = useState('');

  const addHabit = async () => {
    if (!newHabit) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setHabits([...habits, { id: Date.now().toString(), name: newHabit, streak: 0, lastDone: null }]);
    setNewHabit('');
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    setHabits(habits.map(h => {
      if (h.id === id) {
        if (h.lastDone === today) return h;
        return { ...h, streak: h.streak + 1, lastDone: today };
      }
      return h;
    }));
  };

  return (
    <ToolLayout title="Suivi d'Habitudes" description="Ancrez de nouvelles routines positives dans votre quotidien." icon={CheckSquare} color="text-orange-400">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex gap-4">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Nouvelle habitude (ex: Méditer 10min)"
            className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4"
          />
          <button onClick={addHabit} className="px-8 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all">
            Ajouter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {habits.map((habit) => {
            const isDoneToday = habit.lastDone === new Date().toDateString();
            return (
              <motion.div
                layout
                key={habit.id}
                className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${
                  isDoneToday ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/[0.02] border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isDoneToday ? 'bg-orange-500 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                    }`}
                  >
                    <Check className="w-6 h-6" />
                  </button>
                  <div>
                    <h4 className={`font-bold ${isDoneToday ? 'text-orange-400' : 'text-white'}`}>{habit.name}</h4>
                    <p className="text-xs text-zinc-500">Série actuelle : {habit.streak} jours</p>
                  </div>
                </div>
                <button onClick={() => setHabits(habits.filter(h => h.id !== habit.id))} className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
};

export const PomodoroTimer: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const toggleTimer = async () => {
    if (!isActive) {
      if (onProcess) {
        const allowed = await onProcess();
        if (!allowed) return;
      }
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const toggleMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <ToolLayout title="Minuteur Pomodoro" description="Boostez votre productivité avec la méthode Pomodoro (25/5)." icon={Timer} color="text-red-400">
      <div className="max-w-2xl mx-auto text-center space-y-12">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => toggleMode('work')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'work' ? 'bg-red-500 text-white' : 'bg-white/5 text-zinc-500'}`}
          >
            Travail
          </button>
          <button
            onClick={() => toggleMode('break')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'break' ? 'bg-blue-500 text-white' : 'bg-white/5 text-zinc-500'}`}
          >
            Pause
          </button>
        </div>

        <div className="relative inline-block">
          <svg className="w-64 h-64 -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/5"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={754}
              animate={{ strokeDashoffset: 754 - (754 * timeLeft) / (mode === 'work' ? 25 * 60 : 5 * 60) }}
              className={mode === 'work' ? 'text-red-500' : 'text-blue-500'}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black font-mono">{formatTime(timeLeft)}</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">
              {mode === 'work' ? 'Focus' : 'Détente'}
            </span>
          </div>
        </div>

          <div className="flex justify-center gap-6">
            <button
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-xl ${
                isActive ? 'bg-white/10 text-white' : 'bg-red-500 text-white shadow-red-500/20'
              }`}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          <button
            onClick={reset}
            className="w-20 h-20 rounded-[2rem] bg-white/5 text-zinc-400 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
      </div>
    </ToolLayout>
  );
};

// --- FINANCE ---

export const CompoundInterestCalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(100);
  const [result, setResult] = useState<{ finalAmount: number; totalInvested: number; totalInterest: number } | null>(null);

  const calculate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    let total = principal;
    const r = rate / 100 / 12;
    const n = years * 12;
    
    for (let i = 0; i < n; i++) {
      total = (total + monthly) * (1 + r);
    }
    
    const finalAmount = total;
    const totalInvested = principal + monthly * years * 12;
    const totalInterest = finalAmount - totalInvested;
    
    setResult({ finalAmount, totalInvested, totalInterest });
  };

  return (
    <ToolLayout title="Intérêts Composés" description="Simulez la croissance de votre épargne sur le long terme." icon={TrendingUp} color="text-indigo-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10">
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Capital Initial (FCFA)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Versement Mensuel (FCFA)</label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(parseFloat(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase">Taux Annuel (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase">Durée (Années)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(parseFloat(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold"
              />
            </div>
          </div>
          <button
            onClick={calculate}
            className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
          >
            Simuler la Croissance
          </button>
        </div>

        <div className="space-y-8">
          {result ? (
            <>
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Montant Final Estimé</p>
                <h2 className="text-6xl font-black text-white">{Math.round(result.finalAmount).toLocaleString()} <span className="text-2xl text-indigo-500">FCFA</span></h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Total Investi</p>
                  <p className="text-xl font-bold">{Math.round(result.totalInvested).toLocaleString()} FCFA</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Intérêts Gagnés</p>
                  <p className="text-xl font-bold text-indigo-400">+{Math.round(result.totalInterest).toLocaleString()} FCFA</p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic gap-4 py-12">
              <TrendingUp className="w-16 h-16 opacity-20" />
              <p className="text-center max-w-[200px]">Ajustez les paramètres et cliquez sur simuler pour voir les résultats.</p>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
            <p className="text-sm text-zinc-400 leading-relaxed italic">
              "Les intérêts composés sont la huitième merveille du monde. Celui qui le comprend l'obtient... celui qui ne le comprend pas le paie." - Albert Einstein
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
