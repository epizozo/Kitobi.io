import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { Activity, RefreshCw, Info, Scale, Ruler } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BMICalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }
    const heightInMeters = height / 100;
    const result = weight / (heightInMeters * heightInMeters);
    setBmi(parseFloat(result.toFixed(1)));
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Insuffisance pondérale', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (bmi < 25) return { label: 'Poids normal', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (bmi < 30) return { label: 'Surpoids', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { label: 'Obésité', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const category = bmi ? getCategory(bmi) : null;

  return (
    <ToolLayout 
      title="Calculateur d'IMC" 
      description="Calculez votre Indice de Masse Corporelle et obtenez des conseils santé." 
      icon={Activity} 
      color="text-red-400"
    >
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-3 h-3 text-red-400" />
                Poids (kg) : {weight}
              </label>
              <input 
                type="range" 
                min="30" 
                max="200" 
                value={weight} 
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-400"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Ruler className="w-3 h-3 text-red-400" />
                Taille (cm) : {height}
              </label>
              <input 
                type="range" 
                min="100" 
                max="250" 
                value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-400"
              />
            </div>

            <button
              onClick={calculateBMI}
              className="w-full py-5 bg-red-400 text-white rounded-[2rem] font-bold text-lg hover:bg-red-500 transition-all shadow-xl shadow-red-400/20 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-6 h-6" />
              Calculer
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            {bmi ? (
              <div className="space-y-4">
                <div className="w-32 h-32 rounded-full border-4 border-red-400/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-red-400/5 blur-2xl rounded-full" />
                  <span className="text-4xl font-black text-white relative z-10">{bmi}</span>
                </div>
                <div className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest", category?.bg, category?.color)}>
                  {category?.label}
                </div>
              </div>
            ) : (
              <div className="space-y-4 opacity-20">
                <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center">
                  <Activity className="w-12 h-12" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">En attente...</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-4">
          <div className="flex items-center gap-3 text-zinc-400">
            <Info className="w-4 h-4" />
            <h4 className="text-sm font-bold">À propos de l'IMC</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            L'Indice de Masse Corporelle (IMC) est une mesure simple du poids par rapport à la taille. 
            Bien qu'il soit un indicateur utile pour la plupart des gens, il ne mesure pas directement la graisse corporelle 
            et peut ne pas être précis pour les athlètes ou les personnes âgées.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};
