import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Tag, 
  ChevronRight, 
  Share2, 
  Bookmark,
  MessageSquare,
  X,
  ArrowLeft,
  Calendar,
  User,
  Plus
} from 'lucide-react';
import { LordIcon } from './ui/LordIcon';
import { cn } from '../lib/utils';
import { db, Article } from '../lib/mockDb';

const categories = ["Tous", "IA & Technologie", "Business", "Productivité", "Design", "Guides"];

interface BlogViewProps {
  isAdmin?: boolean;
}

export const BlogView: React.FC<BlogViewProps> = ({ isAdmin }) => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(db.getArticles());
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    return db.subscribe(() => {
      setArticles(db.getArticles());
    });
  }, []);

  const filteredArticles = articles.filter(article => 
    (activeCategory === "Tous" || article.category === activeCategory) &&
    (article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderArticleDetail = (article: Article) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0B] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="fixed top-8 left-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-orange-500">
              <span className="px-3 py-1 bg-orange-500/10 rounded-lg">{article.category}</span>
              <span className="text-zinc-500">{article.date}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-zinc-500 font-bold">
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.author}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {article.readTime}</span>
            </div>
          </div>

          <div className="w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-invert prose-orange max-w-none">
            <p className="text-xl text-zinc-300 leading-relaxed font-medium italic mb-12">
              {article.excerpt}
            </p>
            <div className="text-zinc-400 leading-relaxed text-lg space-y-6 whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest">
                <Share2 className="w-4 h-4" /> Partager
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest">
                <Bookmark className="w-4 h-4" /> Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleCreateArticle = () => {
    db.addArticle({
      id: Date.now(),
      title: "Nouvel Article Kitobi",
      excerpt: "Un aperçu passionnant du futur...",
      content: "Contenu généré automatiquement pour le test.",
      category: "IA & Technologie",
      date: "Maintenant",
      readTime: "3 min",
      image: `https://picsum.photos/seed/${Date.now()}/800/450`,
      author: "Admin"
    });
  };

  return (
    <div className="space-y-16 py-12 relative">
      <AnimatePresence>
        {selectedArticle && renderArticleDetail(selectedArticle)}
      </AnimatePresence>
      {/* Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4"
        >
          <LordIcon src="https://cdn.lordicon.com/nocovpuy.json" size={48} trigger="loop" />
        </motion.div>
        <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Blog Kitobi<span className="text-orange-500">.io</span>
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Actualités IA, guides pratiques et réflexions sur le futur du travail automatisé.
        </p>
        
        {isAdmin && (
          <button 
            onClick={handleCreateArticle}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mx-auto shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Publier un Article
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl">
        <div className="flex gap-2 p-1 overflow-x-auto max-w-full no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                activeCategory === cat 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input 
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Feature Article */}
      {filteredArticles.length > 0 && activeCategory === "Tous" && searchQuery === "" && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelectedArticle(filteredArticles[0])}
          className="group relative h-[500px] rounded-[3.5rem] overflow-hidden border border-white/10 cursor-pointer"
        >
          <img 
            src={filteredArticles[0].image} 
            alt={filteredArticles[0].title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 space-y-4 max-w-3xl">
            <span className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest">
              À la Une
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none group-hover:text-orange-500 transition-colors">
              {filteredArticles[0].title}
            </h3>
            <p className="text-zinc-300 text-lg line-clamp-2">
              {filteredArticles[0].excerpt}
            </p>
            <div className="flex items-center gap-6 pt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {filteredArticles[0].readTime} de lecture</span>
              <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-orange-500" /> {filteredArticles[0].category}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article, idx) => (
          (activeCategory !== "Tous" || searchQuery !== "" || idx !== 0) && (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedArticle(article)}
              className="group flex flex-col items-start space-y-6 p-6 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <div className="w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-orange-500">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <h4 className="text-2xl font-black tracking-tight leading-tight group-hover:text-orange-500 transition-colors">
                  {article.title}
                </h4>
                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <div className="w-full pt-4 flex items-center justify-between border-t border-white/5">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                  Lire l'article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-orange-600 to-red-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">Restez à l'avant-garde.</h3>
            <p className="text-white/80 text-lg">
              Rejoignez 15,000+ passionnés qui reçoivent nos analyses hebdomadaires sur l'IA et la productivité.
            </p>
          </div>
          <div className="w-full md:w-96 space-y-4">
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="votre@email.com"
                className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30 transition-all"
              />
              <button className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                S'inscrire
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center md:text-left uppercase font-bold tracking-widest">
              Zéro spam. Uniquement de la valeur. Désabonnez-vous quand vous voulez.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
