import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Zap, 
  Sun, 
  Moon,
  ChevronRight,
  Info,
  Home,
  LayoutGrid,
  Settings2,
  X,
  Menu,
  Send,
  FileText,
  UserCircle,
  Repeat,
  FileEdit,
  AlignLeft,
  Mail,
  Languages,
  ChevronDown,
  Search,
  Bell,
  LogOut,
  Smartphone,
  Hash,
  Globe,
  TrendingUp,
  CreditCard,
  Target,
  Rocket,
  Plus,
  Trash2,
  Maximize2,
  Dice5,
  SortAsc,
  List as ListIcon,
  Type,
  Link as LinkIcon,
  Scale,
  ScrollText,
  FlipVertical,
  Tags,
  CaseUpper,
  Eraser,
  ScanText,
  Activity,
  Code,
  Paintbrush,
  Terminal,
  ShieldAlert,
  Check,
  FileCode,
  Table,
  Calendar,
  Percent,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import confetti from 'canvas-confetti';

// --- Tool Components ---
import { 
  TextRewriter, 
  Summarizer, 
  Translator, 
  ArticleWriter,
  WordCounter,
  UpsideDownText,
  HashtagConverter,
  TextCompare,
  SlugConverter,
  LoremIpsum,
  CaseConverter,
  RemoveBreaks,
  RandomWord,
  TextRepeater,
  TextSorter,
  CommaSeparator,
  NumbersToWords,
  WordsToNumbers,
  TextToTags,
  BackgroundRemover, 
  OCRTool,
  MarketingGen,
  AdOptimizer,
  YTTagExtractor,
  YTTagGen,
  YTHashtagExtractor,
  YTHashtagGen,
  YTTitleGen,
  YTMoneyCalc,
  YTTitleLength,
  YTEmbedGen,
  YTThumbDownloader,
  YTLogoDownloader,
  YTBannerDownloader,
  YTChannelSearch,
  YTTitleExtractor,
  YTDescExtractor,
  YTDescGen,
  YTTimestampGen,
  YTSubLinkGen,
  YTTitleCap,
  YTViewRatio,
  YTChannelIdFinder,
  YTVideoStats,
  YTChannelStats,
  YTRegionCheck,
  YTCommentPicker,
  YTChannelAge,
  YTVideoCount,
  SEORank,
  SEOKeywords,
  SEODensity,
  SEOCache,
  SEOIndex,
  SEOMetaGen,
  SEOOGGen,
  SEOUTM,
  DomainToIP,
  DomainAge,
  DomainWhois,
  MyIP,
  IPLookup,
  HTMLBeautify,
  HTMLMinify,
  JSONValidator,
  CSVToJSON,
  CalcAdsense,
  CalcAge,
  CalcPercent,
  CalcPaypal
} from './components/tools/ToolWrappers';

// --- State and Types ---
type View = 'home' | 'features' | 'tools' | 'pricing' | 'dashboard' | 'blog' | 'community';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  color: string;
  isApi?: boolean;
  tier: 'Free' | 'Pro' | 'Entreprise';
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

const CATEGORIES: Category[] = [
  { id: 'marketing', name: 'Marketing & Contenu', icon: Rocket },
  { id: 'text', name: 'Texte & Rédaction', icon: FileEdit },
  { id: 'design', name: 'Design & Visuels', icon: ImageIcon },
  { id: 'youtube', name: 'Outils YouTube', icon: Smartphone },
  { id: 'seo', name: 'Référencement (SEO)', icon: TrendingUp },
  { id: 'domain', name: 'Domaine & IP', icon: Globe },
  { id: 'dev', name: 'Développement', icon: Settings2 },
  { id: 'calc', name: 'Calculateurs', icon: CreditCard },
  { id: 'utils', name: 'Utilitaires', icon: Zap },
];
const TOOLS: Tool[] = [
  // 1. Marketing
  { id: 'marketing-gen', name: 'Générateur Marketing', description: 'Hooks, posts et pages de vente.', icon: Rocket, category: 'marketing', color: 'text-orange-500', isApi: true, tier: 'Pro' },
  { id: 'ad-gen', name: 'Ads Optimizer', description: 'Annonces optimisées.', icon: Target, category: 'marketing', color: 'text-blue-500', isApi: true, tier: 'Pro' },
  
  // 2. Texte
  { id: 'article-writer', name: "Rédacteur d'articles", description: "Générez des articles complets.", icon: ScrollText, category: 'text', color: 'text-emerald-500', isApi: true, tier: 'Pro' },
  { id: 'rewriter', name: 'Réécrivain IA', description: 'Améliorez ou changez le ton.', icon: AlignLeft, category: 'text', color: 'text-blue-500', isApi: true, tier: 'Pro' },
  { id: 'summarizer', name: 'Résumeur IA', description: 'Condensez vos documents.', icon: FileText, category: 'text', color: 'text-purple-500', isApi: true, tier: 'Pro' },
  { id: 'translator', name: 'Traducteur IA', description: 'Traduisez dans toute langue.', icon: Languages, category: 'text', color: 'text-emerald-500', isApi: true, tier: 'Pro' },
  { id: 'word-counter', name: 'Compteur de mots', description: 'Outil de stats texte.', icon: Hash, category: 'text', color: 'text-blue-400', tier: 'Free' },
  { id: 'upside-down', name: 'Texte à l\'Envers', description: 'Inversez votre texte.', icon: FlipVertical, category: 'text', color: 'text-zinc-500', tier: 'Free' },
  { id: 'hashtag-converter', name: 'Texte en Hashtags', description: 'Tags sociaux.', icon: Hash, category: 'text', color: 'text-pink-500', tier: 'Free' },
  { id: 'text-compare', name: 'Comparaison de Texte', description: 'Trouvez les différences.', icon: Scale, category: 'text', color: 'text-orange-400', tier: 'Free' },
  { id: 'slug-converter', name: 'Générateur de Slug', description: 'URLs propres.', icon: LinkIcon, category: 'text', color: 'text-teal-500', tier: 'Free' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Texte de remplissage.', icon: FileText, category: 'text', color: 'text-zinc-400', tier: 'Free' },
  { id: 'case-converter', name: 'Convertisseur de Casse', description: 'MAJ/min.', icon: Type, category: 'text', color: 'text-indigo-500', tier: 'Free' },
  { id: 'remove-breaks', name: 'Supprimer Sauts Ligne', description: 'Nettoyez votre texte.', icon: Maximize2, category: 'text', color: 'text-rose-400', tier: 'Free' },
  { id: 'random-word', name: 'Mots Aléatoires', description: 'Inspiration.', icon: Dice5, category: 'text', color: 'text-violet-500', tier: 'Free' },
  { id: 'text-repeater', name: 'Répéteur de Texte', description: 'Répétition rapide.', icon: Repeat, category: 'text', color: 'text-orange-500', tier: 'Free' },
  { id: 'text-sorter', name: 'Trieur de Texte', description: 'Ordre alphabétique.', icon: SortAsc, category: 'text', color: 'text-emerald-400', tier: 'Free' },
  { id: 'comma-separator', name: 'Séparateur Virgules', description: 'Format CSV.', icon: ListIcon, category: 'text', color: 'text-blue-500', tier: 'Free' },
  { id: 'numbers-to-words', name: 'Nombres en Mots', description: '123 en texte.', icon: CaseUpper, category: 'text', color: 'text-teal-400', tier: 'Free' },
  { id: 'words-to-numbers', name: 'Mots en Nombres', description: 'Texte en chiffres.', icon: Hash, category: 'text', color: 'text-zinc-400', isApi: true, tier: 'Pro' },
  { id: 'text-to-tags', name: 'Texte en Balises', description: 'Mots-clés IA.', icon: Tags, category: 'text', color: 'text-amber-500', isApi: true, tier: 'Pro' },

  // 3. Design
  { id: 'bg-remover', name: 'Suppresseur de Fond', description: 'Détourage automatique.', icon: Eraser, category: 'design', color: 'text-blue-500', isApi: true, tier: 'Pro' },
  { id: 'ocr', name: 'Scan Texte (OCR)', description: 'Extrayez le texte des images.', icon: ScanText, category: 'text', color: 'text-zinc-400', isApi: true, tier: 'Pro' },

  // 4. YouTube
  { id: 'yt-tag-extractor', name: 'Extracteur de Balises', description: 'Extrayez les tags d\'une vidéo.', icon: Tags, category: 'youtube', color: 'text-red-500', isApi: true, tier: 'Free' },
  { id: 'yt-tag-gen', name: 'Générateur de Balises', description: 'Tags optimisés pour le SEO.', icon: Sparkles, category: 'youtube', color: 'text-red-600', isApi: true, tier: 'Pro' },
  { id: 'yt-hashtag-extractor', name: 'Extracteur de Hashtags', description: 'Trouvez les hashtags utilisés.', icon: Hash, category: 'youtube', color: 'text-red-400', tier: 'Free' },
  { id: 'yt-hashtag-gen', name: 'Générateur de Hashtags', description: 'Hashtags viraux.', icon: Sparkles, category: 'youtube', color: 'text-pink-500', isApi: true, tier: 'Pro' },
  { id: 'yt-title-extractor', name: 'Extracteur de Titre', description: 'Récupérez le titre exact.', icon: Type, category: 'youtube', color: 'text-red-500', tier: 'Free' },
  { id: 'yt-title-gen', name: 'Générateur de Titres', description: 'Titres clickbait & SEO.', icon: Sparkles, category: 'youtube', color: 'text-red-600', isApi: true, tier: 'Pro' },
  { id: 'yt-title-length', name: 'Vérificateur Longueur', description: 'Respectez les limites YouTube.', icon: Scale, category: 'youtube', color: 'text-zinc-500', tier: 'Free' },
  { id: 'yt-desc-extractor', name: 'Extracteur de Description', description: 'Copiez la description complète.', icon: AlignLeft, category: 'youtube', color: 'text-red-400', tier: 'Free' },
  { id: 'yt-desc-gen', name: 'Générateur de Description', description: 'Descriptions structurées IA.', icon: FileEdit, category: 'youtube', color: 'text-red-600', isApi: true, tier: 'Pro' },
  { id: 'yt-embed-gen', name: 'Générateur Code Intégration', description: 'Code iframe personnalisable.', icon: LinkIcon, category: 'youtube', color: 'text-blue-500', tier: 'Free' },
  { id: 'yt-channel-id', name: 'Recherche ID Chaîne', description: 'Trouvez l\'ID système.', icon: Search, category: 'youtube', color: 'text-zinc-500', tier: 'Free' },
  { id: 'yt-video-stats', name: 'Statistiques Vidéo', description: 'Analyse performance IA.', icon: Target, category: 'youtube', color: 'text-red-500', isApi: true, tier: 'Pro' },
  { id: 'yt-channel-stats', name: 'Statistiques Chaîne', description: 'Analyse globale IA.', icon: Rocket, category: 'youtube', color: 'text-red-600', isApi: true, tier: 'Pro' },
  { id: 'yt-region-check', name: 'Restriction Région', description: 'Vérifiez les blocages géo.', icon: Globe, category: 'youtube', color: 'text-blue-400', tier: 'Free' },
  { id: 'yt-thumb-downloader', name: 'Téléchargeur de Vignette', description: 'Récupérez l\'image HD.', icon: ImageIcon, category: 'youtube', color: 'text-red-500', tier: 'Free' },
  { id: 'yt-logo-downloader', name: 'Logo de Chaîne', description: 'Téléchargez la photo de profil.', icon: UserCircle, category: 'youtube', color: 'text-red-400', tier: 'Free' },
  { id: 'yt-banner-downloader', name: 'Bannière de Chaîne', description: 'Téléchargez la couverture.', icon: ImageIcon, category: 'youtube', color: 'text-red-600', tier: 'Free' },
  { id: 'yt-channel-search', name: 'Recherche de Chaînes', description: 'Trouvez des chaînes par sujet.', icon: Search, category: 'youtube', color: 'text-zinc-500', isApi: true, tier: 'Pro' },
  { id: 'yt-timestamp-gen', name: 'Lien d\'Horodatage', description: 'Partagez un moment précis.', icon: Zap, category: 'youtube', color: 'text-orange-500', tier: 'Free' },
  { id: 'yt-sub-link', name: 'Lien d\'Abonnement', description: 'Boostez vos conversions.', icon: Plus, category: 'youtube', color: 'text-red-600', tier: 'Free' },
  { id: 'yt-money-calc', name: 'Calculateur d\'Argent', description: 'Estimez les revenus potentiels.', icon: CreditCard, category: 'youtube', color: 'text-emerald-500', tier: 'Free' },
  { id: 'yt-video-count', name: 'Compteur de Vidéos', description: 'Stats de production.', icon: Hash, category: 'youtube', color: 'text-zinc-500', tier: 'Free' },
  { id: 'yt-title-cap', name: 'Capitaliseur de Titres', description: 'Formatage automatique.', icon: Type, category: 'youtube', color: 'text-zinc-400', tier: 'Free' },
  { id: 'yt-comment-picker', name: 'Sélecteur de Commentaires', description: 'Gagnant pour concours.', icon: UserCircle, category: 'youtube', color: 'text-orange-400', tier: 'Free' },
  { id: 'yt-view-ratio', name: 'Ratio de Vues', description: 'Engagement par rapport aux subs.', icon: TrendingUp, category: 'youtube', color: 'text-red-500', tier: 'Free' },
  { id: 'yt-channel-age', name: 'Âge de la Chaîne', description: 'Date de création exacte.', icon: FileText, category: 'youtube', color: 'text-zinc-600', tier: 'Free' },
  { id: 'yt-video-count', name: 'Compteur de Vidéos', description: 'Stats de production.', icon: Hash, category: 'youtube', color: 'text-zinc-500', tier: 'Free' },

  // 5. SEO
  { id: 'seo-rank', name: 'Classement Web', description: 'Vérifiez la position sur Google.', icon: TrendingUp, category: 'seo', color: 'text-orange-500', isApi: true, tier: 'Pro' },
  { id: 'seo-keywords', name: 'Suggestions Mots-Clés', description: 'Idées pour votre contenu.', icon: Search, category: 'seo', color: 'text-blue-500', isApi: true, tier: 'Pro' },
  { id: 'seo-density', name: 'Densité Mots-Clés', description: 'Analysez l\'optimisation.', icon: Hash, category: 'seo', color: 'text-emerald-500', tier: 'Free' },
  { id: 'seo-cache', name: 'Vérificateur de Cache', description: 'Dernière visite Google.', icon: Globe, category: 'seo', color: 'text-indigo-500', isApi: true, tier: 'Pro' },
  { id: 'seo-index', name: 'Index Google', description: 'Vérifiez l\'indexation.', icon: ScanText, category: 'seo', color: 'text-blue-400', isApi: true, tier: 'Pro' },
  { id: 'seo-meta-gen', name: 'Tags Méta (Gen)', description: 'Créez vos balises SEO.', icon: FileEdit, category: 'seo', color: 'text-orange-600', tier: 'Free' },
  { id: 'seo-meta-ana', name: 'Tags Méta (Ana)', description: 'Analysez vos balises.', icon: Search, category: 'seo', color: 'text-emerald-600', isApi: true, tier: 'Pro' },
  { id: 'seo-og-gen', name: 'Open Graph (Gen)', description: 'Tags réseaux sociaux.', icon: Sparkles, category: 'seo', color: 'text-blue-600', tier: 'Free' },
  { id: 'seo-twitter-gen', name: 'Twitter Cards', description: 'Optimisez pour X.', icon: Smartphone, category: 'seo', color: 'text-zinc-500', tier: 'Free' },
  { id: 'seo-utm', name: 'Générateur UTM', description: 'Suivez vos campagnes.', icon: LinkIcon, category: 'seo', color: 'text-orange-500', tier: 'Free' },

  // 6. Domain & IP
  { id: 'domain-ip', name: 'Domaine vers IP', description: 'Trouvez l\'adresse serveur.', icon: Globe, category: 'domain', color: 'text-blue-500', tier: 'Free' },
  { id: 'domain-age', name: 'Âge Domaine', description: 'Date de premier achat.', icon: FileText, category: 'domain', color: 'text-emerald-500', tier: 'Free' },
  { id: 'domain-whois', name: 'Recherche Whois', description: 'Propriétaire du domaine.', icon: Search, category: 'domain', color: 'text-indigo-500', tier: 'Free' },
  { id: 'domain-dns', name: 'Enregistrements DNS', description: 'A, MX, CNAME, TXT.', icon: Settings2, category: 'domain', color: 'text-blue-600', tier: 'Free' },
  { id: 'my-ip', name: 'Mon IP', description: 'Votre adresse actuelle.', icon: Hash, category: 'domain', color: 'text-orange-500', tier: 'Free' },
  { id: 'ip-lookup', name: 'Localisation IP', description: 'Infos ville et pays.', icon: Globe, category: 'domain', color: 'text-emerald-400', tier: 'Free' },

  // 7. Web Management
  { id: 'robots-gen', name: 'Robots.txt (Gen)', description: 'Guidez les robots.', icon: FileEdit, category: 'utils', color: 'text-zinc-600', tier: 'Free' },
  { id: 'http-status', name: 'Code État HTTP', description: '200, 404, 500...', icon: Zap, category: 'utils', color: 'text-red-500', tier: 'Free' },
  { id: 'htaccess-gen', name: 'Htaccess Redir', description: 'Code de redirection.', icon: Repeat, category: 'utils', color: 'text-orange-500', tier: 'Free' },
  { id: 'server-status', name: 'État du Serveur', description: 'Disponibilité en ligne.', icon: Activity, category: 'utils', color: 'text-emerald-500', tier: 'Free' },
  { id: 'http-headers', name: 'En-têtes HTTP', description: 'Réponse serveur brute.', icon: AlignLeft, category: 'utils', color: 'text-blue-500', tier: 'Free' },
  { id: 'page-size', name: 'Taille de Page', description: 'Analyse du poids.', icon: Scale, category: 'utils', color: 'text-zinc-500', tier: 'Free' },
  { id: 'wp-theme', name: 'Thème WP Detector', description: 'Trouvez le thème utilisé.', icon: LayoutGrid, category: 'utils', color: 'text-blue-400', isApi: true, tier: 'Pro' },
  { id: 'faq-schema', name: 'Schéma FAQ', description: 'Rich snippets Google.', icon: ListIcon, category: 'utils', color: 'text-orange-600', tier: 'Free' },

  // 8. Development
  { id: 'html-beautify', name: 'HTML Beautifier', description: 'Code propre et lisible.', icon: Code, category: 'dev', color: 'text-orange-500', tier: 'Free' },
  { id: 'html-minify', name: 'Minification HTML', description: 'Réduisez le poids.', icon: Maximize2, category: 'dev', color: 'text-orange-600', tier: 'Free' },
  { id: 'css-beautify', name: 'CSS Beautifier', description: 'Formatage impeccable.', icon: Paintbrush, category: 'dev', color: 'text-blue-500', tier: 'Free' },
  { id: 'css-minify', name: 'Minification CSS', description: 'Vitesse de chargement.', icon: Maximize2, category: 'dev', color: 'text-blue-600', tier: 'Free' },
  { id: 'js-beautify', name: 'JS Beautifier', description: 'Scripts lisibles.', icon: Terminal, category: 'dev', color: 'text-yellow-500', tier: 'Free' },
  { id: 'js-minify', name: 'Minification JS', description: 'Optimisation JS.', icon: Maximize2, category: 'dev', color: 'text-yellow-600', tier: 'Free' },
  { id: 'js-obfuscator', name: 'Obfuscateur JS', description: 'Protégez votre code.', icon: ShieldAlert, category: 'dev', color: 'text-red-500', tier: 'Pro' },
  { id: 'json-validator', name: 'Validateur JSON', description: 'Vérifiez la syntaxe.', icon: Check, category: 'dev', color: 'text-emerald-500', tier: 'Free' },
  { id: 'json-to-xml', name: 'JSON en XML', description: 'Convertisseur rapide.', icon: FileCode, category: 'dev', color: 'text-blue-400', tier: 'Free' },
  { id: 'xml-to-json', name: 'XML en JSON', description: 'Convertisseur rapide.', icon: FileCode, category: 'dev', color: 'text-orange-400', tier: 'Free' },
  { id: 'csv-to-json', name: 'CSV en JSON', description: 'Données tabulaires.', icon: Table, category: 'dev', color: 'text-emerald-600', tier: 'Free' },

  // 9. Calculators
  { id: 'calc-adsense', name: 'Calculateur Adsense', description: 'Estimations de revenus.', icon: CreditCard, category: 'calc', color: 'text-orange-500', tier: 'Free' },
  { id: 'calc-age', name: 'Calculateur d\'Âge', description: 'Âge précis au jour près.', icon: Calendar, category: 'calc', color: 'text-blue-500', tier: 'Free' },
  { id: 'calc-percent', name: 'Calcul de Pourcentage', description: 'Calculs rapides.', icon: Percent, category: 'calc', color: 'text-emerald-500', tier: 'Free' },
  { id: 'calc-paypal', name: 'Frais PayPal', description: 'Calculez les commissions.', icon: Wallet, category: 'calc', color: 'text-blue-600', tier: 'Free' },
  { id: 'calc-cpm', name: 'Calculateur CPM', description: 'Coût pour mille vues.', icon: TrendingUp, category: 'calc', color: 'text-red-500', tier: 'Free' },
  { id: 'calc-loan', name: 'Calculateur de Prêt', description: 'Mensualités et intérêts.', icon: Home, category: 'calc', color: 'text-indigo-500', tier: 'Free' },
];

export default function App() {
  const [view, setView] = useState<View>('home');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kitobi_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('kitobi_theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderNavbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-app-bg/80 backdrop-blur-md border-b border-app-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); setActiveToolId(null); }}>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-app-fg italic">Kitobi<span className="text-orange-500">.io</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <button onClick={() => setView('tools')} className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted hover:text-orange-500 transition-colors">Labo Outils</button>
            <button onClick={() => setView('pricing')} className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted hover:text-orange-500 transition-colors">Pro / Tarifs</button>
          </div>
          
          <div className="h-4 w-px bg-app-border mx-2" />
          
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 text-app-muted hover:text-orange-500 bg-app-fg/5 rounded-2xl transition-all border border-app-border">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button className="px-6 py-2.5 bg-app-fg/5 text-app-fg text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-app-fg/10 transition-all border border-app-border">
              Se connecter
            </button>
            
            <button className="px-6 py-2.5 bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
              Accès Illimité
            </button>
          </div>
        </div>

        <button className="md:hidden p-2 text-app-fg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );

  const renderTool = () => {
    if (!activeToolId) return null;
    const tool = TOOLS.find(t => t.id === activeToolId);
    if (!tool) return null;

    switch (tool.id) {
      case 'marketing-gen': return <MarketingGen />;
      case 'ad-gen': return <AdOptimizer />;
      case 'rewriter': return <TextRewriter />;
      case 'summarizer': return <Summarizer />;
      case 'translator': return <Translator />;
      case 'article-writer': return <ArticleWriter />;
      case 'word-counter': return <WordCounter />;
      case 'upside-down': return <UpsideDownText />;
      case 'hashtag-converter': return <HashtagConverter />;
      case 'text-compare': return <TextCompare />;
      case 'slug-converter': return <SlugConverter />;
      case 'lorem-ipsum': return <LoremIpsum />;
      case 'case-converter': return <CaseConverter />;
      case 'remove-breaks': return <RemoveBreaks />;
      case 'random-word': return <RandomWord />;
      case 'text-repeater': return <TextRepeater />;
      case 'text-sorter': return <TextSorter />;
      case 'comma-separator': return <CommaSeparator />;
      case 'numbers-to-words': return <NumbersToWords />;
      case 'words-to-numbers': return <WordsToNumbers />;
      case 'text-to-tags': return <TextToTags />;
      case 'bg-remover': return <BackgroundRemover />;
      case 'ocr': return <OCRTool />;
      case 'yt-tag-extractor': return <YTTagExtractor />;
      case 'yt-tag-gen': return <YTTagGen />;
      case 'yt-hashtag-extractor': return <YTHashtagExtractor />;
      case 'yt-hashtag-gen': return <YTHashtagGen />;
      case 'yt-title-gen': return <YTTitleGen />;
      case 'yt-money-calc': return <YTMoneyCalc />;
      case 'yt-title-length': return <YTTitleLength />;
      case 'yt-embed-gen': return <YTEmbedGen />;
      case 'yt-thumb-downloader': return <YTThumbDownloader />;
      case 'yt-logo-downloader': return <YTLogoDownloader />;
      case 'yt-banner-downloader': return <YTBannerDownloader />;
      case 'yt-channel-search': return <YTChannelSearch />;
      case 'yt-title-extractor': return <YTTitleExtractor />;
      case 'yt-desc-extractor': return <YTDescExtractor />;
      case 'yt-desc-gen': return <YTDescGen />;
      case 'yt-timestamp-gen': return <YTTimestampGen />;
      case 'yt-sub-link': return <YTSubLinkGen />;
      case 'yt-title-cap': return <YTTitleCap />;
      case 'yt-view-ratio': return <YTViewRatio />;
      case 'yt-channel-id': return <YTChannelIdFinder />;
      case 'yt-video-stats': return <YTVideoStats />;
      case 'yt-channel-stats': return <YTChannelStats />;
      case 'yt-region-check': return <YTRegionCheck />;
      case 'yt-comment-picker': return <YTCommentPicker />;
      case 'yt-channel-age': return <YTChannelAge />;
      case 'yt-video-count': return <YTVideoCount />;
      
      // SEO
      case 'seo-rank': return <SEORank />;
      case 'seo-keywords': return <SEOKeywords />;
      case 'seo-density': return <SEODensity />;
      case 'seo-cache': return <SEOCache />;
      case 'seo-index': return <SEOIndex />;
      case 'seo-meta-gen': return <SEOMetaGen />;
      case 'seo-og-gen': return <SEOOGGen />;
      case 'seo-utm': return <SEOUTM />;

      // Domain
      case 'domain-ip': return <DomainToIP />;
      case 'domain-age': return <DomainAge />;
      case 'domain-whois': return <DomainWhois />;
      case 'my-ip': return <MyIP />;
      case 'ip-lookup': return <IPLookup />;

      // Dev
      case 'html-beautify': return <HTMLBeautify />;
      case 'html-minify': return <HTMLMinify />;
      case 'json-validator': return <JSONValidator />;
      case 'csv-to-json': return <CSVToJSON />;

      // Calc
      case 'calc-adsense': return <CalcAdsense />;
      case 'calc-age': return <CalcAge />;
      case 'calc-percent': return <CalcPercent />;
      case 'calc-paypal': return <CalcPaypal />;
      
      default: return (
        <div className="flex items-center justify-center h-full text-app-muted">
          Cet outil est en cours de développement.
        </div>
      );
    }
  };

  const renderDashboard = () => (
    <div className="flex h-screen bg-app-bg pt-16 transition-colors font-sans">
      <aside className="w-64 border-r border-app-border hidden lg:block bg-app-card/30 transition-colors">
        <div className="p-6 space-y-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Explorer Kitobi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-2xl py-2.5 pl-10 pr-4 text-xs text-app-fg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-3">
              <h3 className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Outils Favoris</h3>
              <Sparkles className="w-3 h-3 text-orange-500" />
            </div>
            <div className="space-y-1">
              {TOOLS.slice(0, 4).map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setActiveToolId(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all font-bold text-[13px] group",
                    activeToolId === t.id ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30" : "text-app-muted hover:bg-app-fg/5 hover:text-app-fg"
                  )}
                >
                  <t.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeToolId === t.id ? "text-white" : t.color)} /> 
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-app-border">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Stockage Cloud</p>
              <div className="h-1.5 w-full bg-app-fg/5 rounded-full overflow-hidden mb-2">
                <div className="h-full w-2/3 bg-indigo-500" />
              </div>
              <p className="text-[10px] text-app-muted font-bold">1.2 GB / 2 GB utilisés</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12 relative">
        <AnimatePresence mode="wait">
          {!activeToolId ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto space-y-16"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full w-fit"
                  >
                    <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Nouveaux Outils IA</span>
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-app-fg uppercase font-display italic tracking-tight leading-none">
                    Kit de <span className="text-orange-500">Puissance</span>
                  </h1>
                  <p className="text-app-muted font-medium text-lg max-w-xl">L'arsenal complet pour rédiger, designer et automatiser votre quotidien avec l'intelligence artificielle.</p>
                </div>
                
                <div className="flex gap-2 bg-app-card/50 p-1 rounded-2xl border border-app-border">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                        activeCategory === cat.id ? "bg-app-fg text-app-bg shadow-lg" : "text-app-muted hover:text-app-fg"
                      )}
                    >
                      <cat.icon className="w-3.5 h-3.5" /> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTools.map((tool, idx) => (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setActiveToolId(tool.id)}
                    className="p-8 rounded-[40px] bg-app-card border border-app-border hover:border-orange-500/40 transition-all group text-left relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 flex flex-col"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <tool.icon className="w-24 h-24 rotate-12" />
                    </div>
                    
                    <div className={cn("w-16 h-16 rounded-3xl bg-app-fg/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner", tool.color)}>
                      <tool.icon className="w-8 h-8" />
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl text-app-fg uppercase font-display italic tracking-tight group-hover:text-orange-500 transition-colors">{tool.name}</h3>
                        {tool.isApi && <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />}
                      </div>
                      <p className="text-[13px] text-app-muted leading-relaxed font-bold tracking-tight opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">{tool.description}</p>
                    </div>

                    {tool.tier !== 'Free' && (
                      <div className="absolute top-6 left-6 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                         <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{tool.tier}</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="tool"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full max-w-7xl mx-auto"
            >
              <button 
                onClick={() => setActiveToolId(null)} 
                className="mb-10 flex items-center gap-3 text-xs font-black text-app-muted hover:text-app-fg transition-all uppercase tracking-[0.2em] group"
              >
                <div className="w-8 h-8 rounded-full bg-app-fg/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </div>
                Retour au catalogue
              </button>
              <div className="bg-app-card/50 border border-app-border rounded-[48px] p-8 md:p-12 shadow-2xl backdrop-blur-xl h-[calc(100%-80px)] overflow-y-auto">
                {renderTool()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-app-bg text-app-fg selection:bg-orange-500/30 transition-colors">
      {renderNavbar()}
      {view === 'home' || view === 'tools' ? renderDashboard() : (
        <div className="pt-24 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black uppercase text-app-fg mb-4">Page {view}</h1>
          <p className="text-app-muted">Cette section est en cours d'amélioration.</p>
        </div>
      )}
    </div>
  );
}
