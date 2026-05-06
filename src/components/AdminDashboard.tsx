import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Database, 
  Settings, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  UserPlus, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  MoreVertical,
  Cpu,
  Zap,
  HardDrive,
  Network,
  LogOut,
  Bell,
  CheckCircle2,
  Lock,
  Eye,
  Edit3,
  Trash2,
  Info,
  LayoutGrid,
  FileText,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../lib/utils';
import { LordIcon } from './ui/LordIcon';
import { db, Article, Discussion } from '../lib/mockDb';

const data = [
  { name: 'Lun', users: 400, revenue: 2400 },
  { name: 'Mar', users: 300, revenue: 1398 },
  { name: 'Mer', users: 200, revenue: 9800 },
  { name: 'Jeu', users: 278, revenue: 3908 },
  { name: 'Ven', users: 189, revenue: 4800 },
  { name: 'Sam', users: 239, revenue: 3800 },
  { name: 'Dim', users: 349, revenue: 4300 },
];

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', plan: 'Pro', status: 'Active', usage: '85%' },
  { id: '2', name: 'Alice Smith', email: 'alice@abc.com', plan: 'Enterprise', status: 'Active', usage: '42%' },
  { id: '3', name: 'Bob Wilson', email: 'bob@corp.io', plan: 'Free', status: 'Inactive', usage: '10%' },
  { id: '4', name: 'Zoe Brown', email: 'zoe@design.com', plan: 'Pro', status: 'Active', usage: '92%' },
];

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'content' | 'system' | 'logs'>('overview');
  const [articles, setArticles] = useState<Article[]>(db.getArticles());
  const [discussions, setDiscussions] = useState<Discussion[]>(db.getDiscussions());

  useEffect(() => {
    return db.subscribe(() => {
      setArticles(db.getArticles());
      setDiscussions(db.getDiscussions());
    });
  }, []);

  const renderContentManager = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Blog Posts Manager */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" /> Articles du Blog
            </h3>
            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">{articles.length} total</span>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden">
            {articles.map(article => (
              <div key={article.id} className="p-6 border-b border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <img src={article.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-sm truncate max-w-[200px]">{article.title}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">{article.category} • {article.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4 text-zinc-400" /></button>
                  <button 
                    onClick={() => db.removeArticle(article.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500/50" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Posts Manager */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Discussions Tribu
            </h3>
            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">{discussions.length} total</span>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden">
            {discussions.map(disc => (
              <div key={disc.id} className="p-6 border-b border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <img src={disc.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-sm truncate max-w-[200px]">{disc.title}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Par {disc.author} • {disc.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500/50" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-zinc-950 border-r border-white/5 flex flex-col p-8 space-y-12 shrink-0">
        <div 
          className="flex items-center gap-3 px-2 cursor-pointer group"
          onClick={() => onLogout()}
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter">KITOBI <span className="text-orange-500">OPS</span></span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Retour au site</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'content', label: 'Contenu', icon: LayoutGrid },
            { id: 'system', label: 'État Système', icon: Cpu },
            { id: 'logs', label: 'Historique', icon: Database },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group text-left",
                activeView === item.id 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          <div className="px-4 py-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Santé Serveurs</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-green-500" />
              </div>
              <p className="text-[10px] text-zinc-500">Charge CPU : 74%</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-16">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight uppercase italic underline decoration-orange-500/30 underline-offset-8">
              {activeView === 'overview' ? 'Administration' : activeView === 'users' ? 'Gestion Clients' : activeView === 'content' ? 'Contenu & Modération' : 'Système'}
            </h2>
            <p className="text-zinc-500 text-sm">Contrôle parental pour l'écosystème Kitobi.io de demain.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <button className="relative p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#050505]" />
            </button>
            <div className="flex items-center gap-3 ml-4">
              <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-xl" alt="Admin" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Revenu Total", value: "$12,450", trend: "+12.5%", icon: DollarSign },
                  { label: "Utilisateurs Actifs", value: "4,203", trend: "+5.2%", icon: Users },
                  { label: "Restaurations", value: "85k", trend: "+25%", icon: Zap },
                  { label: "Appels API", value: "1.2M", trend: "+18%", icon: Network },
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 group hover:border-orange-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 group-hover:bg-orange-500/10 transition-colors")}>
                        <stat.icon className="w-6 h-6 text-zinc-500 group-hover:text-orange-500" />
                      </div>
                      <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{stat.trend}</span>
                    </div>
                    <div>
                      <p className="text-3xl font-black tracking-tighter mb-1">{stat.value}</p>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Croissance Utilisateurs</h3>
                    <select className="bg-transparent border-none text-xs text-zinc-500 focus:outline-none">
                      <option>7 derniers jours</option>
                      <option>30 derniers jours</option>
                    </select>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Activité Réseaux</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Live Status</span>
                    </div>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'users' && (
             <motion.div 
               key="users"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="space-y-8"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex gap-4">
                      {['Tous', 'Pro', 'Enterprise', 'Bannis'].map(filter => (
                        <button key={filter} className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 transition-all">
                          {filter}
                        </button>
                      ))}
                   </div>
                   <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                     <UserPlus className="w-4 h-4" /> Ajouter Client
                   </button>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden">
                   <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                          <th className="px-10 py-6">ID</th>
                          <th className="py-6">Nom</th>
                          <th className="py-6">Email</th>
                          <th className="py-6">Abonnement</th>
                          <th className="py-6 text-right px-10">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {mockUsers.map(u => (
                          <tr key={u.id} className="group hover:bg-white/[0.01] border-b border-white/[0.02]">
                            <td className="px-10 py-6 text-zinc-600 font-mono">#KBT-{u.id}</td>
                            <td className="py-6 font-bold">{u.name}</td>
                            <td className="py-6 text-zinc-400">{u.email}</td>
                            <td className="py-6">
                              <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase rounded-lg">{u.plan}</span>
                            </td>
                            <td className="py-6 text-right px-10 space-x-2">
                               <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                               <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                               <button className="p-2 hover:bg-white/5 rounded-lg text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
             </motion.div>
          )}

          {activeView === 'content' && renderContentManager()}

          {activeView === 'system' && (
            <motion.div 
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { label: 'API Gateway', status: 'Online', load: 45, icon: Network },
                { label: 'Cloud Storage', status: 'Optimal', load: 82, icon: HardDrive },
                { label: 'GenAI Cluster', status: 'High Load', load: 94, icon: Cpu },
                { label: 'Database Master', status: 'Online', load: 12, icon: Database },
                { label: 'Authentication', status: 'Online', load: 5, icon: Lock },
              ].map((comp, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 group hover:border-orange-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                      <comp.icon className="w-6 h-6 text-zinc-500 group-hover:text-orange-500" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      comp.status === 'Online' || comp.status === 'Optimal' ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                    )}>{comp.status}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold uppercase tracking-widest text-zinc-500">{comp.label}</span>
                      <span className="font-mono text-white">{comp.load}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${comp.load}%` }}
                        className={cn("h-full", comp.load > 90 ? "bg-red-500" : comp.load > 70 ? "bg-orange-500" : "bg-green-500")}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DollarSign = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const XCircle = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
