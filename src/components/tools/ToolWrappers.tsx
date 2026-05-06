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
  Target
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
