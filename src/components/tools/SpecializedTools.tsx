import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { 
  FileArchive, 
  Palette as PaletteIcon, 
  Repeat, 
  Receipt, 
  Code2, 
  Calendar, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Calculator,
  Copy,
  Check,
  RefreshCw,
  ArrowRightLeft,
  FileCheck,
  Globe,
  TrendingUp,
  Wifi,
  QrCode
} from 'lucide-react';
import { cn } from '../../lib/utils';
import imageCompression from 'browser-image-compression';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

// Palette Generator
export const PaletteGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colors: { [key: string]: number } = {};
      for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }
      const sortedColors = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 6).map(c => c[0]);
      setPalette(sortedColors);
    };
  }, [image]);

  return (
    <ToolLayout title="Générateur de Palettes" description="Extrayez les couleurs dominantes de n'importe quelle image." icon={PaletteIcon} color="text-purple-500">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="p-12 rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6">
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="palette-upload" />
          <label htmlFor="palette-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <PaletteIcon className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Choisir une image</p>
              <p className="text-xs text-zinc-500">PNG, JPG ou WEBP</p>
            </div>
          </label>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        {palette.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {palette.map(color => (
              <div key={color} className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3 group">
                <div className="w-full aspect-square rounded-2xl shadow-xl" style={{ backgroundColor: color }} />
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-mono text-zinc-400 uppercase">{color}</span>
                  <button onClick={() => navigator.clipboard.writeText(color)} className="text-zinc-600 hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// Format Converter
export const FormatConverter: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp' | 'svg'>('png');
  const [isSvgInput, setIsSvgInput] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name.split('.')[0]);
    setIsSvgInput(file.type === 'image/svg+xml' || file.name.endsWith('.svg'));
    
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const download = async () => {
    if (!image) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Handle SVG dimensions properly if possible, else default
      canvas.width = img.width || 800;
      canvas.height = img.height || 600;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // For JPEG, we need a white background because it doesn't support transparency
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (format === 'svg') {
        // If it's already SVG, just download original or notify
        if (isSvgInput) {
           const link = document.createElement('a');
           link.href = image;
           link.download = `${fileName}.svg`;
           link.click();
        } else {
          // Note: Real Raster to SVG requires specialized libs (like potrace)
          // For now, we just allow raster formats
          alert("La conversion de raster vers SVG nécessite un traitement vectoriel avancé.");
        }
        return;
      }

      const url = canvas.toDataURL(`image/${format}`, 0.95);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_converted.${format}`;
      link.click();
    };
  };

  return (
    <ToolLayout title="Convertisseur de Format" description="Convertissez vos images (SVG, PNG, JPG, WebP) instantanément." icon={Repeat} color="text-pink-500">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="p-12 rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6">
          <input type="file" accept="image/*,.svg" onChange={handleImage} className="hidden" id="convert-upload" />
          <label htmlFor="convert-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
              <Repeat className="w-8 h-8 text-pink-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{image ? 'Changer d\'image' : 'Choisir une image'}</p>
              <p className="text-xs text-zinc-500">SVG, PNG, JPG ou WEBP supportés</p>
            </div>
          </label>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        {image && (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 flex items-center justify-center p-4">
               <img src={image} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl" />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Format de sortie</p>
              <div className="grid grid-cols-3 gap-3">
                {['png', 'jpeg', 'webp'].map(f => (
                  <button key={f} onClick={() => setFormat(f as any)} className={cn("py-4 rounded-2xl border text-xs font-bold uppercase transition-all", format === f ? "bg-pink-500 border-pink-500 text-white" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20")}>{f}</button>
                ))}
              </div>
            </div>

            <button onClick={download} className="w-full py-5 bg-pink-500 text-white rounded-[2rem] font-bold text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-500/20 flex items-center justify-center gap-3">
              <Download className="w-6 h-6" /> Convertir et Télécharger
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// Code Formatter
export const CodeFormatter: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [code, setCode] = useState('');
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const formatCode = async () => {
    if (!code.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    try {
      const obj = JSON.parse(code);
      setFormatted(JSON.stringify(obj, null, 2));
    } catch (e) {
      setFormatted("Erreur : Seul le format JSON est supporté pour le moment.");
    }
  };

  return (
    <ToolLayout title="Formateur de Code" description="Rendez votre JSON lisible et structuré instantanément." icon={Code2} color="text-teal-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 flex flex-col">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Code Brut</label>
          <textarea value={code} onChange={e => setCode(e.target.value)} placeholder="Collez votre JSON ici..." className="flex-1 w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm font-mono focus:outline-none focus:border-teal-500/50 transition-all resize-none min-h-[300px]" />
          <button onClick={formatCode} className="w-full py-4 bg-teal-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20">
            <RefreshCw className="w-5 h-5" /> Formater JSON
          </button>
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Résultat</label>
            {formatted && (
              <button onClick={() => { navigator.clipboard.writeText(formatted); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} {copied ? 'Copié !' : 'Copier'}
              </button>
            )}
          </div>
          <div className="flex-1 w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm font-mono overflow-y-auto min-h-[300px] whitespace-pre">
            {formatted || <span className="text-zinc-600 italic">Le code formaté s'affichera ici...</span>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// Unit Converter
export const UnitConverter: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [value, setValue] = useState<number>(1);
  const [category, setCategory] = useState<'length' | 'weight' | 'temperature'>('length');
  const [from, setFrom] = useState('km');
  const [to, setTo] = useState('m');
  const [result, setResult] = useState<number>(1000);

  const units: any = {
    length: {
      'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
      'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.34
    },
    weight: {
      'mg': 0.001, 'g': 1, 'kg': 1000, 'oz': 28.3495, 'lb': 453.592
    },
    temperature: {
      'C': 'C', 'F': 'F', 'K': 'K'
    }
  };

  useEffect(() => {
    const firstUnit = Object.keys(units[category])[0];
    const secondUnit = Object.keys(units[category])[1] || firstUnit;
    setFrom(firstUnit);
    setTo(secondUnit);
  }, [category]);

  const convert = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    if (category === 'temperature') {
      let celsius = value;
      if (from === 'F') celsius = (value - 32) * 5/9;
      if (from === 'K') celsius = value - 273.15;

      let final = celsius;
      if (to === 'F') final = (celsius * 9/5) + 32;
      if (to === 'K') final = celsius + 273.15;
      setResult(parseFloat(final.toFixed(2)));
    } else {
      const res = (value * units[category][from]) / units[category][to];
      setResult(parseFloat(res.toFixed(4)));
    }
  };

  return (
    <ToolLayout title="Convertisseur d'Unités" description="Convertissez instantanément les distances, poids et températures." icon={Calculator} color="text-lime-500">
      <div className="max-w-xl mx-auto space-y-12">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
          {(['length', 'weight', 'temperature'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                category === cat ? "bg-lime-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {cat === 'length' ? 'Longueur' : cat === 'weight' ? 'Poids' : 'Température'}
            </button>
          ))}
        </div>

        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Valeur</label>
            <input 
              type="number" 
              value={value} 
              onChange={e => setValue(parseFloat(e.target.value) || 0)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold focus:outline-none focus:border-lime-500/50" 
            />
          </div>
          <div className="flex items-center gap-4">
            <select value={from} onChange={e => setFrom(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:outline-none">
              {Object.keys(units[category]).map(u => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
            </select>
            <ArrowRightLeft className="w-6 h-6 text-lime-500" />
            <select value={to} onChange={e => setTo(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:outline-none">
              {Object.keys(units[category]).map(u => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
            </select>
          </div>
          <button onClick={convert} className="w-full py-5 bg-lime-500 text-white rounded-[2rem] font-bold text-lg hover:bg-lime-600 transition-all shadow-xl shadow-lime-500/20">Convertir</button>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Résultat</p>
          <p className="text-5xl font-black text-white">{result} <span className="text-lime-500 text-2xl">{to}</span></p>
        </div>
      </div>
    </ToolLayout>
  );
};

// Image Compressor
export const ImageCompressor: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [original, setOriginal] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

  const handleCompress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setOriginal(file);
    setLoading(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      setCompressed(url);
      setStats({ original: file.size, compressed: compressedFile.size });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="Compresseur Intelligent" description="Réduisez le poids de vos images sans perte de qualité visible." icon={FileArchive} color="text-green-500">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="p-12 rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6">
          <input type="file" accept="image/*" onChange={handleCompress} className="hidden" id="compress-upload" />
          <label htmlFor="compress-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <FileArchive className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Choisir une image</p>
              <p className="text-xs text-zinc-500">PNG, JPG ou WEBP</p>
            </div>
          </label>
        </div>
        {loading && <div className="text-center text-zinc-500 animate-pulse">Compression en cours...</div>}
        {compressed && stats && (
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex justify-between text-sm">
              <div className="space-y-1">
                <p className="text-zinc-500 uppercase text-[10px] font-bold">Original</p>
                <p className="font-mono">{(stats.original / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500 uppercase text-[10px] font-bold">Compressé</p>
                <p className="font-mono">{(stats.compressed / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(stats.compressed / stats.original) * 100}%` }} />
            </div>
            <a href={compressed} download="compressed.png" className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Télécharger
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// PDF Tools
export const PDFTools: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const generatePDF = async () => {
    if (files.length === 0) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setGenerating(true);
    const doc = new jsPDF();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 10, 10, 190, 0);
      }
    }
    
    doc.save('document_combine.pdf');
    setGenerating(false);
  };

  return (
    <ToolLayout title="Outils PDF" description="Fusionnez vos images dans un seul document PDF professionnel." icon={FileCheck} color="text-red-500">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="p-12 rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6">
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" id="pdf-upload" />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Choisir des images</p>
              <p className="text-xs text-zinc-500">Sélectionnez plusieurs fichiers pour les fusionner</p>
            </div>
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((f, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-500 truncate">
                  {f.name}
                </div>
              ))}
            </div>
            <button onClick={generatePDF} disabled={generating} className="w-full py-5 bg-red-500 text-white rounded-[2rem] font-bold text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 disabled:opacity-50">
              {generating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
              {generating ? 'Génération...' : `Générer le PDF (${files.length} fichiers)`}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
export const InvoiceGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [invoice, setInvoice] = useState({
    number: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
    date: new Date().toISOString().split('T')[0],
    client: '',
    clientEmail: '',
    items: [{ desc: '', qty: 1, price: 0 }],
    taxRate: 20,
    discount: 0,
    currency: 'FCFA'
  });

  const addItem = () => setInvoice(prev => ({ ...prev, items: [...prev.items, { desc: '', qty: 1, price: 0 }] }));
  const removeItem = (index: number) => setInvoice(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const subtotal = invoice.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount - invoice.discount;

  const generatePDF = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(24);
    doc.setTextColor(31, 41, 55);
    doc.text('FACTURE', 20, 25);
    
    doc.setFontSize(10);
    doc.text(`N°: ${invoice.number}`, 160, 20);
    doc.text(`Date: ${invoice.date}`, 160, 25);

    // Client Info
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text('DESTINATAIRE', 20, 55);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.text(invoice.client || 'Client non spécifié', 20, 65);
    doc.setFontSize(10);
    doc.text(invoice.clientEmail || '', 20, 72);

    // Table Header
    let y = 90;
    doc.setFillColor(31, 41, 55);
    doc.rect(20, y, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Description', 25, y + 7);
    doc.text('Qté', 130, y + 7);
    doc.text('Prix Unit.', 150, y + 7);
    doc.text('Total', 175, y + 7);

    // Items
    doc.setTextColor(31, 41, 55);
    invoice.items.forEach((item, i) => {
      y += 12;
      doc.text(item.desc || 'Article', 25, y);
      doc.text(item.qty.toString(), 130, y);
      doc.text(`${item.price} ${invoice.currency}`, 150, y);
      doc.text(`${(item.qty * item.price).toFixed(2)} ${invoice.currency}`, 175, y);
      
      // Line
      doc.setDrawColor(229, 231, 235);
      doc.line(20, y + 3, 190, y + 3);
    });

    // Totals
    y += 20;
    const rightAlign = 190;
    doc.text('Sous-total:', 140, y);
    doc.text(`${subtotal.toFixed(2)} ${invoice.currency}`, rightAlign, y, { align: 'right' });
    
    y += 8;
    doc.text(`TVA (${invoice.taxRate}%):`, 140, y);
    doc.text(`${taxAmount.toFixed(2)} ${invoice.currency}`, rightAlign, y, { align: 'right' });
    
    if (invoice.discount > 0) {
      y += 8;
      doc.setTextColor(220, 38, 38);
      doc.text('Remise:', 140, y);
      doc.text(`-${invoice.discount.toFixed(2)} ${invoice.currency}`, rightAlign, y, { align: 'right' });
      doc.setTextColor(31, 41, 55);
    }

    y += 12;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 140, y);
    doc.text(`${total.toFixed(2)} ${invoice.currency}`, rightAlign, y, { align: 'right' });

    doc.save(`Facture_${invoice.number}.pdf`);
  };

  return (
    <ToolLayout title="Générateur de Factures" description="Créez des factures professionnelles avec calcul automatique de la TVA." icon={Receipt} color="text-sky-500">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client</label>
                <input value={invoice.client} onChange={e => setInvoice(p => ({ ...p, client: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" placeholder="Nom ou Entreprise" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Client</label>
                <input value={invoice.clientEmail} onChange={e => setInvoice(p => ({ ...p, clientEmail: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" placeholder="email@client.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Devise</label>
                <select 
                  value={invoice.currency} 
                  onChange={e => setInvoice(p => ({ ...p, currency: e.target.value }))} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none"
                >
                  {['€', '$', '£', 'FCFA', 'DH', 'DT', '₦', 'KSh', 'GH₵'].map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Articles</label>
                <button onClick={addItem} className="text-sky-500 hover:text-sky-400 flex items-center gap-1 text-xs font-bold"><Plus className="w-4 h-4" /> Ajouter</button>
              </div>
              <div className="space-y-3">
                {invoice.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex-1">
                      <input value={item.desc} onChange={e => {
                        const newItems = [...invoice.items];
                        newItems[i].desc = e.target.value;
                        setInvoice(p => ({ ...p, items: newItems }));
                      }} placeholder="Description de l'article" className="w-full bg-transparent border-none p-0 text-sm focus:ring-0" />
                    </div>
                    <div className="w-16">
                      <input type="number" value={item.qty} onChange={e => {
                        const newItems = [...invoice.items];
                        newItems[i].qty = parseInt(e.target.value) || 0;
                        setInvoice(p => ({ ...p, items: newItems }));
                      }} className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-center" />
                    </div>
                    <div className="w-24">
                      <input type="number" value={item.price} onChange={e => {
                        const newItems = [...invoice.items];
                        newItems[i].price = parseFloat(e.target.value) || 0;
                        setInvoice(p => ({ ...p, items: newItems }));
                      }} className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-right" />
                    </div>
                    <button onClick={() => removeItem(i)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Sous-total</span>
                <span className="font-bold">{subtotal.toFixed(2)} {invoice.currency}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">TVA (%)</span>
                  <input type="number" value={invoice.taxRate} onChange={e => setInvoice(p => ({ ...p, taxRate: parseInt(e.target.value) || 0 }))} className="w-12 bg-white/5 border border-white/10 rounded px-1 text-right text-xs" />
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Montant TVA</span>
                  <span>{taxAmount.toFixed(2)} {invoice.currency}</span>
                </div>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Remise</span>
                  <input type="number" value={invoice.discount} onChange={e => setInvoice(p => ({ ...p, discount: parseFloat(e.target.value) || 0 }))} className="w-20 bg-white/5 border border-white/10 rounded px-2 text-right text-xs" />
                </div>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                <span>TOTAL</span>
                <span className="text-sky-500">{total.toFixed(2)} {invoice.currency}</span>
              </div>
            </div>
            <button onClick={generatePDF} className="w-full py-4 bg-sky-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">
              <Download className="w-5 h-5" /> Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// Day Planner
export const DayPlanner: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean; priority: 'low' | 'medium' | 'high' }[]>(() => {
    const saved = localStorage.getItem('kitobi_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('kitobi_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false, priority }]);
    setInput('');
  };

  const toggleTask = (id: number) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: number) => setTasks(tasks.filter(t => t.id !== id));

  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    high: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  return (
    <ToolLayout title="Planificateur de Journée" description="To-do list intelligente pour prioriser vos tâches quotidiennes." icon={Calendar} color="text-blue-400">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6">
          <div className="flex gap-4">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && addTask()} 
              placeholder="Qu'avez-vous à faire aujourd'hui ?" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-400/50 transition-all" 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                    priority === p ? priorityColors[p] : "bg-white/5 border-white/10 text-zinc-500"
                  )}
                >
                  {p === 'low' ? 'Basse' : p === 'medium' ? 'Moyenne' : 'Haute'}
                </button>
              ))}
            </div>
            <button onClick={addTask} className="px-8 py-3 bg-blue-400 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-400/20">
              Ajouter la tâche
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const pMap = { high: 0, medium: 1, low: 2 };
            return pMap[a.priority] - pMap[b.priority];
          }).map(task => (
            <div key={task.id} className={cn("flex items-center gap-4 p-5 rounded-2xl border transition-all group", task.completed ? "bg-white/[0.01] border-white/5 opacity-50" : "bg-white/[0.03] border-white/10 hover:border-white/20")}>
              <button onClick={() => toggleTask(task.id)} className="text-blue-400 transition-transform hover:scale-110">
                {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              <div className="flex-1 min-w-0">
                <span className={cn("block text-sm truncate", task.completed && "line-through text-zinc-600")}>{task.text}</span>
                <span className={cn("inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border", priorityColors[task.priority])}>
                  {task.priority}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-20 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10">
              <Calendar className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 italic text-sm">Votre journée est vide. Commencez par ajouter une tâche !</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

// Domain Generator
export const DomainGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const extensions = ['.com', '.io', '.ai', '.net', '.org', '.africa', '.fr', '.co'];

  const generate = async () => {
    if (!keyword.trim()) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const base = keyword.toLowerCase().replace(/\s+/g, '');
    const variations = [
      base,
      `get${base}`,
      `my${base}`,
      `${base}app`,
      `${base}hub`,
      `the${base}`,
      `${base}online`,
      `${base}pro`
    ];
    const generated = variations.flatMap(v => extensions.map(ext => v + ext));
    setResults(generated.sort(() => Math.random() - 0.5).slice(0, 24));
  };

  return (
    <ToolLayout title="Générateur de Domaines" description="Trouvez le nom parfait pour votre prochain projet ou startup." icon={Globe} color="text-indigo-500">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex gap-4">
          <input 
            value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="Entrez un mot-clé (ex: tech, bio, food...)" 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all" 
          />
          <button onClick={generate} className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">Générer</button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map(domain => (
              <div key={domain} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all group flex flex-col gap-2">
                <span className="text-sm font-bold truncate">{domain}</span>
                <button onClick={() => navigator.clipboard.writeText(domain)} className="text-[10px] font-bold text-zinc-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copier
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// Profit Margin Calculator
export const ProfitMarginCalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [cost, setCost] = useState<number>(100);
  const [price, setPrice] = useState<number>(150);
  const [currency, setCurrency] = useState('FCFA');

  const profit = price - cost;
  const margin = (profit / price) * 100;
  const markup = (profit / cost) * 100;

  return (
    <ToolLayout title="Calculateur de Marge" description="Analysez vos profits, marges et taux de marque instantanément." icon={TrendingUp} color="text-orange-500">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prix de Revient (Coût)</label>
            <div className="relative">
              <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold focus:outline-none focus:border-orange-500/50" />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{currency}</span>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prix de Vente</label>
            <div className="relative">
              <input type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold focus:outline-none focus:border-orange-500/50" />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{currency}</span>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Devise</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none appearance-none">
              {['€', '$', '£', 'FCFA', 'DH', 'DT', '₦', 'KSh', 'GH₵'].map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 text-center space-y-2">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Profit Net</p>
            <p className="text-5xl font-black text-white">{profit.toFixed(2)} {currency}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Marge Brute</p>
              <p className="text-2xl font-bold text-white">{margin.toFixed(1)}%</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Taux de Marque</p>
              <p className="text-2xl font-bold text-white">{markup.toFixed(1)}%</p>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 text-xs text-zinc-500 leading-relaxed italic">
            La marge brute est calculée sur le prix de vente, tandis que le taux de marque (markup) est calculé sur le prix de revient.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// WiFi QR Generator
export const WiFiQRGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [qrValue, setQrValue] = useState('');

  const generate = () => {
    if (!ssid) return;
    setQrValue(`WIFI:S:${ssid};T:${encryption};P:${password};;`);
  };

  const download = () => {
    const svg = document.getElementById('wifi-qr');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `wifi-${ssid}.png`;
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <ToolLayout title="Générateur QR WiFi" description="Créez un QR code pour partager votre WiFi sans donner le mot de passe." icon={Wifi} color="text-yellow-500">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nom du Réseau (SSID)</label>
            <input value={ssid} onChange={e => setSsid(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50" placeholder="Ex: MaBox_WiFi" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mot de Passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sécurité</label>
            <select value={encryption} onChange={e => setEncryption(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none appearance-none">
              <option value="WPA" className="bg-zinc-900">WPA/WPA2</option>
              <option value="WEP" className="bg-zinc-900">WEP</option>
              <option value="nopass" className="bg-zinc-900">Aucune</option>
            </select>
          </div>
          <button onClick={generate} className="w-full py-4 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" /> Générer le QR Code
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          <div className="p-8 rounded-[3rem] bg-white border-[12px] border-white shadow-2xl">
            {qrValue ? (
              <QRCodeSVG id="wifi-qr" value={qrValue} size={200} level="H" includeMargin={false} />
            ) : (
              <div className="w-[200px] h-[200px] bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-300">
                <QrCode className="w-12 h-12" />
              </div>
            )}
          </div>
          {qrValue && (
            <button onClick={download} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Télécharger l'image
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
