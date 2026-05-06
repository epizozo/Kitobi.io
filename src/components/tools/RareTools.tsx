import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { 
  ShieldCheck, 
  Calculator, 
  Camera, 
  Mail, 
  Download, 
  Copy, 
  Check, 
  RefreshCw,
  Info,
  FileText,
  User,
  Globe,
  MapPin,
  Phone,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import EXIF from 'exif-js';

import { jsPDF } from 'jspdf';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip 
} from 'recharts';

// Legal Generator
export const LegalGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    email: '',
    phone: '',
    director: '',
    siret: '',
    capital: '',
    rcs: '',
    host: 'Vercel / Cloud Run',
    hostAddress: 'San Francisco, USA',
    type: 'mentions' // mentions, cgu, privacy, cookies
  });
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!formData.companyName) return;

    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    let text = '';
    if (formData.type === 'mentions') {
      text = `MENTIONS LÉGALES

Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site ${formData.companyName} les présentes mentions légales.

1. ÉDITEUR
Le site est édité par ${formData.companyName}, au capital de ${formData.capital || '[MONTANT]'} euros, immatriculée au Registre du Commerce et des Sociétés de ${formData.rcs || '[VILLE]'} sous le numéro ${formData.siret || '[NUMÉRO]'}.
Siège social : ${formData.address}
Directeur de la publication : ${formData.director}
Contact : ${formData.email} / ${formData.phone}

2. HÉBERGEUR
Le site est hébergé par ${formData.host}, dont le siège social est situé à ${formData.hostAddress}.

3. PROPRIÉTÉ INTELLECTUELLE
L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.`;
    } else if (formData.type === 'privacy') {
      text = `POLITIQUE DE CONFIDENTIALITÉ

1. COLLECTE DES DONNÉES
Nous collectons les informations suivantes : ${formData.email}, ${formData.phone}.

2. FINALITÉ
Les données sont collectées pour : la gestion des commandes, l'envoi de newsletters, l'amélioration du service.

3. DURÉE DE CONSERVATION
Vos données sont conservées pendant une durée de 3 ans à compter de votre dernière activité.

4. VOS DROITS
Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à : ${formData.email}.`;
    } else if (formData.type === 'cgu') {
      text = `CONDITIONS GÉNÉRALES D'UTILISATION (CGU)

1. OBJET
Les présentes CGU ont pour objet l'encadrement juridique des modalités de mise à disposition du site et des services par ${formData.companyName}.

2. ACCÈS AU SITE
Le site est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. Tous les frais supportés par l'utilisateur pour accéder au service sont à sa charge.

3. RESPONSABILITÉ DE L'ÉDITEUR
L'éditeur ne peut être tenu responsable en cas de défaillance, panne, difficulté ou interruption de fonctionnement, empêchant l'accès au site ou à l'une de ses fonctionnalités.

4. PROPRIÉTÉ INTELLECTUELLE
Les marques, logos, signes ainsi que tous les contenus du site font l'objet d'une protection par le Code de la propriété intellectuelle.`;
    } else if (formData.type === 'cookies') {
      text = `POLITIQUE DE COOKIES

1. QU'EST-CE QU'UN COOKIE ?
Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site.

2. UTILISATION DES COOKIES
Nous utilisons des cookies pour :
- Assurer le bon fonctionnement du site
- Analyser notre trafic
- Personnaliser votre expérience

3. VOS CHOIX
Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti avant leur installation.`;
    }
    setResult(text);
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(result, 180);
    doc.text(splitText, 15, 20);
    doc.save(`${formData.type}_${formData.companyName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <ToolLayout title="Générateur Légal" description="Générez vos mentions légales, CGU et politiques de confidentialité." icon={ShieldCheck} color="text-indigo-400">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'mentions', label: 'Mentions' },
              { id: 'privacy', label: 'Confidentialité' },
              { id: 'cgu', label: 'CGU' },
              { id: 'cookies', label: 'Cookies' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setFormData(f => ({ ...f, type: t.id }))} 
                className={cn(
                  "py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all", 
                  formData.type === t.id ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-zinc-500"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <input placeholder="Nom de l'entreprise" value={formData.companyName} onChange={e => setFormData(f => ({ ...f, companyName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <input placeholder="Adresse du siège" value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="SIRET" value={formData.siret} onChange={e => setFormData(f => ({ ...f, siret: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              <input placeholder="Capital Social" value={formData.capital} onChange={e => setFormData(f => ({ ...f, capital: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              <input placeholder="Téléphone" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            </div>
            <input placeholder="Directeur de publication" value={formData.director} onChange={e => setFormData(f => ({ ...f, director: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Hébergeur" value={formData.host} onChange={e => setFormData(f => ({ ...f, host: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              <input placeholder="Adresse Hébergeur" value={formData.hostAddress} onChange={e => setFormData(f => ({ ...f, hostAddress: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
          <button onClick={generate} className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">Générer le texte</button>
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Aperçu du document</label>
            <div className="flex items-center gap-4">
              {result && (
                <>
                  <button onClick={downloadPDF} className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">
                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} {copied ? 'Copié !' : 'Copier'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 text-sm font-mono whitespace-pre-wrap overflow-y-auto min-h-[400px]">
            {result || <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic gap-4">
              <FileText className="w-12 h-12 opacity-20" />
              Remplissez les informations pour générer votre document.
            </div>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// Loan Calculator
export const LoanCalculator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(3.5);
  const [duration, setDuration] = useState(20);
  const [currency, setCurrency] = useState('FCFA');
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number; schedule: any[] } | null>(null);

  const CURRENCIES = ['€', '$', '£', 'FCFA', 'DH', 'DT', '₦', 'KSh', 'GH₵'];

  const calculate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const r = rate / 100 / 12;
    const n = duration * 12;
    const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - amount;

    // Amortization schedule (first 12 months)
    let balance = amount;
    const schedule = [];
    for (let i = 1; i <= Math.min(n, 60); i++) {
      const interestPayment = balance * r;
      const principalPayment = monthly - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month: i,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setResult({ monthly, total, interest, schedule });
  };

  return (
    <ToolLayout title="Calculateur de Prêt" description="Simulez vos mensualités et le coût total de votre crédit immobilier ou personnel." icon={Calculator} color="text-emerald-400">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                Montant du prêt <span>{amount.toLocaleString()} {currency}</span>
              </label>
              <input type="range" min="1000" max="1000000" step="1000" value={amount} onChange={e => setAmount(parseInt(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Devise</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                {CURRENCIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                Taux d'intérêt (%) <span>{rate} %</span>
              </label>
              <input type="range" min="0.1" max="15" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                Durée (années) <span>{duration} ans</span>
              </label>
              <input type="range" min="1" max="30" step="1" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <button onClick={calculate} className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">Calculer</button>
          </div>

          <div className="space-y-8">
            {result ? (
              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Mensualité Estimée</p>
                  <p className="text-5xl font-black text-white">{Math.round(result.monthly).toLocaleString()} {currency}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Coût Total</p>
                    <p className="text-xl font-bold">{Math.round(result.total).toLocaleString()} {currency}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Intérêts</p>
                    <p className="text-xl font-bold text-emerald-500">{Math.round(result.interest).toLocaleString()} {currency}</p>
                  </div>
                </div>

                <div className="h-[200px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.schedule}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest mt-2">Évolution du solde restant</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic gap-4 py-12">
                <Calculator className="w-16 h-16 opacity-20" />
                <p className="text-center max-w-[200px]">Ajustez les paramètres et cliquez sur calculer pour voir les résultats.</p>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Tableau d'amortissement (5 premières années)
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 font-bold uppercase text-[10px] text-zinc-500">Mois</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] text-zinc-500">Principal</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] text-zinc-500">Intérêts</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] text-zinc-500">Solde restant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-400">{row.month}</td>
                      <td className="px-6 py-4 font-bold">{Math.round(row.principal).toLocaleString()} {currency}</td>
                      <td className="px-6 py-4 text-emerald-500">{Math.round(row.interest).toLocaleString()} {currency}</td>
                      <td className="px-6 py-4 text-zinc-500">{Math.round(row.balance).toLocaleString()} {currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

// EXIF Extractor
export const ExifExtractor: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [image, setImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      
      // Extract EXIF
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        EXIF.getData(img as any, function(this: any) {
          const allMetaData = EXIF.getAllTags(this);
          setMetadata(allMetaData);
          setLoading(false);
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const removeExif = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image_no_exif.jpg';
            a.click();
          }
        }, 'image/jpeg', 0.95);
      }
    };
  };

  return (
    <ToolLayout title="Extracteur EXIF" description="Découvrez les métadonnées cachées de vos photos (appareil, réglages, date, GPS)." icon={Camera} color="text-amber-400">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="p-12 rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6">
            <input type="file" accept="image/jpeg" onChange={handleImage} className="hidden" id="exif-upload" />
            <label htmlFor="exif-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Choisir une photo</p>
                <p className="text-xs text-zinc-500">Format JPEG uniquement (EXIF)</p>
              </div>
            </label>
          </div>
          {image && (
            <div className="space-y-4">
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 aspect-video">
                <img src={image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <button 
                onClick={removeExif}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Télécharger sans métadonnées (Anonymiser)
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Métadonnées Détectées</label>
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 min-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-500 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
                Extraction en cours...
              </div>
            ) : metadata && Object.keys(metadata).length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold mb-1">Appareil</p>
                    <p className="text-sm font-bold">{metadata.Make} {metadata.Model || 'Inconnu'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold mb-1">Date</p>
                    <p className="text-sm font-bold">{metadata.DateTimeOriginal || 'Inconnue'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(metadata).map(([key, val]: [string, any]) => {
                    if (typeof val === 'object' || key === 'thumbnail') return null;
                    return (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                        <span className="text-zinc-500 font-mono">{key}</span>
                        <span className="font-bold text-zinc-300">{String(val)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic gap-4">
                <Info className="w-12 h-12 opacity-20" />
                <p className="text-center max-w-[200px]">Aucune donnée EXIF trouvée ou image non chargée.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

// Email Signature Generator
export const EmailSignatureGenerator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => {
  const [data, setData] = useState({
    name: 'John Doe',
    role: 'Directeur Créatif',
    company: 'Kitobi.io',
    email: 'john@example.com',
    phone: '+33 6 12 34 56 78',
    website: 'www.kitobi.io',
    linkedin: '',
    twitter: '',
    color: '#f97316',
    logo: ''
  });
  const [copied, setCopied] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setData(d => ({ ...d, logo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (onProcess) {
      const allowed = await onProcess();
      if (!allowed) return;
    }

    const html = `
<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; border-collapse: collapse;">
  <tr>
    ${data.logo ? `
    <td style="padding-right: 20px; vertical-align: top; border-right: 2px solid ${data.color};">
      <img src="${data.logo}" width="80" height="80" style="border-radius: 10px; object-fit: cover;" />
    </td>
    ` : ''}
    <td style="padding-left: ${data.logo ? '20px' : '0'}; vertical-align: top;">
      <div style="font-weight: bold; font-size: 18px; color: ${data.color};">${data.name}</div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">${data.role} | ${data.company}</div>
      <div style="font-size: 13px;">
        <span style="color: ${data.color}; font-weight: bold;">E:</span> <a href="mailto:${data.email}" style="color: #666; text-decoration: none;">${data.email}</a><br>
        <span style="color: ${data.color}; font-weight: bold;">T:</span> ${data.phone}<br>
        <span style="color: ${data.color}; font-weight: bold;">W:</span> <a href="https://${data.website}" style="color: #666; text-decoration: none;">${data.website}</a>
      </div>
      <div style="margin-top: 10px;">
        ${data.linkedin ? `<a href="${data.linkedin}" style="display: inline-block; margin-right: 10px; text-decoration: none; color: ${data.color}; font-weight: bold; font-size: 12px;">LinkedIn</a>` : ''}
        ${data.twitter ? `<a href="${data.twitter}" style="display: inline-block; text-decoration: none; color: ${data.color}; font-weight: bold; font-size: 12px;">Twitter</a>` : ''}
      </div>
    </td>
  </tr>
</table>
    `.trim();
    setGeneratedHtml(html);
  };

  return (
    <ToolLayout title="Signature d'Email" description="Créez une signature professionnelle et élégante pour vos emails pro." icon={Mail} color="text-pink-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <input placeholder="Nom complet" value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              <input placeholder="Poste" value={data.role} onChange={e => setData(d => ({ ...d, role: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              <input placeholder="Entreprise" value={data.company} onChange={e => setData(d => ({ ...d, company: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 relative group overflow-hidden h-full">
                {data.logo ? (
                  <img src={data.logo} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-600" />
                )}
                <span className="text-[8px] font-bold uppercase text-zinc-500">Logo / Photo</span>
                <input type="file" accept="image/*" onChange={handleLogo} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Email" value={data.email} onChange={e => setData(d => ({ ...d, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <input placeholder="Téléphone" value={data.phone} onChange={e => setData(d => ({ ...d, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
          </div>
          <input placeholder="Site Web" value={data.website} onChange={e => setData(d => ({ ...d, website: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
          
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Lien LinkedIn" value={data.linkedin} onChange={e => setData(d => ({ ...d, linkedin: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <input placeholder="Lien Twitter" value={data.twitter} onChange={e => setData(d => ({ ...d, twitter: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Couleur de marque</label>
            <input type="color" value={data.color} onChange={e => setData(d => ({ ...d, color: e.target.value }))} className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer" />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all"
          >
            Générer la Signature
          </button>
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Aperçu du rendu</label>
          <div className="p-10 rounded-[3rem] bg-white border border-zinc-200 min-h-[200px] flex items-center justify-center shadow-inner">
            {generatedHtml ? (
              <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            ) : (
              <div className="text-zinc-400 italic text-sm">Cliquez sur générer pour voir l'aperçu</div>
            )}
          </div>
          <button 
            onClick={() => {
              if (!generatedHtml) return;
              navigator.clipboard.writeText(generatedHtml);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            disabled={!generatedHtml}
            className="w-full py-5 bg-pink-500 text-white rounded-[2rem] font-bold text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            {copied ? 'HTML Copié !' : 'Copier le code HTML'}
          </button>
          <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest leading-relaxed">
            Collez ce code dans les paramètres de signature de votre client mail (Gmail, Outlook, etc.).
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};
