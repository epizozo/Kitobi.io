export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
}

export interface Discussion {
  id: number;
  author: string;
  avatar: string;
  role: string;
  time: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  trending: boolean;
}

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Comment Gemini 3.1 Pro révolutionne la restauration d'image",
    excerpt: "Découvrez en profondeur les algorithmes derrière notre moteur de restauration et comment nous atteignons une précision de 4K sans perte.",
    content: "## L'IA au service de la mémoire\n\nLa restauration d'image a franchi un cap historique avec l'arrivée de Gemini 3.1 Pro. Contrairement aux méthodes traditionnelles d'interpolation qui ne faisaient que 'deviner' les pixels manquants en se basant sur leurs voisins immédiats, notre nouveau moteur utilise une compréhension contextuelle profonde.\n\n### Précision 4K sans compromis\n\nEn analysant des millions de paires d'images (basse vs haute résolution), le modèle a appris à reconstruire des textures complexes comme la peau, le tissu ou le feuillage. C'est ce qu'on appelle la 'Super-Résolution Générative'.",
    category: "IA & Technologie",
    date: "18 Avril 2026",
    readTime: "8 min",
    image: "https://picsum.photos/seed/ai-image/800/450",
    author: "Kitobi Labs"
  },
  {
    id: 2,
    title: "10 outils de productivité essentiels pour les développeurs en 2026",
    excerpt: "Maximisez votre temps avec ces outils automatisés intégrés directement dans Kitobi.io.",
    content: "Le temps est la ressource la plus précieuse d'un développeur. En 2026, l'automatisation n'est plus une option, c'est une nécessité vitale...",
    category: "Productivité",
    date: "17 Avril 2026",
    readTime: "5 min",
    image: "https://picsum.photos/seed/productivity/800/450",
    author: "Dev Team"
  }
];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    author: "Alex Rivers",
    avatar: "https://i.pravatar.cc/150?u=alex",
    role: "Power User",
    time: "2h",
    title: "Comment j'ai restauré 500 vieilles photos de famille en 1h avec l'API",
    content: "J'ai utilisé un script Python simple qui boucle sur le moteur Kitobi. Les résultats sont bluffants, même sur des tirages des années 20 très dégradés. Quelqu'un veut le script ?",
    tags: ["Tutoriel", "API", "Photos"],
    likes: 124,
    comments: 45,
    trending: true
  },
  {
    id: 2,
    author: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    role: "Architect AI",
    time: "5h",
    title: "Projet : Optimisation de flux de travail pour agences créatives",
    content: "Nous intégrons Kitobi.io dans notre pipeline de prod. La réduction de latence sur Gemini 3.1 Pro nous fait gagner environ 15% de temps sur chaque rendu final.",
    tags: ["Workflow", "Business", "Feedback"],
    likes: 89,
    comments: 12,
    trending: false
  }
];

class MockDatabase {
  private articles: Article[] = INITIAL_ARTICLES;
  private discussions: Discussion[] = INITIAL_DISCUSSIONS;
  private subscribers: (() => void)[] = [];

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(s => s());
  }

  getArticles() { return this.articles; }
  addArticle(article: Article) {
    this.articles = [article, ...this.articles];
    this.notify();
  }
  removeArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
    this.notify();
  }

  getDiscussions() { return this.discussions; }
  addDiscussion(discussion: Discussion) {
    this.discussions = [discussion, ...this.discussions];
    this.notify();
  }
  likeDiscussion(id: number) {
    this.discussions = this.discussions.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d);
    this.notify();
  }
}

export const db = new MockDatabase();
