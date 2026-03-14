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
      
      {/* Welcoming Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowPopup(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-[95%] md:w-full max-w-lg p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border shadow-2xl overflow-hidden z-[210] ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-primary transition-all p-2 z-[220]"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-6 md:space-y-8 relative z-10">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
                    <Sparkles size={40} className="animate-pulse" />
                 </div>
                 <h2 className={`text-3xl md:text-4xl font-black tracking-tight leading-tight ${textColor}`}>
                   Welcome to <span className="text-primary italic">BoostNaija</span> 🇳🇬
                 </h2>
                 <p className={`text-base md:text-lg font-medium leading-relaxed ${subTextColor}`}>
                    Join over <span className="text-primary font-bold">15,000+ Nigerians</span> who grow their Instagram, TikTok & YouTube accounts with us daily!
                 </p>
                 
                 <div className="grid gap-3 md:gap-4">
                    <Link 
                      to="/register" 
                      className="btn-primary py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg shadow-lg block hover:scale-[1.02] transition-transform"
                      onClick={() => setShowPopup(false)}
                    >
                      Create Free Account
                    </Link>
                    <a 
                      href="https://t.me/boostnaija"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-4 md:py-5 rounded-xl md:rounded-2xl border-2 font-bold text-base flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'}`}
                    >
                      <Send size={20} className="text-[#0088cc]" /> Join Telegram Group
                    </a>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-6">
        <motion.div style={{ opacity, scale }} className="container mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-[55%] text-left"
              >
                 <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-[10px] md:text-[12px] font-bold tracking-widest uppercase mb-6 border border-primary/20 text-primary">
                    <Activity size={14} />
                    <span>Naija's #1 Social Media Provider</span>
                 </div>
                 
                 <h1 className={`text-5xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] font-black mb-6 md:mb-8 leading-[0.9] tracking-tight ${textColor}`}>
                   GROW YOUR <br />
                   <span className="text-primary italic">PRESENCE.</span>
                 </h1>
                 
                 <p className={`text-lg md:text-2xl ${subTextColor} mb-8 md:mb-12 max-w-2xl leading-relaxed font-medium`}>
                    Get real followers, likes, and views instantly. We help Nigerian influencers, brands, and businesses dominate social media with ease.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                    <Link to="/register" className="btn-primary group w-full sm:w-auto text-lg md:text-xl px-12 py-5 md:py-6 font-bold flex items-center justify-center gap-3 shadow-xl">
                       Get Started Now
                       <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </Link>
                    <div className="flex -space-x-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden shadow-md">
                            <img src={`https://i.pravatar.cc/150?u=${i*100}`} alt="User" />
                         </div>
                       ))}
                       <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white ${isDark ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-bold ${textColor}`}>
                         +15K
                       </div>
                    </div>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="lg:w-[45%] relative w-full"
              >
                  <div className="relative z-10 group">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50"></div>
                    <img 
                      src="/nexus_hero.png" 
                      alt="Social Media Growth" 
                      className="w-full h-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/10"
                    />
                    
                    {/* Growth Badge */}
                    <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary/20 shadow-xl">
                       <TrendingUp className="text-primary mb-1" size={24} />
                       <p className={`text-[10px] font-bold ${textColor} tracking-wider`}>DAILY GROWTH</p>
                       <p className="text-xl font-bold text-green-500">+4,500%</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative">
         <div className="container mx-auto">
            <div className="text-center mb-16 md:mb-24">
               <p className="text-primary text-[10px] md:text-[12px] font-bold uppercase tracking-[0.4em] mb-4">Our Services</p>
               <h2 className={`text-4xl md:text-5xl font-black ${textColor} tracking-tight`}>WHY CHOOSE <span className="text-primary italic">BOOSTNAIJA?</span></h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               <FeatureCard 
                 icon={<Zap className="text-primary" size={32} />}
                 title="Instant Delivery"
                 desc="Our system is fully automated. Your followers and likes start coming in immediately after you place an order."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<ShieldCheck className="text-primary" size={32} />}
                 title="Safe & Secure"
                 desc="We never ask for your password. Our methods are 100% safe and follow all social media platform rules."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<Database className="text-primary" size={32} />}
                 title="Affordable Prices"
                 desc="We offer the cheapest rates in Nigeria for high-quality SMM services. Grow your brand without breaking the bank."
                 theme={theme}
               />
            </div>
         </div>
      </section>

      {/* Social Platforms */}
      <section className={`py-16 md:py-24 border-y border-white/5 relative overflow-hidden ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
         <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
            <h3 className={`text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-12 text-center ${subTextColor}`}>Platforms We Support</h3>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-60">
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                  <Instagram size={36} className="text-primary" />
                  <span className="text-[10px] font-bold">INSTAGRAM</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                  <Youtube size={36} className="text-red-500" />
                  <span className="text-[10px] font-bold">YOUTUBE</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                  <Twitter size={36} className="text-sky-400" />
                  <span className="text-[10px] font-bold">TWITTER (X)</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                  <Facebook size={36} className="text-blue-600" />
                  <span className="text-[10px] font-bold">FACEBOOK</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                  <Globe size={36} className="text-primary" />
                  <span className="text-[10px] font-bold">WEBSITE</span>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-4 md:px-6 text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className={`max-w-4xl mx-auto rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-20 border ${borderCol} relative overflow-hidden shadow-xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
         >
            <div className="relative z-10">
               <h2 className={`text-3xl md:text-6xl font-black mb-6 md:mb-8 ${textColor} tracking-tight leading-tight`}>READY TO <span className="text-primary italic">BLAST OFF?</span></h2>
               <p className={`text-lg md:text-xl ${subTextColor} mb-10 md:mb-12 max-w-xl mx-auto font-medium`}>Join 15k+ smart Nigerians growing their influence today. Registration is free and takes 1 minute.</p>
               <Link to="/register" className="btn-primary py-5 md:py-6 px-12 md:px-16 text-lg md:text-xl font-bold rounded-xl md:rounded-2xl inline-block shadow-lg">
                  Join BoostNaija Now
               </Link>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-3xl -z-10"></div>
         </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-20 border-t ${borderCol} ${isDark ? 'bg-black' : 'bg-white'}`}>
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
               <div className="max-w-xs">
                  <h4 className={`text-3xl font-black mb-6 tracking-tighter ${textColor}`}>BOOST<span className="text-primary italic">NAIJA</span></h4>
                  <p className={`text-base ${subTextColor} font-medium mb-8`}>The most trusted and reliable SMM provider in Nigeria for quality social media growth.</p>
                  <div className="flex gap-4">
                     <SocialIcon icon={<Instagram size={20}/>} theme={theme} />
                     <SocialIcon icon={<Twitter size={20}/>} theme={theme} />
                     <SocialIcon icon={<Send size={20}/>} theme={theme} />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-24 lg:gap-32">
                  <FooterMenu title="Platform" links={['Home', 'Prices', 'API']} theme={theme} />
                  <FooterMenu title="Company" links={['Contact', 'About Us', 'Terms']} theme={theme} />
                  <FooterMenu title="Support" links={['WhatsApp', 'Telegram', 'Email']} theme={theme} />
               </div>
            </div>
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <p className={`text-[10px] md:text-[12px] font-bold uppercase tracking-wider ${subTextColor} text-center`}>&copy; 2026 BOOSTNAIJA. ALL RIGHTS RESERVED.</p>
               <div className="flex gap-8 grayscale opacity-60">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Paystack_logo.png" className="h-3 md:h-4" alt="paystack" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Flutterwave_Logo.png" className="h-3 md:h-4" alt="flutterwave" />
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
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[2rem] border shadow-lg transition-all duration-300 relative group ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/40' : 'bg-white border-slate-100 hover:border-primary/20'}`}
    >
       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-primary/10 text-primary`}>
         {icon}
       </div>
       <h4 className={`text-2xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
       <p className={`text-base leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
    </motion.div>
  );
};

const FooterMenu = ({ title, links, theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className="text-left">
       <h5 className={`font-bold uppercase tracking-widest text-[10px] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h5>
       <ul className={`space-y-4 text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {links.map(l => <li key={l}><a href="#" className="hover:text-primary transition-all">{l}</a></li>)}
       </ul>
    </div>
  );
};

const SocialIcon = ({ icon, theme }) => {
  const isDark = theme === 'dark';
  return (
    <a href="#" className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-white hover:bg-primary' : 'bg-slate-100 text-slate-900 hover:bg-primary hover:text-white'}`}>
      {icon}
    </a>
  );
};

export default LandingPage;
