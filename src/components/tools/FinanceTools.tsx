import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Percent, 
  Coins, 
  Calculator, 
  ArrowRightLeft, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  History as HistoryIcon,
  Trash2,
  Plus
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

export const VATCalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(20);
  const [currency, setCurrency] = useState('FCFA');
  const [mode, setMode] = useState<'ht-to-ttc' | 'ttc-to-ht'>('ht-to-ttc');
  const [history, setHistory] = useState<{ id: string; ht: number; ttc: number; vat: number; rate: number; currency: string }[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  const CURRENCIES = ['€', '$', '£', 'FCFA', 'DH', 'DT', '₦', 'KSh', 'GH₵'];

  const ht = mode === 'ht-to-ttc' ? amount : amount / (1 + vatRate / 100);
  const ttc = mode === 'ht-to-ttc' ? amount * (1 + vatRate / 100) : amount;
  const vatAmount = ttc - ht;

  const handleCalculate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }
    setCalculated(true);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const addToHistory = async () => {
    if (amount <= 0) return;
    
    if (!calculated) {
      const allowed = await onProcess?.();
      if (allowed === false) return;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ht,
      ttc,
      vat: vatAmount,
      rate: vatRate,
      currency
    };
    setHistory(prev => [newItem, ...prev].slice(0, 5));
    setCalculated(true);
  };

  return (
    <ToolLayout 
      title="Calculateur TVA" 
      description="Calculez rapidement vos montants HT, TTC et de TVA."
      icon={Percent}
      color="text-rose-400"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-12">
        <div className="space-y-8">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => { setMode('ht-to-ttc'); setCalculated(false); }}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                mode === 'ht-to-ttc' ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              HT vers TTC
            </button>
            <button
              onClick={() => { setMode('ttc-to-ht'); setCalculated(false); }}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                mode === 'ttc-to-ht' ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              TTC vers HT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Montant {mode === 'ht-to-ttc' ? 'HT' : 'TTC'}</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => { setAmount(parseFloat(e.target.value) || 0); setCalculated(false); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{currency}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Devise</label>
              <select 
                value={currency}
                onChange={(e) => { setCurrency(e.target.value); setCalculated(false); }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-rose-500 transition-colors appearance-none"
              >
                {CURRENCIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Taux de TVA (%)</label>
              <div className="grid grid-cols-4 gap-2">
                {[2.1, 5.5, 10, 20].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => { setVatRate(rate); setCalculated(false); }}
                    className={cn(
                      "py-4 rounded-2xl border text-xs font-bold transition-all",
                      vatRate === rate ? "bg-rose-500 border-rose-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                    )}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full py-5 bg-rose-500 text-white rounded-[2rem] font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
          >
            Calculer
          </button>

          {calculated && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/5">
              {[
                { label: 'Montant HT', value: ht, field: 'ht', color: 'text-white' },
                { label: 'Montant TVA', value: vatAmount, field: 'vat', color: 'text-rose-400' },
                { label: 'Montant TTC', value: ttc, field: 'ttc', color: 'text-white' }
              ].map((item) => (
                <div key={item.field} className={cn("p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 group relative")}>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{item.label}</p>
                  <p className={cn("text-2xl font-black", item.color)}>{item.value.toFixed(2)} {currency}</p>
                  <button 
                    onClick={() => copyToClipboard(item.value.toFixed(2), item.field)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                  >
                    {copiedField === item.field ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={addToHistory}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Ajouter à l'historique
          </button>
        </div>

        <div className="space-y-6 border-l border-white/5 pl-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <HistoryIcon className="w-4 h-4" /> Historique
            </h4>
            {history.length > 0 && (
              <button onClick={() => setHistory([])} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-xs text-zinc-600 italic">Aucun historique.</p>
            ) : (
              history.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-zinc-500">Taux {item.rate}%</span>
                    <span className="text-white">{item.ttc.toFixed(2)} {item.currency} TTC</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>HT: {item.ht.toFixed(2)} {item.currency}</span>
                    <span>TVA: {item.vat.toFixed(2)} {item.currency}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export const CurrencyConverter: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const [history, setHistory] = useState<{ id: string; from: string; to: string; amount: number; result: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [rates] = useState<Record<string, number>>({
    EUR: 1,
    USD: 1.08,
    GBP: 0.85,
    JPY: 162.5,
    CAD: 1.47,
    AUD: 1.65,
    CHF: 0.97,
    CNY: 7.82,
    XOF: 655.95,
    ZAR: 20.15,
    NGN: 1650.00,
    KES: 142.50,
    GHS: 14.20
  });

  const convert = (val: number, f: string, t: string) => {
    const baseVal = f === 'EUR' ? val : val / rates[f];
    return t === 'EUR' ? baseVal : baseVal * rates[t];
  };

  const result = convert(amount, from, to);

  const handleCalculate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }
    setCalculated(true);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setCalculated(false);
  };

  const addToHistory = async () => {
    if (amount <= 0) return;

    if (!calculated) {
      const allowed = await onProcess?.();
      if (allowed === false) return;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      amount,
      result
    };
    setHistory(prev => [newItem, ...prev].slice(0, 5));
    setCalculated(true);
  };

  const commonConversions = [10, 50, 100, 500, 1000];

  return (
    <ToolLayout 
      title="Convertisseur de Devises" 
      description="Convertissez instantanément vos montants entre les principales monnaies mondiales."
      icon={Coins}
      color="text-yellow-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">De</label>
              <select 
                value={from}
                onChange={(e) => { setFrom(e.target.value); setCalculated(false); }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-yellow-500 transition-colors appearance-none"
              >
                {Object.keys(rates).map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>

            <button 
              onClick={swap}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all mt-6"
            >
              <ArrowRightLeft className="w-5 h-5 text-yellow-500" />
            </button>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Vers</label>
              <select 
                value={to}
                onChange={(e) => { setTo(e.target.value); setCalculated(false); }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-yellow-500 transition-colors appearance-none"
              >
                {Object.keys(rates).map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Montant à convertir</label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => { setAmount(parseFloat(e.target.value) || 0); setCalculated(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-6 text-2xl font-black focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full py-5 bg-yellow-500 text-white rounded-[2rem] font-bold text-lg hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-500/20"
          >
            Convertir
          </button>

          {calculated && (
            <div className="p-8 rounded-[2.5rem] bg-yellow-500/10 border border-yellow-500/20 text-center space-y-2 relative group">
              <p className="text-sm text-yellow-500/60 font-bold uppercase tracking-widest">Résultat estimé</p>
              <p className="text-4xl font-black text-yellow-500">
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
              </p>
              <p className="text-[10px] text-zinc-500">Taux indicatifs mis à jour quotidiennement.</p>
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result.toFixed(2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                </button>
                <button 
                  onClick={addToHistory}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <Plus className="w-3 h-3 text-zinc-500" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Conversions rapides</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {commonConversions.map(val => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all"
                >
                  {val} {from}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 border-l border-white/5 pl-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <HistoryIcon className="w-4 h-4" /> Historique
            </h4>
            {history.length > 0 && (
              <button onClick={() => setHistory([])} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-xs text-zinc-600 italic">Aucun historique.</p>
            ) : (
              history.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-zinc-500">{item.amount} {item.from}</span>
                    <ArrowRightLeft className="w-2 h-2 text-yellow-500" />
                    <span className="text-white">{item.result.toFixed(2)} {item.to}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
