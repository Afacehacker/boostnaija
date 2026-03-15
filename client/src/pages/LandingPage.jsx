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
                        href="https://t.me/everythinglogs01"
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
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left space-y-8 md:space-y-10">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-[0.2em] text-[10px] md:text-xs"
                 >
                   <Sparkles size={16} /> #1 SMM PANEL IN NIGERIA 🇳🇬
                 </motion.div>

                 <h1 className={`text-5xl md:text-8xl font-black ${textColor} leading-[0.9] tracking-tighter`}>
                   BOOST YOUR <br />
                   <span className="text-primary italic">DIGITAL</span> <br />
                   PRESENCE.
                 </h1>

                 <p className={`text-lg md:text-2xl font-medium ${subTextColor} max-w-xl mx-auto lg:mx-0 leading-relaxed`}>
                   Stop waiting for the algorithm o! Get instant followers, likes, and views on all social platforms. Safe, fast, and very cheap.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
                    <Link to="/register" className="btn-primary py-5 md:py-6 px-10 md:px-14 text-lg md:text-xl font-bold rounded-xl md:rounded-2xl flex items-center gap-3">
                       Get Started Now <ArrowRight size={24} />
                    </Link>
                    <Link to="/dashboard/services" className={`py-5 md:py-6 px-10 md:px-14 text-lg md:text-xl font-bold rounded-xl md:rounded-2xl border-2 transition-all flex items-center gap-3 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}>
                       View Prices
                    </Link>
                 </div>

                 <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                    <div className="text-center lg:text-left">
                       <p className={`text-2xl md:text-3xl font-black ${textColor}`}>15K+</p>
                       <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Active Users</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-center lg:text-left">
                       <p className={`text-2xl md:text-3xl font-black ${textColor}`}>1.2M+</p>
                       <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Orders Completed</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-center lg:text-left">
                       <p className={`text-2xl md:text-3xl font-black ${textColor}`}>4.9/5</p>
                       <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Client Rating</p>
                    </div>
                 </div>
              </div>

              <motion.div
                initial={{ opacity: 0, rotateY: 20 }}
                animate={{ opacity: 1, rotateY: 0 }}
                className="hidden lg:block perspective-1000"
              >
                  <div className="relative rotate-y-12 transition-transform duration-700 hover:rotate-0">
                     <img
                       src="/hero.png"
                       alt="Social Media Growth"
                       className="w-full h-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/10"
                     />

                     {/* Growth Badge */}
                     <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary/20 shadow-xl text-center">
                        <TrendingUp className="text-primary mb-1 mx-auto" size={24} />
                        <p className={`text-[10px] font-bold ${textColor} tracking-wider`}>DAILY GROWTH</p>
                        <p className="text-xl font-bold text-green-500">+4,500%</p>
                     </div>
                  </div>
              </motion.div>
           </div>
        </motion.div>
      </section>

      {/* Social Platforms */}
      <section className={`py-16 md:py-24 border-y border-white/5 relative overflow-hidden ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
         <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
            <h3 className={`text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-12 text-center ${subTextColor}`}>Platforms We Support</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8 md:gap-16 items-center">
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-all hover:-translate-y-2">
                  <Instagram size={48} className="text-pink-600" />
                  <span className="text-[10px] font-black tracking-widest">INSTAGRAM</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-all hover:-translate-y-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-black rounded-lg">
                    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M34.1 9A8.9 8.9 0 0 1 32 3h-6.5v28.6a4.4 4.4 0 1 1-3-4.1V21a11 11 0 1 0 9.5 10.9V20.1a15.2 15.2 0 0 0 8.9 2.8v-6.4A8.9 8.9 0 0 1 34.1 9Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-black tracking-widest">TIKTOK</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-all hover:-translate-y-2">
                  <Youtube size={48} className="text-red-600" />
                  <span className="text-[10px] font-black tracking-widest">YOUTUBE</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-all hover:-translate-y-2">
                  <Facebook size={48} className="text-blue-700" />
                  <span className="text-[10px] font-black tracking-widest">FACEBOOK</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-all hover:-translate-y-2">
                  <Twitter size={48} className="text-sky-500" />
                  <span className="text-[10px] font-black tracking-widest">TWITTER (X)</span>
               </div>
               <div className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-all hover:-translate-y-2">
                  <MessageCircle size={48} className="text-green-500" />
                  <span className="text-[10px] font-black tracking-widest">THREADS</span>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
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
                 desc="No long thing o! Your followers and likes start coming in immediately after you pay. Automation at its best."
                 theme={theme}
               />
               <FeatureCard
                 icon={<ShieldCheck className="text-primary" size={32} />}
                 title="Safe & Secure"
                 desc="We never ask for your password. Our methods are 100% safe. Your account protection is our top priority."
                 theme={theme}
               />
               <FeatureCard
                 icon={<Database className="text-primary" size={32} />}
                 title="Cheapest in Naija"
                 desc="We offer the most affordable rates for high-quality SMM services. Grow your brand without breaking your wallet."
                 theme={theme}
               />
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
            <div className="relative z-10 text-center">
               <h2 className={`text-3xl md:text-6xl font-black mb-6 md:mb-8 ${textColor} tracking-tight leading-tight`}>READY TO <span className="text-primary italic">GO VIRAL?</span></h2>
               <p className={`text-lg md:text-xl ${subTextColor} mb-10 md:mb-12 max-w-xl mx-auto font-medium`}>Join 15k+ smart Nigerians growing their influence today. Registration is free and takes less than a minute. No capping!</p>
               <Link to="/register" className="btn-primary py-5 md:py-6 px-12 md:px-16 text-lg md:text-xl font-bold rounded-xl md:rounded-2xl inline-block shadow-lg">
                  Join BoostNaija Now 🚀
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
                      <SocialIcon
                        icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.15 8.15 0 0 0 4.77 1.52V7.01a4.85 4.85 0 0 1-1-.32z"/></svg>}
                        href="https://www.tiktok.com/@boostnaija"
                        theme={theme}
                      />
                   </div>
               </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-24 lg:gap-32">
                   <FooterMenu title="Platform" links={['Home', 'Prices', 'API']} theme={theme} />
                   <FooterMenu title="Company" links={['Contact', 'About Us', 'Terms']} theme={theme} />
                   <FooterMenu title="Support" links={['TikTok: @boostnaija']} theme={theme} />
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

const SocialIcon = ({ icon, href = '#', theme }) => {
  const isDark = theme === 'dark';
  return (
    <a href={href} target={href !== '#' ? '_blank' : undefined} rel={href !== '#' ? 'noopener noreferrer' : undefined} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-white hover:bg-primary' : 'bg-slate-100 text-slate-900 hover:bg-primary hover:text-white'}`}>
      {icon}
    </a>
  );
};

export default LandingPage;
