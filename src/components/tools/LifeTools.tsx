import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Droplets, 
  Flame, 
  Stethoscope, 
  Activity, 
  Plus, 
  Minus, 
  Sparkles,
  Utensils
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

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

export const WaterTracker: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [goal, setGoal] = useState(2000); // ml
  const [current, setCurrent] = useState(0);
  const [history, setHistory] = useState<{ time: string; amount: number }[]>([]);

  const addWater = async (amount: number) => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }
    setCurrent(prev => Math.min(prev + amount, goal * 2));
    setHistory(prev => [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), amount }, ...prev].slice(0, 5));
  };

  const progress = Math.min((current / goal) * 100, 100);

  return (
    <ToolLayout 
      title="Rappel Hydratation" 
      description="Suivez votre consommation d'eau quotidienne pour rester en forme."
      icon={Droplets}
      color="text-blue-400"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-12 text-center">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-white/5"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 - (552.92 * progress) / 100}
                strokeLinecap="round"
                className="text-blue-400 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <p className="text-4xl font-black text-white">{current}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">ml / {goal}ml</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[250, 500, 750].map(amount => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-blue-400/10 hover:border-blue-400/30 transition-all group"
              >
                <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-zinc-400">+{amount}ml</span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => { setCurrent(0); setHistory([]); }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Réinitialiser la journée
          </button>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Historique récent</h4>
          <div className="space-y-3">
            {history.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-white">+{entry.amount}ml</span>
                </div>
                <span className="text-xs text-zinc-500 font-mono">{entry.time}</span>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-12 text-zinc-600 italic text-sm">
                Aucune activité aujourd'hui.
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export const CalorieCalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<number>(1.2);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }
    setCalculated(true);
  };

  // Mifflin-St Jeor Equation
  const bmr = gender === 'male' 
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;

  const tdee = bmr * activity;

  // Macros (40% Carbs, 30% Protein, 30% Fat)
  const protein = (tdee * 0.3) / 4;
  const carbs = (tdee * 0.4) / 4;
  const fat = (tdee * 0.3) / 9;

  return (
    <ToolLayout 
      title="Calculateur de Calories" 
      description="Estimez vos besoins énergétiques journaliers et vos macro-nutriments."
      icon={Flame}
      color="text-orange-500"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Poids (kg)</label>
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => { setWeight(parseFloat(e.target.value) || 0); setCalculated(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Taille (cm)</label>
            <input
              type="number"
              value={height || ''}
              onChange={(e) => { setHeight(parseFloat(e.target.value) || 0); setCalculated(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Âge</label>
            <input
              type="number"
              value={age || ''}
              onChange={(e) => { setAge(parseFloat(e.target.value) || 0); setCalculated(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setGender('male'); setCalculated(false); }}
            className={cn(
              "py-4 rounded-2xl border text-xs font-bold transition-all",
              gender === 'male' ? "bg-orange-500 border-orange-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
            )}
          >
            Homme
          </button>
          <button
            onClick={() => { setGender('female'); setCalculated(false); }}
            className={cn(
              "py-4 rounded-2xl border text-xs font-bold transition-all",
              gender === 'female' ? "bg-orange-500 border-orange-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
            )}
          >
            Femme
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Niveau d'activité</label>
          <select
            value={activity}
            onChange={(e) => { setActivity(parseFloat(e.target.value)); setCalculated(false); }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-orange-500 transition-colors appearance-none"
          >
            <option value={1.2}>Sédentaire (Bureau, peu d'exercice)</option>
            <option value={1.375}>Légèrement actif (1-3 fois/semaine)</option>
            <option value={1.55}>Modérément actif (3-5 fois/semaine)</option>
            <option value={1.725}>Très actif (Tous les jours)</option>
          </select>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
        >
          Calculer mes besoins
        </button>

        {calculated && (
          <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-orange-500/60 font-bold uppercase tracking-widest">Besoins journaliers (Maintien)</p>
              <p className="text-5xl font-black text-orange-500">
                {Math.round(tdee)} kcal
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-orange-500/10">
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Protéines</p>
                <p className="text-lg font-bold text-white">{Math.round(protein)}g</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Glucides</p>
                <p className="text-lg font-bold text-white">{Math.round(carbs)}g</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Lipides</p>
                <p className="text-lg font-bold text-white">{Math.round(fat)}g</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
