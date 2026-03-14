import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingCart, Star, Zap, Shield, TrendingUp, ChevronRight, 
  CheckCircle2, Users, Globe, Instagram, Twitter, Youtube, 
  MessageCircle, Rocket, Heart, Play, ArrowRight, ShieldCheck,
  MousePointer2, Sparkles, BarChart3, HelpCircle, ChevronDown,
  X, Send, Tv, Facebook, Camera, Share2, Activity, Database, Cpu
} from 'lucide-react';

const LandingPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderCol = isDark ? 'border-white/10' : 'border-slate-100';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-500 ${meshBg} overflow-hidden font-sans selection:bg-primary/30`}>
      
      {/* Persuasive Welcome Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick={() => setShowPopup(false)}
            />
            <motion.div 
              initial={{ scale: 0.8, y: 100, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`relative w-full max-w-xl p-12 md:p-16 rounded-[4rem] border shadow-3xl overflow-hidden z-[210] perspective-1000 ${isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-10 right-10 text-slate-500 hover:text-primary transition-all p-3 z-[220] group"
              >
                <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>

              <div className="text-center space-y-10 relative z-10">
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20 shadow-[0_0_50px_rgba(58,122,254,0.3)]"
                 >
                    <Cpu size={48} className="animate-pulse" />
                 </motion.div>
                 <h2 className={`text-5xl font-black tracking-tighter leading-none ${textColor}`}>
                   ACCESS THE <br/><span className="text-gradient italic">FUTURE</span>
                 </h2>
                 <p className={`text-xl font-medium leading-relaxed ${subTextColor}`}>
                    Join the elite network of <span className="text-primary font-black">15k+ Agents</span> dominating the digital landscape in Nigeria.
                 </p>
                 
                 <div className="grid gap-4">
                    <Link 
                      to="/register" 
                      className="btn-primary py-6 rounded-3xl font-black text-xl shadow-[0_20px_40px_rgba(58,122,254,0.4)] block hover:scale-[1.02] transition-transform"
                      onClick={() => setShowPopup(false)}
                    >
                      Enlist for Takeover
                    </Link>
                    <a 
                      href="https://t.me/boostnaija"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-6 rounded-3xl border-2 font-black text-lg flex items-center justify-center gap-4 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'}`}
                    >
                      <Send size={24} className="text-[#0088cc]" /> Join HQ Channel
                    </a>
                 </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[120px] -z-0"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <motion.div style={{ opacity, scale }} className="container mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
              <motion.div 
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="lg:w-[55%] text-left"
              >
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="inline-flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.5em] uppercase mb-10 border-primary/20 shadow-xl"
                 >
                    <Activity size={16} className="text-primary animate-pulse" />
                    <span className="text-gradient">NETWORK OPERATIONAL | v2.0.4.6</span>
                 </motion.div>
                 
                 <h1 className={`text-7xl md:text-[9.5rem] font-black mb-10 leading-[0.85] tracking-[-0.04em] ${textColor}`}>
                   ELITE <br />
                   <span className="text-gradient italic">AUTHORITY.</span>
                 </h1>
                 
                 <p className={`text-2xl ${subTextColor} mb-14 max-w-2xl leading-relaxed font-medium`}>
                    Why beg for attention when you can <span className="text-primary font-black">engineer</span> it? 
                    BoostNaija delivers the high-octane engagement required to dominate the digital hierarchy.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-8">
                    <Link to="/register" className="btn-primary group w-full sm:w-auto text-xl px-14 py-7 font-black flex items-center justify-center gap-4 shadow-[0_30px_60px_rgba(58,122,254,0.3)]">
                       Launch Arsenal
                       <ArrowRight className="group-hover:translate-x-3 transition-transform duration-500" size={24} />
                    </Link>
                    <div className="flex -space-x-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-14 h-14 rounded-2xl border-4 border-background-dark overflow-hidden shadow-2xl transition-transform hover:scale-110 cursor-pointer">
                            <img src={`https://i.pravatar.cc/150?u=${i*100}`} alt="Agent" />
                         </div>
                       ))}
                       <div className={`w-14 h-14 rounded-2xl border-4 border-background-dark ${isDark ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-black tracking-tighter ${textColor} shadow-2xl`}>
                         +15K
                       </div>
                    </div>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.5, rotateY: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:w-[45%] relative perspective-1000"
              >
                  <div className="relative z-10 animate-float optimize-gpu group">
                    <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/40 transition-all duration-1000"></div>
                    <img 
                      src="/boostnaija_hero_abstract_3d_1773491405927.png" 
                      alt="BoostNaija Core" 
                      className="w-full h-auto rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    
                    {/* Floating Data Nodes */}
                    <div className="absolute -top-12 -right-8 glass-panel p-8 rounded-3xl border border-white/10 shadow-3xl animate-pulse-subtle">
                       <TrendingUp className="text-primary mb-3" size={32} />
                       <p className={`text-[10px] font-black ${textColor} tracking-widest`}>SIGNAL STRENGTH</p>
                       <p className="text-3xl font-black text-green-500 italic">CRITICAL</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </motion.div>
      </section>

      {/* Strategic Arsenal Section */}
      <section className="py-40 px-6 relative">
         <div className="container mx-auto">
            <div className="text-center mb-32">
               <p className="text-primary text-[12px] font-black uppercase tracking-[0.8em] mb-6">Capabilities</p>
               <h2 className={`text-6xl font-black ${textColor} tracking-tight`}>STRATEGIC <span className="text-gradient italic">ARSENAL</span></h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
               <FeatureCard 
                 icon={<Zap className="text-primary" size={36} />}
                 title="Instant Deployment"
                 desc="Our direct-link infrastructure bypasses standard SMM latency, delivering engagement signals in under 60 seconds."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<ShieldCheck className="text-primary" size={36} />}
                 title="H-Grade Security"
                 desc="Encrypted transactions and drip-feed algorithms ensure your growth follows platform safety protocols perfectly."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<Database className="text-primary" size={36} />}
                 title="Deep API Sync"
                 desc="We pull directly from global prime providers, giving you the best market rates in Nigeria across all tiers."
                 theme={theme}
               />
            </div>
         </div>
      </section>

      {/* Neural Core Proof */}
      <section className={`py-32 border-y border-white/5 relative overflow-hidden ${isDark ? 'bg-black/40' : 'bg-slate-50'}`}>
         <div className="absolute inset-0 bg-space-stars opacity-10 grayscale pointer-events-none"></div>
         <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
            <h3 className={`text-xl font-black uppercase tracking-[0.5em] mb-20 text-center ${subTextColor}`}>Cross-Platform Interoperability</h3>
            <div className="flex flex-wrap justify-center gap-16 lg:gap-32 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <Instagram size={40} className="hover:text-primary transition-colors cursor-pointer" />
               <Youtube size={40} className="hover:text-primary transition-colors cursor-pointer" />
               <Twitter size={40} className="hover:text-primary transition-colors cursor-pointer" />
               <Facebook size={40} className="hover:text-primary transition-colors cursor-pointer" />
               <Globe size={40} className="hover:text-primary transition-colors cursor-pointer" />
            </div>
         </div>
      </section>

      {/* CTA Mission Base */}
      <section className="py-48 px-6 text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className={`max-w-5xl mx-auto rounded-[6rem] p-24 border ${borderCol} glass-panel relative overflow-hidden`}
         >
            <div className="relative z-10">
               <h2 className={`text-7xl font-black mb-10 ${textColor} tracking-tight leading-none`}>ENLIST <br /><span className="text-gradient italic text-8xl">TODAY.</span></h2>
               <p className={`text-2xl ${subTextColor} mb-16 max-w-2xl mx-auto font-medium`}>The algorithm is waiting for its new leader. Are you ready to deploy?</p>
               <Link to="/register" className="btn-primary py-8 px-20 text-2xl font-black rounded-3xl inline-block hover:shadow-[0_40px_80px_rgba(58,122,254,0.5)]">
                  Initialize Enlistment
               </Link>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-3xl -z-10 animate-pulse-subtle"></div>
         </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-40 border-t ${borderCol} ${isDark ? 'bg-black' : 'bg-white'}`}>
         <div className="container mx-auto px-10">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-32">
               <div className="max-w-sm">
                  <h4 className={`text-4xl font-black mb-10 tracking-tighter ${textColor}`}>BOOST<span className="text-primary italic">NAIJA</span></h4>
                  <p className={`text-lg ${subTextColor} font-bold italic mb-12`}>Engineering Social Dominance for the Nigerian Elite.</p>
                  <div className="flex gap-6">
                     <SocialIcon icon={<Instagram size={24}/>} theme={theme} />
                     <SocialIcon icon={<Twitter size={24}/>} theme={theme} />
                     <SocialIcon icon={<Send size={24}/>} theme={theme} />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-24 lg:gap-40">
                  <FooterMenu title="System" links={['Nexus', 'Arsenal', 'Command Console']} theme={theme} />
                  <FooterMenu title="Network" links={['Operational Logs', 'API Core', 'Terms of Siege']} theme={theme} />
                  <FooterMenu title="Base" links={['Intel HQ', 'Support Node', 'Encrypted Line']} theme={theme} />
               </div>
            </div>
            <div className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
               <p className={`text-[12px] font-black uppercase tracking-[0.6em] ${subTextColor}`}>&copy; 2026 BOOSTNAIJA TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
               <div className="flex gap-12 grayscale opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Paystack_logo.png" className="h-4" alt="paystack" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Flutterwave_Logo.png" className="h-4" alt="flutterwave" />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, theme }) => {
  const isDark = theme === 'dark';
  return (
    <motion.div 
      whileHover={{ y: -20, scale: 1.02 }}
      className={`p-16 rounded-[4rem] border shadow-2xl transition-all duration-500 overflow-hidden relative group ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/50 hover:bg-slate-900/80' : 'bg-white border-slate-100 hover:border-primary/30 hover:bg-slate-50'}`}
    >
       <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500 ${isDark ? 'bg-white/5' : 'bg-primary/5'}`}>
         {icon}
       </div>
       <h4 className={`text-3xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
       <p className={`text-lg leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
       <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

const FooterMenu = ({ title, links, theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className="text-left">
       <h5 className={`font-black uppercase tracking-[0.4em] text-[10px] mb-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h5>
       <ul className={`space-y-6 text-sm font-black ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {links.map(l => <li key={l}><a href="#" className="hover:text-primary transition-all hover:translate-x-2 inline-block">{l}</a></li>)}
       </ul>
    </div>
  );
};

const SocialIcon = ({ icon, theme }) => {
  const isDark = theme === 'dark';
  return (
    <a href="#" className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-white hover:bg-primary' : 'bg-slate-100 text-slate-900 hover:bg-primary hover:text-white'}`}>
      {icon}
    </a>
  );
};

export default LandingPage;

