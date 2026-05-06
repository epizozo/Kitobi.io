import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { Key, Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PasswordGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-';

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (length < 8) return { label: 'Faible', color: 'text-red-500', icon: ShieldAlert };
    if (length < 12) return { label: 'Moyen', color: 'text-orange-500', icon: Shield };
    return { label: 'Fort', color: 'text-green-500', icon: ShieldCheck };
  };

  const strength = getStrength();

  return (
    <ToolLayout 
      title="Générateur de Mots de Passe" 
      description="Créez des mots de passe ultra-sécurisés et personnalisables." 
      icon={Key} 
      color="text-slate-500"
    >
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-slate-500/5 blur-[100px] rounded-full" />
          <div className="relative p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 flex flex-col items-center gap-8">
            <div className="w-full text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <strength.icon className={cn("w-5 h-5", strength.color)} />
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", strength.color)}>
                  Sécurité : {strength.label}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={password || 'Cliquez sur Générer'}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-8 py-6 text-2xl font-mono text-center focus:outline-none focus:border-slate-500/50 transition-all placeholder:text-zinc-800"
                />
                {password && (
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-zinc-500 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-5 bg-slate-500 text-white rounded-[2rem] font-bold text-lg hover:bg-slate-600 transition-all shadow-xl shadow-slate-500/20 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-6 h-6" />
              Générer Nouveau
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Longueur : {length}</label>
            </div>
            <input 
              type="range" 
              min="4" 
              max="64" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-500"
            />
          </div>

          <div className="space-y-4">
            {[
              { label: 'Majuscules (A-Z)', value: includeUppercase, setter: setIncludeUppercase },
              { label: 'Chiffres (0-9)', value: includeNumbers, setter: setIncludeNumbers },
              { label: 'Symboles (!@#$)', value: includeSymbols, setter: setIncludeSymbols },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{opt.label}</span>
                <button 
                  onClick={() => opt.setter(!opt.value)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative p-1",
                    opt.value ? "bg-slate-500" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-all",
                    opt.value ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
