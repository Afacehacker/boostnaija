import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Smartphone, Mail, Lock, ChevronRight, Zap, CloudLightning } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const cardBg = isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100 shadow-xl';

  const sections = [
    {
      title: "Security & Access",
      items: [
        { icon: <Lock size={20} />, title: "Two-Factor Authentication", desc: "Add an extra layer of protection to your account", status: "Inactive" },
        { icon: <Shield size={20} />, title: "Authorized sessions", desc: "Manage your active logins across devices", status: "Active" }
      ]
    },
    {
      title: "Notifications",
      items: [
        { icon: <Bell size={20} />, title: "Mission Alerts", desc: "Get notified when your growth mission status changes", status: "Enabled" },
        { icon: <Mail size={20} />, title: "Newsletter Feed", desc: "Receive weekly high-yield growth strategies", status: "Opted-in" }
      ]
    }
  ];

  return (
    <div className="pt-28 px-6 pb-32 max-w-5xl mx-auto font-sans">
      <div className="mb-16">
        <h1 className={`text-4xl md:text-5xl font-black mb-4 ${textColor}`}>Account Control</h1>
        <p className={`text-lg font-medium ${subTextColor}`}>Configure your agent profile and security protocols.</p>
      </div>

      <div className="space-y-16">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ${cardBg}`}
        >
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary border-4 border-primary/10 shadow-2xl">
              <User size={64} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className={`text-3xl font-black mb-2 ${textColor}`}>{user?.name || 'Agent Unknown'}</h3>
              <p className={`text-sm font-black uppercase tracking-[0.3em] mb-6 text-primary`}>{user?.role || 'Agent'} Clearance</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className={`px-5 py-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                    <Mail size={16} className="text-primary" />
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{user?.email}</span>
                 </div>
                 <div className={`px-5 py-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                    <Smartphone size={16} className="text-primary" />
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mobile Linked</span>
                 </div>
              </div>
            </div>
            <button 
              onClick={() => toast.info('Profile encryption active. Changes are currently managed via support.')}
              className="px-8 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest bg-primary text-white shadow-lg active:scale-95 transition-all"
            >
              Edit Profile
            </button>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px]"></div>
        </motion.div>

        {/* Settings Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-8">
            <h4 className={`text-xs font-black uppercase tracking-[0.5em] ${subTextColor} pl-2`}>{section.title}</h4>
            <div className="grid gap-6">
              {section.items.map((item, i) => (
                <div 
                  key={i}
                  className={`p-8 rounded-[2rem] border flex items-center justify-between transition-all hover:scale-[1.01] ${cardBg}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5 text-primary' : 'bg-slate-50 text-primary'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h5 className={`font-black text-lg ${textColor}`}>{item.title}</h5>
                      <p className={`text-sm font-medium ${subTextColor}`}>{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${item.status === 'Active' || item.status === 'Enabled' || item.status === 'Opted-in' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                      {item.status}
                    </span>
                    <ChevronRight size={20} className={subTextColor} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="pt-8 border-t border-red-500/20">
          <div className={`p-10 rounded-[2.5rem] border border-red-500/20 ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
            <h4 className="text-red-500 font-black uppercase tracking-widest text-xs mb-4">Danger Zone</h4>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Deleting your account will permanently wipe all mission logs and wallet balance.</p>
              <button className="px-6 py-4 rounded-2xl border border-red-500/50 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">Terminate Identity</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
