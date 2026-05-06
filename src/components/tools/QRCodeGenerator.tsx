import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Copy, Check, Palette, Type, Layout } from 'lucide-react';
import { cn } from '../../lib/utils';

export const QRCodeGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [value, setValue] = useState('https://kitobi.io');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      link.click();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="Générateur de QR Code" 
      description="Créez des codes QR personnalisés pour vos liens, textes ou contacts." 
      icon={QrCode} 
      color="text-emerald-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Type className="w-3 h-3 text-emerald-500" />
              Contenu du QR Code
            </label>
            <div className="relative">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Entrez un lien, un texte ou un email..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all resize-none h-[120px]"
              />
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3 text-emerald-500" />
                Couleur Code
              </label>
              <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
                <input 
                  type="color" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <span className="text-xs font-mono text-zinc-400 uppercase">{fgColor}</span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3 text-emerald-500" />
                Couleur Fond
              </label>
              <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <span className="text-xs font-mono text-zinc-400 uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-3 h-3 text-emerald-500" />
              Niveau de Correction d'Erreur
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['L', 'M', 'Q', 'H'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l as any)}
                  className={cn(
                    "py-3 rounded-xl border text-[10px] font-bold transition-all",
                    level === l ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                  )}
                >
                  {l === 'L' ? 'Bas' : l === 'M' ? 'Moyen' : l === 'Q' ? 'Quart' : 'Haut'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
          <div ref={qrRef} className="p-8 bg-white rounded-[2rem] shadow-2xl relative z-10">
            <QRCodeCanvas
              value={value}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              includeMargin={includeMargin}
            />
          </div>
          <button
            onClick={downloadQR}
            className="w-full max-w-xs py-5 bg-emerald-500 text-white rounded-[2rem] font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 relative z-10"
          >
            <Download className="w-6 h-6" />
            Télécharger PNG
          </button>
        </div>
      </div>
    </ToolLayout>
  );
};
