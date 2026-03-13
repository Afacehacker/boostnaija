import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingCart, Star, Zap, Shield, TrendingUp, ChevronRight, 
  CheckCircle2, Users, Globe, Instagram, Twitter, Youtube, 
  MessageCircle, Rocket, Heart, Play, ArrowRight, ShieldCheck,
  MousePointer2, Sparkles, BarChart3, HelpCircle, ChevronDown,
  X, Send, Tv, Facebook, Camera, Share2
} from 'lucide-react';

const LandingPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPopup, setShowPopup] = useState(false);
  
  // Show popup on every reload as requested
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic color palette based on theme
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderCol = isDark ? 'border-white/10' : 'border-slate-100';
  const meshBg = isDark ? 'bg-mesh-dark' : 'bg-mesh-light';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${meshBg} overflow-hidden font-sans`}>
      
      {/* Persuasive Welcome Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowPopup(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className={`relative w-full max-w-lg p-10 md:p-14 rounded-[4rem] border shadow-3xl overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-primary transition-colors"
              >
                <X size={28} />
              </button>

              <div className="text-center space-y-8">
                 <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20 shadow-2xl">
                    <Rocket size={40} className="animate-bounce" />
                 </div>
                 <h2 className={`text-4xl font-black tracking-tighter ${textColor}`}>Your Influence <br/> Starts <span className="text-primary italic">Now</span></h2>
                 <p className={`text-lg font-medium leading-relaxed ${subTextColor}`}>
                    At <span className="text-primary font-black">BoostNaija</span>, we don't just provide numbers; we build <b>Authority</b>. Join 15,000+ elite agents dominating the digital space.
                 </p>
                 
                 <div className="space-y-4">
                    <Link 
                      to="/register" 
                      className="w-full btn-primary py-6 rounded-[2rem] font-black text-xl shadow-2xl block"
                      onClick={() => setShowPopup(false)}
                    >
                      Launch My Growth
                    </Link>
                    <a 
                      href="https://t.me/boostnaija"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-6 rounded-[2rem] border-2 font-black text-lg flex items-center justify-center gap-4 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'}`}
                    >
                      <Send size={24} className="text-[#0088cc]" /> Join Telegram
                    </a>
                 </div>
                 <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500">Over 1M+ Orders Completed</p>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[100px] -z-0"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Elements / Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <motion.div 
           animate={{ 
             y: [0, -40, 0], 
             rotate: [0, 10, 0],
             scale: [1, 1.1, 1]
           }} 
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" 
         />
         <motion.div 
           animate={{ 
             y: [0, 50, 0], 
             rotate: [0, -15, 0],
             scale: [1, 1.2, 1]
           }} 
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" 
         />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 px-6">
        <div className="container mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 text-left"
              >
                 <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8 border border-primary/20 shadow-lg shadow-primary/5 cursor-pointer hover:scale-105 transition-transform active:scale-95">
                    <Sparkles size={16} />
                    <span>The Elite SMM Standard 2026</span>
                 </div>
                 
                 <h1 className={`text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tighter ${textColor} drop-shadow-sm`}>
                   Stop Posting. <br />
                   Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">Winning.</span>
                 </h1>
                 
                 <p className={`text-xl ${subTextColor} mb-12 max-w-xl leading-relaxed font-medium`}>
                    Why wait for the algorithm when you can lead it? <b>BoostNaija</b> provides the high-octane engagement 
                    your brand needs to stay top-of-mind and build undeniable social authority.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Link to="/register" className="btn-primary w-full sm:w-auto text-lg px-12 py-5 font-black flex items-center justify-center gap-3 group shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                       Deploy My Boost
                       <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </Link>
                    <a href="https://t.me/boostnaija" target="_blank" rel="noopener noreferrer" className={`w-full sm:w-auto py-5 px-10 rounded-[2.5rem] border-2 font-black text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                       <Send size={18} className="text-[#0088cc]" /> Support Channel
                    </a>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:w-1/2 relative"
              >
                 <div className="relative z-10 animate-float">
                    <img 
                      src="/social_media_mashup_grid_1773372186135.png" 
                      alt="BoostNaija Social Ecosystem" 
                      className={`w-full max-w-2xl mx-auto rounded-[4rem] transition-all drop-shadow-[0_35px_35px_rgba(255,102,0,0.2)]`}
                    />
                    {/* Floating HUD Elements */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className={`absolute -top-10 -right-10 glass p-6 rounded-3xl border ${borderCol} shadow-2xl hidden md:block`}
                    >
                       <TrendingUp className="text-primary mb-2" size={32} />
                       <p className={`text-[10px] font-black ${textColor}`}>VIRALITY SCORE</p>
                       <p className="text-2xl font-black text-green-500">MAXIMIZED</p>
                    </motion.div>
                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className={`absolute -bottom-6 -left-10 glass p-6 rounded-3xl border border-white/20 shadow-2xl hidden md:block`}
                    >
                       <div className="flex items-center gap-3 mb-2">
                          <Users className="text-blue-500" size={20} />
                          <p className="text-sm font-black text-white">15k Active Agents</p>
                       </div>
                       <p className="text-[10px] text-white/60 font-medium">Joining the takeover right now...</p>
                    </motion.div>
                 </div>
                 {/* Decorative Rings */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-primary/10 rounded-full -z-0"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-primary/5 rounded-full -z-0 animate-spin-slow"></div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Convincing Why Section */}
      <section className="py-24 px-6 relative">
         <div className="container mx-auto">
            <div className={`p-12 md:p-24 rounded-[5rem] border ${borderCol} relative overflow-hidden text-center ${isDark ? 'bg-slate-900' : 'bg-white shadow-3xl'}`}>
               <h2 className={`text-4xl md:text-6xl font-black mb-8 ${textColor}`}>Why Boost with <span className="text-primary italic">Us?</span></h2>
               <div className="grid md:grid-cols-3 gap-12 text-left">
                  <div className="space-y-4">
                     <p className="text-4xl font-black text-primary">01</p>
                     <h4 className={`text-xl font-black ${textColor}`}>Unmatched Speed</h4>
                     <p className={subTextColor}>Our proprietary 2026 delivery engine bypasses global queues. Most orders start in under 60 seconds.</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-4xl font-black text-primary">02</p>
                     <h4 className={`text-xl font-black ${textColor}`}>Algorithm-Safe</h4>
                     <p className={subTextColor}>We use drip-feed and intelligent profiles that platform algorithms see as 100% natural engagement.</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-4xl font-black text-primary">03</p>
                     <h4 className={`text-xl font-black ${textColor}`}>24/7 War Room</h4>
                     <p className={subTextColor}>Real support agents in Nigeria standing by on Telegram to ensure your mission succeeds every time.</p>
                  </div>
               </div>
               <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 blur-[100px]"></div>
            </div>
         </div>
      </section>

      {/* Trust & Proof Section - Redesigned for all social medias */}
      <section className={`py-20 border-y ${borderCol} ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
         <div className="container mx-auto px-6">
            <p className={`text-center text-[10px] font-black uppercase tracking-[0.5em] mb-12 ${subTextColor}`}>Dominate Every Platform</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-60">
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Instagram size={28}/> IG</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Globe size={28}/> TIKTOK</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Facebook size={28}/> FB</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Camera size={28}/> SNAPCHAT</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Twitter size={28}/> X</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Youtube size={28}/> YT</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Tv size={28}/> TWITCH</div>
               <div className={`flex items-center gap-3 text-xl font-black ${textColor} transition-all hover:text-primary hover:scale-110`}><Send size={28}/> TG</div>
            </div>
         </div>
      </section>
      
      {/* Existing Sections Continued... (Rest of the LandingPage content) */}
      <section className="py-32 px-6">
         <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               <FeatureCard 
                 icon={<Rocket className="text-primary" size={32} />}
                 title="Hyper-Sonic Delivery"
                 desc="Our algorithms prioritize your orders in the global provider queue, ensuring results start appearing in seconds, not hours."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<ShieldCheck className="text-primary" size={32} />}
                 title="Safe-Mode Protected"
                 desc="All services are strictly tested against platform TOS. We use drip-feed technology to mimic organic engagement patterns."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<BarChart3 className="text-primary" size={32} />}
                 title="Deep Analytics"
                 desc="Track your campaign progression in real-time with our advanced command center. Watch the numbers climb as they happen."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<Zap className="text-primary" size={32} />}
                 title="Auto-Refill Engine"
                 desc="Notice a drop? Our smart-engine automatically detects loss and triggers a refill within 24 hours (for supported services)."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<Users className="text-primary" size={32} />}
                 title="Agent Support 24/7"
                 desc="Our dedicated Nigerian support team is always online. Real humans helping you scale through Telegram and live chat."
                 theme={theme}
               />
               <FeatureCard 
                 icon={<Globe className="text-primary" size={32} />}
                 title="Global API Access"
                 desc="Direct integration with the world's most reliable SMM hubs, curated specifically for the Nigerian market rates."
                 theme={theme}
               />
            </div>
         </div>
      </section>

      {/* Pricing Calculator Mockup / Quick Start */}
      <section className="py-20 px-6">
         <div className="container mx-auto max-w-5xl">
            <div className={`bg-gradient-to-br ${isDark ? 'from-slate-900 to-black' : 'from-primary/5 to-white'} rounded-[4rem] border ${borderCol} p-12 lg:p-20 shadow-3xl relative overflow-hidden`}>
               <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                  <div className="lg:w-1/2 text-left">
                     <h3 className={`text-4xl md:text-5xl font-black mb-8 leading-tight ${textColor}`}>Ready to start <br /> your <span className="text-primary italic">TAKEOVER?</span></h3>
                     <p className={`text-lg ${subTextColor} mb-12 font-medium`}>Join 15,000+ Nigerian agents scaling their brands daily. Prices start from just <span className="text-primary font-black">₦50</span>.</p>
                     
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><CheckCircle2 size={24}/></div>
                           <p className={`font-bold ${textColor}`}>Instant Fund Crediting</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><CheckCircle2 size={24}/></div>
                           <p className={`font-bold ${textColor}`}>Lowest Market Rates Guaranteed</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="lg:w-1/2 w-full">
                     <div className={`p-8 rounded-[3rem] border ${borderCol} ${isDark ? 'bg-white/5' : 'bg-white'} shadow-2xl space-y-8`}>
                        <div className="text-center">
                           <p className={`text-xs font-black uppercase tracking-widest ${subTextColor} mb-2`}>Popular Choice</p>
                           <h4 className={`text-xl font-bold ${textColor}`}>IG World-Wide Followers</h4>
                        </div>
                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
                           <p className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} mb-1`}>Cost per 1,000</p>
                           <p className="text-4xl font-black text-primary">₦1,150.00</p>
                        </div>
                        <div className="space-y-4">
                           <Link to="/register" className="w-full btn-primary py-5 rounded-2xl font-black text-center block">Create Free Account</Link>
                           <p className={`text-[10px] text-center uppercase tracking-tighter ${subTextColor} font-black`}>No credit card required to browse services</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] -z-0"></div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6">
         <div className="container mx-auto max-w-3xl">
            <h2 className={`text-4xl font-black mb-16 text-center ${textColor}`}>Frequent <span className="text-primary italic">Queries</span></h2>
            <div className="space-y-6">
               <FAQItem 
                 question="Is there a risk of my account being banned?" 
                 answer="Absolutely not. We use high-quality profiles and drip-feed technology to ensure all engagement looks organic to platform algorithms. Thousands of users use BoostNaija daily without issues."
                 theme={theme}
               />
               <FAQItem 
                 question="How long does it take for my order to start?" 
                 answer="Most orders (95%) initiate within 0-60 seconds. However, some deep-tier engagement services may take up to 24 hours depending on network traffic."
                 theme={theme}
               />
               <FAQItem 
                 question="How do I fund my wallet?" 
                 answer="You can fund your account instantly using Paystack or Flutterwave. We support Bank Transfers, USSD, and Card payments. All transactions are automated."
                 theme={theme}
               />
               <FAQItem 
                 question="How do I reach support?" 
                 answer="Click the floating Telegram icon or join our official channel @boostnaija for 24/7 assistance from our Nigerian support team."
                 theme={theme}
               />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className={`py-24 border-t ${borderCol} ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-4 gap-16 mb-20">
              <div className="lg:col-span-1 text-left">
                 <Link to="/" className={`text-2xl font-black tracking-tighter block mb-8 ${textColor}`}>
                   BOOST<span className="text-primary italic">NAIJA</span>
                 </Link>
                 <p className={`${subTextColor} leading-relaxed font-bold italic mb-10`}>Scaling Nigerian influence, one click at a time.</p>
                 <div className="flex gap-4">
                    <SocialIcon icon={<Instagram size={20}/>} theme={theme} />
                    <SocialIcon icon={<Twitter size={20}/>} theme={theme} />
                    <SocialIcon icon={<Youtube size={20}/>} theme={theme} />
                    <SocialIcon icon={<Send size={20}/>} theme={theme} />
                 </div>
              </div>
              
              <div className="text-left">
                 <h5 className={`font-black uppercase tracking-widest text-xs mb-8 ${textColor}`}>The Engine</h5>
                 <ul className={`space-y-4 text-sm font-bold ${subTextColor}`}>
                    <li><Link to="/dashboard/services" className="hover:text-primary transition-colors">Service Store</Link></li>
                    <li><Link to="/register" className="hover:text-primary transition-colors">Partner Program</Link></li>
                    <li><Link to="/login" className="hover:text-primary transition-colors">Agent Login</Link></li>
                    <li><a href="#" className="hover:text-primary transition-colors">API for Developers</a></li>
                 </ul>
              </div>

              <div className="text-left">
                 <h5 className={`font-black uppercase tracking-widest text-xs mb-8 ${textColor}`}>Resources</h5>
                 <ul className={`space-y-4 text-sm font-bold ${subTextColor}`}>
                    <li><a href="#" className="hover:text-primary transition-colors">Growth Blog</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Service Status</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Influence</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Shield</a></li>
                 </ul>
              </div>

              <div className="text-left">
                 <h5 className={`font-black uppercase tracking-widest text-xs mb-8 ${textColor}`}>Newsletter</h5>
                 <p className={`text-xs ${subTextColor} mb-6 leading-relaxed`}>Get high-yield growth tips delivered to your inbox.</p>
                 <div className="relative">
                    <input type="email" placeholder="agent@boost.xyz" className={`w-full py-4 px-6 rounded-2xl outline-none border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} focus:border-primary transition-all text-sm font-black text-white`} />
                    <button className="absolute right-2 top-2 bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-all"><ChevronRight /></button>
                 </div>
              </div>
           </div>
           
           <div className={`p-10 rounded-[2.5rem] border ${borderCol} flex flex-col md:flex-row justify-between items-center gap-6 ${isDark ? 'bg-white/[0.02]' : 'bg-white'}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>&copy; {new Date().getFullYear()} BoostNaija Technologies Ltd.</p>
              <div className="flex gap-10">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Paystack_logo.png" className="h-4 grayscale opacity-40" alt="paystack" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Flutterwave_Logo.png" className="h-4 grayscale opacity-40" alt="flutterwave" />
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
      className={`p-10 rounded-[3rem] border ${isDark ? 'bg-slate-900/50 border-white/5 hover:border-primary/30' : 'bg-white border-slate-100 hover:border-primary/20'} transition-all shadow-xl text-left`}
    >
       <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 ${isDark ? 'bg-white/5' : 'bg-primary/5'}`}>
         {icon}
       </div>
       <h4 className={`text-xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
       <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
    </motion.div>
  );
};

const FAQItem = ({ question, answer, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === 'dark';
  return (
    <div className={`rounded-3xl border transition-all overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'} ${isOpen ? 'shadow-2xl' : ''}`}>
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full p-8 flex justify-between items-center text-left"
       >
          <span className={`font-black uppercase tracking-widest text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{question}</span>
          <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-primary`} size={20} />
       </button>
       <AnimatePresence>
         {isOpen && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
           >
              <div className={`px-8 pb-8 text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {answer}
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const SocialIcon = ({ icon, theme }) => {
  const isDark = theme === 'dark';
  return (
    <a href="https://t.me/boostnaija" target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-white hover:bg-primary' : 'bg-slate-100 text-slate-900 hover:bg-primary hover:text-white'}`}>
      {icon}
    </a>
  );
};

export default LandingPage;
