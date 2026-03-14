import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, Smartphone, Mail, Lock, ChevronRight, 
  Zap, CloudLightning, Fingerprint, Activity, ShieldAlert,
  Terminal, Globe, Cpu, Key, LogOut, Settings as SettingsIcon, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  const sections = [
    {
      title: "SECURITY",
      items: [
        { icon: <Lock size={20} />, title: "Change Password", desc: "Keep your account safe", status: "STABLE" },
        { icon: <Smartphone size={20} />, title: "Two-Factor Auth", desc: "Extra layer of security", status: "OFFLINE" },
      ]
    },
    {
      title: "NOTIFICATIONS",
      items: [
        { icon: <Bell size={20} />, title: "Order Updates", desc: "Get notified when orders finish", status: "ON" },
        { icon: <Activity size={20} />, title: "News & Alerts", desc: "Updates about system and rates", status: "ON" }
      ]
    }
  ];

  return (
    <div className={`pt-24 md:pt-32 px-4 md:px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-12 md:mb-16">
          <h1 className={`text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight ${textColor}`}>
            Account <span className="text-primary italic">Settings</span>
          </h1>
          <p className={`text-base md:text-xl font-medium ${subTextColor} max-w-xl leading-relaxed`}>
            Manage your profile, security, and notification preferences.
          </p>
        </div>

        <div className="space-y-12">
          {/* User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border shadow-xl relative overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="relative">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/10 text-4xl font-black italic">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white border-4 border-white dark:border-slate-900">
                    <ShieldCheck size={16} />
                 </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                 <div>
                    <h3 className={`text-2xl md:text-4xl font-black mb-1 ${textColor}`}>{user?.name?.toUpperCase() || 'USER'}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.3em] text-primary italic`}>{user?.role || 'Member'} — Verified Account</p>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className={`px-4 py-2 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                       <Mail size={16} className="text-primary" />
                       <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{user?.email}</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={logout}
                className="px-8 py-4 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Settings Sections */}
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className={`text-[10px] font-bold uppercase tracking-[0.4em] ${subTextColor} pl-4`}>{section.title}</h4>
              <div className="grid gap-4">
                {section.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className={`p-6 md:p-8 rounded-2xl md:rounded-3xl border flex items-center justify-between transition-all ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/30' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary`}>
                        {item.icon}
                      </div>
                      <div>
                        <h5 className={`font-bold text-lg ${textColor}`}>{item.title}</h5>
                        <p className={`text-[10px] font-medium ${subTextColor}`}>{item.desc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full border text-[8px] font-bold uppercase ${
                        item.status === 'STABLE' || item.status === 'ON' || item.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                         {item.status}
                      </span>
                      <ChevronRight size={18} className="opacity-20" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Delete Account */}
          <div className="pt-12">
            <div className={`p-8 rounded-[2rem] border border-red-500/20 shadow-lg ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
               <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                     <h4 className="text-red-500 font-black text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                        <ShieldAlert size={20} /> Delete Account
                     </h4>
                     <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-md`}>
                        This will permanently delete your orders and wallet balance. This action cannot be undone.
                     </p>
                  </div>
                  <button className="px-8 py-4 rounded-xl border border-red-500/50 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                     Delete Permanently
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
