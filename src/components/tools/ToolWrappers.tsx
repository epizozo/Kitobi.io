import React from 'react';
import { TextTool } from './TextTool';
import { LocalTextTool } from './LocalTextTool';
import { ImageTool } from './ImageTool';
import { 
  AlignLeft, 
  FileText, 
  Mail, 
  Languages, 
  Eraser, 
  FileArchive, 
  Palette as PaletteIcon, 
  Repeat, 
  ScanText, 
  Utensils,
  Sparkles,
  ScrollText,
  Hash,
  FlipVertical,
  Scale,
  Link,
  Type,
  Maximize2,
  Dice5,
  SortAsc,
  List,
  CaseUpper,
  Tags,
  Rocket,
  Target,
  CreditCard,
  Link as LinkIcon,
  Image as ImageIcon,
  FileEdit,
  Zap,
  Plus,
  TrendingUp,
  Search,
  Globe,
  UserCircle,
  Code,
  Check,
  Table,
  Calendar,
  Percent,
  Wallet
} from 'lucide-react';

// --- Marketing Tools ---
export const MarketingGen: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="marketing-gen"
    name="Générateur Marketing"
    description="Générez des accroches, des posts sociaux et des structures de pages de vente."
    icon={Rocket}
    color="text-orange-500"
    promptTemplate={(input) => `Agis comme un expert en copywriting. Génère du contenu marketing percutant pour le sujet suivant : \n\n${input}\n\nInclus : 3 accroches, 1 post social et une structure de page de vente.`}
    placeholder="Décrivez votre produit ou service..."
    onProcess={onProcess}
  />
);

export const AdOptimizer: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="ad-optimizer"
    name="Ads Optimizer"
    description="Créez des publicités optimisées pour Facebook, Google et Instagram."
    icon={Target}
    color="text-blue-500"
    promptTemplate={(input) => `Génère 3 variations de publicités optimisées pour ${input}. Précise le titre, le texte principal et l'appel à l'action pour chaque plateforme (FB, Google, IG).`}
    placeholder="Sujet de votre campagne publicitaire..."
    onProcess={onProcess}
  />
);

// --- SEO Tools ---
export const SEORank: React.FC = () => (
  <TextTool
    id="seo-rank"
    name="Classement Web"
    description="Analysez la position d'un site sur des mots-clés spécifiques."
    icon={TrendingUp}
    color="text-orange-500"
    promptTemplate={(input) => `Analyse le classement potentiel et le SEO pour ce site/mot-clé : \n\n${input}\n\nDonne des conseils pour monter dans les résultats de recherche.`}
    placeholder="URL d'un site ou Mots-clés..."
  />
);

export const SEOKeywords: React.FC = () => (
  <TextTool
    id="seo-keywords"
    name="Suggestions Mots-Clés"
    description="Générez des idées de mots-clés basées sur votre thématique."
    icon={Search}
    color="text-blue-500"
    promptTemplate={(input) => `Génère une liste de 15 mots-clés SEO pertinents (longue traîne et compétitifs) pour : \n\n${input}`}
    placeholder="Sujet ou mot-clé principal..."
  />
);

export const SEODensity: React.FC = () => (
  <LocalTextTool
    id="seo-density"
    name="Densité Mots-Clés"
    description="Analysez la fréquence des mots dans votre texte."
    icon={Hash}
    color="text-emerald-500"
    actionLabel="Analyser la densité"
    process={(input) => {
      const words = input.toLowerCase().match(/\w+/g) || [];
      const freq: Record<string, number> = {};
      words.forEach(w => { if (w.length > 3) freq[w] = (freq[w] || 0) + 1; });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
      return `Nombre total de mots : ${words.length}\n\nTOP MOTS-CLÉS :\n` + 
             sorted.map(([w, c]) => `- ${w}: ${c} (${((c/words.length)*100).toFixed(1)}%)`).join('\n');
    }}
    placeholder="Collez votre contenu ici..."
  />
);

export const SEOCache: React.FC = () => (
   <TextTool
    id="seo-cache"
    name="Vérificateur de Cache"
    description="Explications sur le cache Google et comment le vérifier."
    icon={Globe}
    color="text-indigo-500"
    promptTemplate={(input) => `Explique comment vérifier le cache Google pour cette URL et ce qu'il indique sur l'indexation : \n\n${input}`}
    placeholder="URL du site..."
  />
);

export const SEOIndex: React.FC = () => (
  <TextTool
    id="seo-index"
    name="Index Google"
    description="Vérifiez si vos pages sont bien indexées par Google."
    icon={ScanText}
    color="text-blue-400"
    promptTemplate={(input) => `Donne la méthode pour vérifier si cette URL est indexée et suggère des actions si elle ne l'est pas : \n\n${input}`}
    placeholder="URL du site..."
  />
);

export const SEOMetaGen: React.FC = () => (
  <TextTool
    id="seo-meta-gen"
    name="Tags Méta (Gen)"
    description="Générez les balises meta title et description optimisées."
    icon={FileEdit}
    color="text-orange-600"
    promptTemplate={(input) => `Génère des balises Meta Title (max 60 car.) et Meta Description (max 160 car.) optimisées pour : \n\n${input}`}
    placeholder="Sujet de votre page..."
  />
);

export const SEOOGGen: React.FC = () => (
  <TextTool
    id="seo-og-gen"
    name="Open Graph (Gen)"
    description="Tags optimisés pour Facebook, LinkedIn et WhatsApp."
    icon={Sparkles}
    color="text-blue-600"
    promptTemplate={(input) => `Génère les tags Open Graph (og:title, og:description, og:image, og:url) pour : \n\n${input}`}
    placeholder="Titre de la page..."
  />
);

export const SEOUTM: React.FC = () => (
  <LocalTextTool
    id="seo-utm"
    name="Générateur UTM"
    description="Créez des liens de suivi pour vos campagnes marketing."
    icon={LinkIcon}
    color="text-orange-500"
    actionLabel="Générer le lien"
    process={(input) => {
      const parts = input.split(' ');
      const url = parts[0];
      const source = parts[1] || 'google';
      const medium = parts[2] || 'cpc';
      const campaign = parts[3] || 'kitobi_promo';
      if (!url) return "Format : [URL] [Source] [Support] [Campagne]";
      return `${url}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    }}
    placeholder="https://monsite.com facebook social promo_ete"
  />
);

// --- Domain & IP Tools ---
export const DomainToIP: React.FC = () => (
  <TextTool
    id="domain-ip"
    name="Domaine vers IP"
    description="Trouvez l'adresse IP derrière n'importe quel domaine."
    icon={Globe}
    color="text-blue-500"
    promptTemplate={(input) => `Si c'est un domaine, donne l'adresse IP associée (simulée si besoin) et explique les en-têtes réseau pour : \n\n${input}`}
    placeholder="Exemple: google.com"
  />
);

export const DomainAge: React.FC = () => (
  <TextTool
    id="domain-age"
    name="Âge Domaine"
    description="Calcul de l'ancienneté d'un nom de domaine."
    icon={FileText}
    color="text-emerald-500"
    promptTemplate={(input) => `Trouve la date d'enregistrement originale de ce domaine : \n\n${input}`}
    placeholder="Exemple: kitobi.io"
  />
);

export const DomainWhois: React.FC = () => (
  <TextTool
    id="domain-whois"
    name="Recherche Whois"
    description="Informations détaillées sur le propriétaire et le registraire."
    icon={Search}
    color="text-indigo-500"
    promptTemplate={(input) => `Affiche les informations Whois (simulées mais réalistes) pour ce domaine : \n\n${input}`}
    placeholder="Domaine..."
  />
);

export const MyIP: React.FC = () => (
  <LocalTextTool
    id="my-ip"
    name="Mon IP"
    description="Affichez votre adresse IP publique actuelle."
    icon={Hash}
    color="text-orange-500"
    actionLabel="Détecter mon IP"
    process={() => "Votre IP est détectée côté serveur via l'API.\nEstimation : [VOTRE_IP_PUBLIQUE]"}
    placeholder="Cliquez sur le bouton pour voir..."
  />
);

export const IPLookup: React.FC = () => (
  <TextTool
    id="ip-lookup"
    name="Localisation IP"
    description="Trouvez le pays, la ville et le fournisseur d'accès d'une IP."
    icon={Globe}
    color="text-emerald-400"
    promptTemplate={(input) => `Donne la géolocalisation approximative et le fournisseur (ISP) pour l'IP : \n\n${input}`}
    placeholder="Adresse IP..."
  />
);

// --- Dev Tools ---
export const HTMLBeautify: React.FC = () => (
  <LocalTextTool
    id="html-beautify"
    name="HTML Beautifier"
    description="Formatez votre code HTML pour le rendre lisible."
    icon={Code}
    color="text-orange-500"
    actionLabel="Embellir le code"
    process={(input) => {
      let indent = 0;
      return input.replace(/<[^>]+>/g, (match) => {
        if (match.startsWith('</')) indent--;
        const res = '  '.repeat(Math.max(0, indent)) + match;
        if (!match.startsWith('</') && !match.endsWith('/>')) indent++;
        return '\n' + res;
      }).trim();
    }}
    placeholder="Tapez ou collez votre HTML sale..."
  />
);

export const HTMLMinify: React.FC = () => (
  <LocalTextTool
    id="html-minify"
    name="Minification HTML"
    description="Supprimez les espaces et commentaires pour gagner du poids."
    icon={Maximize2}
    color="text-orange-600"
    actionLabel="Minifier"
    process={(input) => input.replace(/\s+/g, ' ').replace(/> </g, '><').trim()}
    placeholder="Code HTML à minifier..."
  />
);

export const JSONValidator: React.FC = () => (
  <LocalTextTool
    id="json-validator"
    name="Validateur JSON"
    description="Vérifiez la structure de vos fichiers JSON."
    icon={Check}
    color="text-emerald-500"
    actionLabel="Valider JSON"
    process={(input) => {
      try {
        const obj = JSON.parse(input);
        return "✅ JSON Valide !\n\nFormatted :\n" + JSON.stringify(obj, null, 2);
      } catch (e) {
        return `❌ Erreur : ${e instanceof Error ? e.message : 'Syntaxe invalide'}`;
      }
    }}
    placeholder='{"nom": "Kitobi", "version": 1.0}'
  />
);

export const CSVToJSON: React.FC = () => (
  <LocalTextTool
    id="csv-to-json"
    name="CSV en JSON"
    description="Convertissez vos fichiers CSV en tableaux d'objets JSON."
    icon={Table}
    color="text-emerald-600"
    actionLabel="Convertir"
    process={(input) => {
      const lines = input.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const data = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = (data[i] || '').trim());
        return obj;
      });
      return JSON.stringify(result, null, 2);
    }}
    placeholder="header1,header2\nvaleur1,valeur2"
  />
);

// --- Calculators ---
export const CalcAdsense: React.FC = () => (
  <LocalTextTool
    id="calc-adsense"
    name="Calculateur Adsense"
    description="Estimez vos futurs gains publicitaires."
    icon={CreditCard}
    color="text-orange-500"
    actionLabel="Calculer"
    process={(input) => {
      const pageViews = parseInt(input) || 0;
      const ctr = 0.02; // 2%
      const cpc = 0.50; // 0.50$
      const earnings = pageViews * ctr * cpc;
      return `Vues : ${pageViews}\nCTR estimé : 2%\nCPC estimé : 0.50$\n\nGains Quotidiens : ${earnings.toFixed(2)}$\nGains Mensuels : ${(earnings * 30).toFixed(2)}$`;
    }}
    placeholder="Nombre de pages vues par jour..."
  />
);

export const CalcAge: React.FC = () => (
  <LocalTextTool
    id="calc-age"
    name="Calculateur d'Âge"
    description="Entrez votre date de naissance."
    icon={Calendar}
    color="text-blue-500"
    actionLabel="Calculer l'âge"
    process={(input) => {
      const birthDate = new Date(input);
      if (isNaN(birthDate.getTime())) return "Format date invalide (YYYY-MM-DD)";
      const diff = Date.now() - birthDate.getTime();
      const age = new Date(diff).getFullYear() - 1970;
      return `Vous avez ${age} ans.`;
    }}
    placeholder="1995-12-31"
  />
);

export const CalcPercent: React.FC = () => (
  <LocalTextTool
    id="calc-percent"
    name="Calcul de Pourcentage"
    description="Calculez X% de Y."
    icon={Percent}
    color="text-emerald-500"
    actionLabel="Calculer"
    process={(input) => {
      const parts = input.match(/\d+/g);
      if (!parts || parts.length < 2) return "Entrez [X] [Y] (ex: 20 150)";
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      return `${x}% de ${y} = ${(x / 100 * y).toFixed(2)}`;
    }}
    placeholder="Ex : 20 500"
  />
);

export const CalcPaypal: React.FC = () => (
  <LocalTextTool
    id="calc-paypal"
    name="Frais PayPal"
    description="Calculez ce que vous allez recevoir après frais."
    icon={Wallet}
    color="text-blue-600"
    actionLabel="Calculer les frais"
    process={(input) => {
      const amount = parseFloat(input) || 0;
      const fee = (amount * 0.034) + 0.25; // Standard PayPal fee (estimated)
      return `Montant : ${amount}$\nFrais estimé (3.4% + 0.25) : ${fee.toFixed(2)}$\n\nVous recevrez : ${(amount - fee).toFixed(2)}$`;
    }}
    placeholder="Montant du transfert..."
  />
);

// --- YouTube Tools ---
export const YTTagExtractor: React.FC = () => (
  <TextTool
    id="yt-tag-extractor"
    name="Extracteur de Balises"
    description="Récupérez les tags SEO d'une vidéo YouTube à partir de son URL."
    icon={Tags}
    color="text-red-500"
    promptTemplate={(input) => `Extrais tous les tags/mots-clés de cette vidéo YouTube (si c'est une URL) ou suggères-en basés sur ce sujet : \n\n${input}`}
    placeholder="URL de la vidéo ou sujet..."
  />
);

export const YTTagGen: React.FC = () => (
  <TextTool
    id="yt-tag-gen"
    name="Générateur de Balises"
    description="Générez des tags optimisés pour le référencement de votre vidéo."
    icon={Sparkles}
    color="text-red-600"
    promptTemplate={(input) => `Génère une liste de 20 tags optimisés pour le SEO YouTube pour le sujet suivant : \n\n${input}\n\nSépare-les par des virgules.`}
    placeholder="Sujet de votre vidéo..."
  />
);

export const YTHashtagExtractor: React.FC = () => (
  <LocalTextTool
    id="yt-hashtag-extractor"
    name="Extracteur de Hashtags"
    description="Extrait les hashtags d'un texte ou d'une description."
    icon={Hash}
    color="text-red-400"
    actionLabel="Extraire les hashtags"
    process={(input) => {
      const hashtags = input.match(/#[a-z0-9_]+/gi);
      return hashtags ? hashtags.join(' ') : "Aucun hashtag trouvé.";
    }}
    placeholder="Collez la description ici..."
  />
);

export const YTHashtagGen: React.FC = () => (
  <TextTool
    id="yt-hashtag-gen"
    name="Générateur de Hashtags"
    description="Créez des hashtags viraux pour vos Shorts ou vidéos classiques."
    icon={Sparkles}
    color="text-pink-500"
    promptTemplate={(input) => `Génère 15 hashtags viraux et pertinents pour une vidéo YouTube sur : \n\n${input}`}
    placeholder="Sujet de la vidéo..."
  />
);

export const YTTitleGen: React.FC = () => (
  <TextTool
    id="yt-title-gen"
    name="Générateur de Titres"
    description="Titres irrésistibles basés sur la psychologie du clic."
    icon={Sparkles}
    color="text-red-600"
    promptTemplate={(input) => `Génère 10 titres YouTube accrocheurs (cliquables mais pas mensongers) pour : \n\n${input}\n\nInclus des variantes curieuses, éducatives et provocatrices.`}
    placeholder="De quoi parle votre vidéo ?"
  />
);

export const YTMoneyCalc: React.FC = () => (
  <LocalTextTool
    id="yt-money-calc"
    name="Calculateur d'Argent"
    description="Estimez vos revenus Youtube basés sur les vues et le CPM."
    icon={CreditCard}
    color="text-emerald-500"
    actionLabel="Calculer l'estimation"
    process={(input) => {
      const views = parseInt(input.replace(/[^0-9]/g, '')) || 0;
      const lowCpm = 0.50;
      const avgCpm = 2.50;
      const highCpm = 6.00;
      
      const res = [
        `Vues analysées : ${views.toLocaleString()}`,
        `---------------------------`,
        `Estimation basse (0.5$ CPM) : ${(views / 1000 * lowCpm).toFixed(2)}$`,
        `Estimation moyenne (2.5$ CPM) : ${(views / 1000 * avgCpm).toFixed(2)}$`,
        `Estimation haute (6.0$ CPM) : ${(views / 1000 * highCpm).toFixed(2)}$`,
        `---------------------------`,
        `Note : Ces chiffres sont des estimations basées sur le CPM moyen.`
      ];
      return res.join('\n');
    }}
    placeholder="Entrez le nombre de vues estimé..."
  />
);

export const YTTitleLength: React.FC = () => (
  <LocalTextTool
    id="yt-title-length"
    name="Vérificateur Longueur"
    description="Vérifiez si votre titre est trop long pour l'affichage YouTube."
    icon={Scale}
    color="text-zinc-500"
    showLive
    process={(input) => {
      const len = input.length;
      let status = "✅ Parfait";
      if (len > 70) status = "⚠️ Un peu long (risqué sur mobile)";
      if (len > 100) status = "❌ Trop long (sera coupé)";
      return `Longueur : ${len}/100 caractères\nStatut : ${status}`;
    }}
    placeholder="Tapez votre titre ici..."
  />
);

export const YTEmbedGen: React.FC = () => (
  <LocalTextTool
    id="yt-embed-gen"
    name="Générateur Code Intégration"
    description="Générez rapidement le code iframe pour votre site."
    icon={LinkIcon}
    color="text-blue-500"
    actionLabel="Générer l'Iframe"
    process={(input) => {
      const match = input.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      if (!match) return "URL YouTube invalide.";
      const id = match[1];
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    }}
    placeholder="Collez l'URL de la vidéo..."
  />
);

export const YTThumbDownloader: React.FC = () => (
  <LocalTextTool
    id="yt-thumb-downloader"
    name="Téléchargeur de Vignette"
    description="Obtenez les liens directs vers les miniatures HD."
    icon={ImageIcon}
    color="text-red-500"
    actionLabel="Générer les liens"
    process={(input) => {
      const match = input.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      if (!match) return "URL YouTube invalide.";
      const id = match[1];
      return [
        `HD (Maximum Quality) : https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        `SD (Standard Quality) : https://img.youtube.com/vi/${id}/sddefault.jpg`,
        `HQ (High Quality) : https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        `MQ (Medium Quality) : https://img.youtube.com/vi/${id}/mqdefault.jpg`
      ].join('\n\n');
    }}
    placeholder="Collez l'URL de la vidéo..."
  />
);

export const YTLogoDownloader: React.FC = () => (
  <TextTool
    id="yt-logo-downloader"
    name="Logo de Chaîne"
    description="Récupérez la photo de profil d'une chaîne."
    icon={UserCircle}
    color="text-red-400"
    promptTemplate={(input) => `Si c'est une URL de chaîne YouTube, extrais le lien de la photo de profil (Avatar). Sinon, explique comment le récupérer pour : \n\n${input}`}
    placeholder="URL de la chaîne..."
  />
);

export const YTBannerDownloader: React.FC = () => (
  <TextTool
    id="yt-banner-downloader"
    name="Bannière de Chaîne"
    description="Récupérez l'image de couverture d'une chaîne."
    icon={ImageIcon}
    color="text-red-600"
    promptTemplate={(input) => `Si c'est une URL de chaîne YouTube, extrais le lien de la bannière. Sinon, explique comment la récupérer pour : \n\n${input}`}
    placeholder="URL de la chaîne..."
  />
);

export const YTChannelSearch: React.FC = () => (
  <TextTool
    id="yt-channel-search"
    name="Recherche de Chaînes"
    description="Trouvez des chaînes pertinentes dans votre niche."
    icon={Search}
    color="text-zinc-500"
    promptTemplate={(input) => `Trouve et liste 5 chaînes YouTube influentes dans la niche suivante : \n\n${input}\n\nInclus : Nom de la chaîne, URL (si possible) et description succincte.`}
    placeholder="Niche ou mot-clé..."
  />
);

export const YTVideoCount: React.FC = () => (
   <TextTool
    id="yt-video-count"
    name="Vérificateur de Vidéos"
    description="Déterminez le nombre total de vidéos publiées."
    icon={Hash}
    color="text-zinc-500"
    promptTemplate={(input) => `Trouve le nombre total de vidéos publiées par cette chaîne YouTube (URL fournie) : \n\n${input}`}
    placeholder="URL de la chaîne..."
  />
);

export const YTTitleExtractor: React.FC = () => (
  <TextTool
    id="yt-title-extractor"
    name="Extracteur de Titre"
    description="Récupérez le titre d'une vidéo via son URL."
    icon={Type}
    color="text-red-500"
    promptTemplate={(input) => `Si c'est une URL YouTube, extrais le titre de la vidéo. Sinon, propose 10 titres optimisés pour : \n\n${input}`}
    placeholder="URL ou sujet..."
  />
);

export const YTDescExtractor: React.FC = () => (
  <TextTool
    id="yt-desc-extractor"
    name="Extracteur de Description"
    description="Récupérez la description d'une vidéo via son URL."
    icon={AlignLeft}
    color="text-red-400"
    promptTemplate={(input) => `Si c'est une URL YouTube, extrais la description. Sinon, rédige une description complète pour : \n\n${input}`}
    placeholder="URL ou sujet..."
  />
);

export const YTDescGen: React.FC = () => (
  <TextTool
    id="yt-desc-gen"
    name="Générateur de Description"
    description="Descriptions structurées avec chapitres, liens et SEO."
    icon={FileEdit}
    color="text-red-600"
    promptTemplate={(input) => `Rédige une description YouTube professionnelle et optimisée pour : \n\n${input}\n\nInclus : Une introduction accrocheuse, des chapitres fictifs, des appels à l'action et des sections de liens sociaux.`}
    placeholder="Décrivez votre vidéo..."
  />
);

export const YTTimestampGen: React.FC = () => (
  <LocalTextTool
    id="yt-timestamp-gen"
    name="Générateur de Liens d'Horodatage"
    description="Générez un lien YouTube qui commence à une seconde précise."
    icon={Zap}
    color="text-orange-500"
    actionLabel="Générer le lien"
    process={(input) => {
      // Input: URL + Time (e.g. 1:30 or 90)
      const parts = input.split(' ');
      const url = parts[0];
      const timeStr = parts[1] || "0";
      let seconds = 0;
      if (timeStr.includes(':')) {
        const [m, s] = timeStr.split(':').map(Number);
        seconds = m * 60 + s;
      } else {
        seconds = parseInt(timeStr);
      }
      const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      const id = match ? match[1] : url;
      return `https://youtu.be/${id}?t=${seconds}`;
    }}
    placeholder="URL_Video 1:30"
  />
);

export const YTSubLinkGen: React.FC = () => (
  <LocalTextTool
    id="yt-sub-link"
    name="Lien d'Abonnement"
    description="Générez un lien qui demande automatiquement l'abonnement."
    icon={Plus}
    color="text-red-600"
    actionLabel="Générer"
    process={(input) => {
      const cleanInput = input.trim();
      return `${cleanInput}?sub_confirmation=1`;
    }}
    placeholder="URL de votre chaîne..."
  />
);

export const YTTitleCap: React.FC = () => (
  <LocalTextTool
    id="yt-title-cap"
    name="Capitaliseur de Titres"
    description="Formatage automatique pour un look pro."
    icon={Type}
    color="text-zinc-400"
    actionLabel="Capitaliser"
    process={(input) => {
      return input.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    }}
    placeholder="Votre titre en minuscule..."
  />
);

export const YTViewRatio: React.FC = () => (
  <LocalTextTool
    id="yt-view-ratio"
    name="Ratio de Vues"
    description="Calculez le ratio engagement/abonnés."
    icon={TrendingUp}
    color="text-red-500"
    actionLabel="Calculer le ratio"
    process={(input) => {
      const parts = input.match(/\d+/g);
      if (!parts || parts.length < 2) return "Entrez [Vues] [Abonnés]";
      const views = parseInt(parts[0]);
      const subs = parseInt(parts[1]);
      const ratio = (views / subs) * 100;
      return `Ratio Vues/Abonnés : ${ratio.toFixed(2)}%\n\nInterprétation :\n- < 5% : Faible\n- 5-15% : Moyen\n- > 20% : Excellent viralité !`;
    }}
    placeholder="Exemple: 50000 100000 (Vues puis Abonnés)"
  />
);

export const YTChannelIdFinder: React.FC = () => (
  <TextTool
    id="yt-channel-id"
    name="Recherche ID Chaîne"
    description="Trouvez l'ID système d'une chaîne ou l'ID d'utilisateur."
    icon={Search}
    color="text-zinc-500"
    promptTemplate={(input) => `Si c'est une URL de chaîne YouTube, extrais l'ID de la chaîne. Sinon, explique comment trouver l'ID d'une chaîne pour : \n\n${input}`}
    placeholder="URL de la chaîne..."
  />
);

export const YTVideoStats: React.FC = () => (
  <TextTool
    id="yt-video-stats"
    name="Statistiques Vidéo"
    description="Analyse de performance et estimation de viralité."
    icon={Target}
    color="text-red-500"
    promptTemplate={(input) => `Analyse les statistiques de cette vidéo YouTube (si URL fournie) ou du sujet suivant : \n\n${input}\n\nDonne une estimation du potentiel de viralité et des conseils d'amélioration.`}
    placeholder="URL ou sujet..."
  />
);

export const YTChannelStats: React.FC = () => (
  <TextTool
    id="yt-channel-stats"
    name="Statistiques Chaîne"
    description="Analyse globale de la croissance d'une chaîne."
    icon={Rocket}
    color="text-red-600"
    promptTemplate={(input) => `Fais un audit rapide de cette chaîne YouTube (si URL fournie) ou donne une stratégie de croissance pour : \n\n${input}`}
    placeholder="URL de la chaîne ou niche..."
  />
);

export const YTRegionCheck: React.FC = () => (
  <TextTool
    id="yt-region-check"
    name="Restriction Région"
    description="Vérifiez si une vidéo est bloquée dans certains pays."
    icon={Globe}
    color="text-blue-400"
    promptTemplate={(input) => `Vérifie les restrictions géographiques pour cette vidéo YouTube URL : \n\n${input}\n\n(Note: Simule l'analyse si l'API n'est pas connectée)`}
    placeholder="URL de la vidéo..."
  />
);

export const YTCommentPicker: React.FC = () => (
  <LocalTextTool
    id="yt-comment-picker"
    name="Sélecteur de Commentaires"
    description="Tirage au sort d'un gagnant parmi des commentaires."
    icon={UserCircle}
    color="text-orange-400"
    actionLabel="Tirer au sort"
    process={(input) => {
      const comments = input.split('\n').filter(line => line.trim().length > 0);
      if (comments.length === 0) return "Copiez-collez les noms des participants (un par ligne).";
      const winner = comments[Math.floor(Math.random() * comments.length)];
      return `🎉 LE GAGNANT EST : ${winner}\n\nNombre total de participants : ${comments.length}`;
    }}
    placeholder="Nom de participant 1\nNom de participant 2\n..."
  />
);

export const YTChannelAge: React.FC = () => (
  <TextTool
    id="yt-channel-age"
    name="Âge de la Chaîne"
    description="Déterminez la date de création exacte."
    icon={FileText}
    color="text-zinc-600"
    promptTemplate={(input) => `Trouve la date de création de cette chaîne YouTube via son URL : \n\n${input}`}
    placeholder="URL de la chaîne..."
  />
);

// --- Text Tools (Gemini IA) ---
export const TextRewriter: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="rewriter"
    name="Correcteur & Reformulateur"
    description="Améliorez le style, la clarté et corrigez les fautes de vos textes."
    icon={AlignLeft}
    color="text-indigo-500"
    promptTemplate={(input) => `Réécris et améliore le texte suivant pour qu'il soit plus professionnel, clair et sans fautes : \n\n${input}`}
    placeholder="Collez votre texte ici pour le reformuler..."
    onProcess={onProcess}
  />
);

export const Summarizer: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="summarizer"
    name="Résumé Express"
    description="Obtenez les points clés d'un texte long ou d'un article instantanément."
    icon={FileText}
    color="text-cyan-500"
    promptTemplate={(input) => `Résume le texte suivant en extrais-en les points clés sous forme de liste à puces : \n\n${input}`}
    placeholder="Collez un long texte ou un article à résumer..."
    onProcess={onProcess}
  />
);

export const Translator: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="translator"
    name="Traducteur Contextuel"
    description="Traduisez vos textes en respectant le ton et le contexte culturel."
    icon={Languages}
    color="text-rose-500"
    promptTemplate={(input) => `Traduis le texte suivant en français (ou détecte la langue cible si spécifiée) en respectant le ton et le contexte : \n\n${input}`}
    placeholder="Collez le texte à traduire..."
    onProcess={onProcess}
  />
);

export const ArticleWriter: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="article-writer"
    name="Rédacteur d'articles"
    description="Générez des articles structurés et optimisés."
    icon={ScrollText}
    color="text-emerald-500"
    promptTemplate={(input) => `Rédige un article complet, structuré avec des titres (H1, H2) et optimisé sur le sujet suivant : \n\n${input}`}
    placeholder="Entrez le sujet ou le titre de l'article à rédiger..."
    onProcess={onProcess}
  />
);

export const WordsToNumbers: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="words-to-numbers"
    name="Mots en Nombres"
    description="Convertissez deux en 2."
    icon={Hash}
    color="text-zinc-500"
    promptTemplate={(input) => `Convertis les nombres écrits en lettres en chiffres dans le texte suivant : \n\n${input}`}
    placeholder="Exemple: deux cent cinquante..."
    onProcess={onProcess}
  />
);

export const TextToTags: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <TextTool
    id="text-to-tags"
    name="Texte en Balises"
    description="Générez des mots-clés à partir d'un texte."
    icon={Tags}
    color="text-amber-500"
    promptTemplate={(input) => `Extrais les 10 mots-clés les plus pertinents de ce texte et renvoie-les séparés par des virgules : \n\n${input}`}
    placeholder="Collez votre texte pour extraire les tags..."
    onProcess={onProcess}
  />
);

// --- Text Tools (Local / RegEx) ---
export const WordCounter: React.FC = () => (
  <LocalTextTool
    id="word-counter"
    name="Compteur de mots"
    description="Comptez les mots, caractères et temps de lecture."
    icon={Hash}
    color="text-blue-400"
    showLive={true}
    process={(input) => {
      const words = input.trim() ? input.trim().split(/\s+/).length : 0;
      const chars = input.length;
      const readingTime = Math.ceil(words / 200);
      return `Mots : ${words}\nCaractères : ${chars}\nTemps de lecture estimé : ${readingTime} min`;
    }}
    placeholder="Écrivez ou collez votre texte ici..."
  />
);

export const UpsideDownText: React.FC = () => (
  <LocalTextTool
    id="upside-down"
    name="Texte à l'Envers"
    description="Inversez votre texte."
    icon={FlipVertical}
    color="text-zinc-500"
    showLive={true}
    process={(input) => input.split('').reverse().join('')}
    placeholder="Texte à inverser..."
  />
);

export const HashtagConverter: React.FC = () => (
  <LocalTextTool
    id="hashtag-converter"
    name="Texte en Hashtags"
    description="Transformez vos phrases en tags."
    icon={Hash}
    color="text-pink-500"
    process={(input) => input.split(/\s+/).map(word => word.startsWith('#') ? word : `#${word.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ')}
    placeholder="Mots à convertir en hashtags..."
  />
);

export const TextCompare: React.FC = () => (
  <LocalTextTool
    id="text-compare"
    name="Comparaison de Texte"
    description="Trouvez les différences."
    icon={Scale}
    color="text-orange-400"
    process={(input) => {
      const parts = input.split('---');
      if (parts.length < 2) return "Séparez les deux textes par '---' pour comparer.";
      const t1 = parts[0].trim();
      const t2 = parts[1].trim();
      return t1 === t2 ? "Les textes sont identiques." : "Les textes sont différents.";
    }}
    placeholder="Texte 1\n---\nTexte 2"
  />
);

export const SlugConverter: React.FC = () => (
  <LocalTextTool
    id="slug-converter"
    name="Générateur de Slug"
    description="Créez des URLs propres."
    icon={Link}
    color="text-teal-500"
    showLive={true}
    process={(input) => input.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')}
    placeholder="Titre de l'article..."
  />
);

export const LoremIpsum: React.FC = () => (
  <LocalTextTool
    id="lorem-ipsum"
    name="Lorem Ipsum"
    description="Générez du texte de remplissage."
    icon={FileText}
    color="text-zinc-400"
    process={() => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
    placeholder="Cliquez sur générer..."
    actionLabel="Générer Lorem Ipsum"
  />
);

export const CaseConverter: React.FC = () => (
  <LocalTextTool
    id="case-converter"
    name="Convertisseur de Casse"
    description="Majuscules, minuscules, etc."
    icon={Type}
    color="text-indigo-500"
    process={(input) => input.toUpperCase()}
    placeholder="Texte à convertir..."
    actionLabel="Vers MAJUSCULES"
  />
);

export const RemoveBreaks: React.FC = () => (
  <LocalTextTool
    id="remove-breaks"
    name="Supprimer Sauts Ligne"
    description="Nettoyez votre texte."
    icon={Maximize2}
    color="text-rose-400"
    process={(input) => input.replace(/\n+/g, ' ')}
    placeholder="Texte avec sauts de ligne..."
  />
);

export const RandomWord: React.FC = () => (
  <LocalTextTool
    id="random-word"
    name="Mots Aléatoires"
    description="Inspiration rapide."
    icon={Dice5}
    color="text-violet-500"
    process={() => {
      const words = ["Innovation", "Futur", "Digital", "Créativité", "IA", "Kitobi", "Design", "Productivité", "Développement", "SaaS", "Entrepreneuriat"];
      return words[Math.floor(Math.random() * words.length)];
    }}
    placeholder="Cliquez pour un mot..."
    actionLabel="Nouveau Mot"
  />
);

export const TextRepeater: React.FC = () => (
  <LocalTextTool
    id="text-repeater"
    name="Répéteur de Texte"
    description="Répétez x fois."
    icon={Repeat}
    color="text-orange-500"
    process={(input) => input.repeat(5)}
    placeholder="Texte à répéter..."
  />
);

export const TextSorter: React.FC = () => (
  <LocalTextTool
    id="text-sorter"
    name="Trieur de Texte"
    description="Par ordre alphabétique."
    icon={SortAsc}
    color="text-emerald-400"
    process={(input) => input.split('\n').sort().join('\n')}
    placeholder="Liste à trier (un élément par ligne)..."
  />
);

export const CommaSeparator: React.FC = () => (
  <LocalTextTool
    id="comma-separator"
    name="Séparateur Virgules"
    description="Vers format CSV."
    icon={List}
    color="text-blue-500"
    process={(input) => input.split('\n').join(', ')}
    placeholder="Liste à séparer..."
  />
);

export const NumbersToWords: React.FC = () => (
  <LocalTextTool
    id="numbers-to-words"
    name="Nombres en Mots"
    description="123 en texte."
    icon={CaseUpper}
    color="text-teal-400"
    process={(input) => "Fonctionnalité en cours de déploiement pour le français complet."}
    placeholder="Entrez un nombre..."
  />
);

// --- Image Tools ---
export const BackgroundRemover: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <ImageTool
    id="bg-remover"
    name="Suppresseur de Fond"
    description="Détourage automatique haute précision pour vos produits ou portraits."
    icon={Eraser}
    color="text-blue-500"
    promptTemplate={() => "Supprime le fond de cette image."}
    placeholder="Glissez l'image à détourer"
    actionLabel="Supprimer le Fond"
    onProcess={onProcess}
  />
);

export const OCRTool: React.FC<{ onProcess?: () => Promise<boolean> }> = ({ onProcess }) => (
  <ImageTool
    id="ocr"
    name="Extracteur de Texte (OCR)"
    description="Transformez vos photos en texte éditable."
    icon={ScanText}
    color="text-orange-600"
    promptTemplate={() => "Extrais tout le texte visible."}
    placeholder="Glissez l'image contenant du texte"
    actionLabel="Extraire le Texte"
    onProcess={onProcess}
  />
);
