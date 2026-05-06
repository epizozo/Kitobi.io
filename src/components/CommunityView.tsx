import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  TrendingUp, 
  Globe, 
  Hash,
  Filter,
  Flame,
  Award,
  Zap,
  X
} from 'lucide-react';
import { LordIcon } from './ui/LordIcon';
import { cn } from '../lib/utils';
import { db, Discussion } from '../lib/mockDb';

const sideStats = [
  { label: "Membres Actifs", value: "14.2k", icon: Users },
  { label: "Outils Partagés", value: "852", icon: Zap },
  { label: "Pays Représentés", value: "64", icon: Globe },
];

export const CommunityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Populaires");
  const [isPosting, setIsPosting] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>(db.getDiscussions());
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    return db.subscribe(() => {
      setDiscussions(db.getDiscussions());
    });
  }, []);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    
    db.addDiscussion({
      id: Date.now(),
      author: "Vous",
      avatar: "https://i.pravatar.cc/150?u=me",
      role: "Membre",
      time: "Maintenant",
      title: newPost.title,
      content: newPost.content,
      tags: ["Nouveau"],
      likes: 0,
      comments: 0,
      trending: false
    });

    setNewPost({ title: '', content: '' });
    setIsPosting(false);
  };

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    db.likeDiscussion(id);
  };

  return (
    <div className="space-y-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 max-w-2xl">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center">
            <LordIcon src="https://cdn.lordicon.com/msetmbee.json" size={48} trigger="loop" />
          </div>
          <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent italic">
            La Tribu <span className="text-orange-500">Kitobi</span>
          </h2>
          <p className="text-xl text-zinc-400 italic">
            "Apprenez, construisez et grandissez ensemble dans l'écosystème IA le plus dynamique."
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
            Explorer le Wiki
          </button>
          <button 
            onClick={() => setIsPosting(true)}
            className="px-8 py-4 rounded-2xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Plus className="w-4 h-4" /> Nouvelle Discussion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar - Navigation */}
        <div className="space-y-8 hidden lg:block">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Navigation</p>
            {['Tout', 'Photos', 'Marketing', 'Dev', 'Finance'].map(tag => (
              <button key={tag} className="w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all text-sm text-zinc-400 hover:text-white">
                <span className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                  {tag}
                </span>
                <span className="text-[10px] text-zinc-700 bg-white/5 px-2 py-0.5 rounded-md">{Math.floor(Math.random() * 100)}</span>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-black text-orange-500 uppercase tracking-widest">
              <Award className="w-4 h-4" /> Challenge du mois
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              "Restauration Historique" : Partagez votre plus belle restauration de photo pré-1950.
            </p>
            <div className="pt-2">
              <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-[#0A0A0B]" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0B] bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                  +12
                </div>
              </div>
              <button className="w-full py-2 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors">
                Participer
              </button>
            </div>
          </div>
        </div>

        {/* Center - Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Feed Header/Filter */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1">
              {['Populaires', 'Récents', 'Favoris'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === tab ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="p-3 bg-white/5 rounded-2xl text-zinc-600 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Posting Simulation Modal */}
          <AnimatePresence>
            {isPosting && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="p-8 rounded-[3rem] bg-white/[0.02] border border-orange-500/30 space-y-6 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Plus className="w-32 h-32" />
                </div>
                <div className="flex items-center justify-between relative">
                  <h3 className="text-xl font-bold">Lancer une discussion</h3>
                  <button onClick={() => setIsPosting(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4 relative">
                  <input 
                    type="text" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Titre de votre discussion..." 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-all font-bold"
                  />
                  <textarea 
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Contenu..." 
                    rows={4}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 resize-none transition-all"
                  />
                  <div className="flex justify-end pt-2">
                     <button 
                       onClick={handleCreatePost}
                       className="px-10 py-5 rounded-2xl bg-orange-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-orange-500/40 active:scale-95 hover:bg-orange-600 transition-all"
                     >
                      Publier sur la Tribu
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discussion Cards */}
          <div className="space-y-6">
            {discussions.map(post => (
              <motion.div 
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-8 rounded-[3rem] bg-white/[0.02] border border-white/10 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all cursor-pointer relative"
              >
                {post.trending && (
                  <div className="absolute top-6 right-8 flex items-center gap-2 text-orange-500">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tendance</span>
                  </div>
                )}
                
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <img src={post.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5" alt={post.author} />
                    <div className="w-0.5 flex-1 bg-white/5 rounded-full my-4" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{post.author}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">{post.role}</span>
                      <span className="text-xs text-zinc-600">• {post.time}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-orange-500 transition-colors leading-tight italic">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-600 hover:text-white transition-colors cursor-pointer border border-white/5 px-2 py-1 rounded-lg">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                      <button 
                        onClick={(e) => handleLike(e, post.id)}
                        className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors group/btn"
                      >
                        <Heart className="w-4 h-4 group-hover/btn:fill-orange-500" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" /> {post.comments}
                      </button>
                      <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors ml-auto">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Stats & Profiles */}
        <div className="space-y-8 hidden lg:block">
          <div className="p-8 rounded-[3rem] bg-zinc-900/50 border border-white/5 space-y-6 backdrop-blur-3xl">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Statistiques Globales</h4>
            <div className="grid grid-cols-1 gap-6">
              {sideStats.map(stat => (
                <div key={stat.label} className="text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/10 transition-all">
                    <stat.icon className="w-6 h-6 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <p className="text-3xl font-black tracking-tighter text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Contributeurs du jour</p>
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
                <img src={`https://i.pravatar.cc/150?u=top${i}`} className="w-10 h-10 rounded-xl" />
                <div className="flex-1">
                  <p className="font-bold text-sm">User_{i}42</p>
                  <p className="text-[9px] text-zinc-600 uppercase font-black">{Math.floor(Math.random() * 5000)} points</p>
                </div>
                <TrendingUp className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
