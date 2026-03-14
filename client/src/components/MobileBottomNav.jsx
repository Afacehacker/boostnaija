import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, ShoppingCart, List, Wallet, Home, Settings, 
    Shield, Cpu, Activity, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const MobileBottomNav = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const isDark = theme === 'dark';

    if (!user) return null;

    const navItems = [
        { name: 'NEXUS', path: '/dashboard', icon: <Cpu size={20} /> },
        { name: 'ARSENAL', path: '/dashboard/services', icon: <Zap size={20} /> },
        { name: 'LOGS', path: '/dashboard/orders', icon: <Activity size={20} /> },
        { name: 'VAULT', path: '/dashboard/wallet', icon: <Wallet size={20} /> },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'CENTRAL', path: '/staff-portal-99', icon: <Shield size={20} /> });
    }

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-[100] px-6 pointer-events-none">
            <div className={`
                pointer-events-auto backdrop-blur-2xl rounded-[2.5rem] border flex items-center justify-around p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 relative
                ${isDark ? 'glass-panel border-white/10' : 'bg-white/90 border-slate-100'}
            `}>
                <AnimatePresence>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                className="relative flex flex-col items-center justify-center py-2 px-1 transition-all group active:scale-90"
                            >
                                <div className={`
                                    relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                                    ${isActive 
                                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(58,122,254,0.5)] scale-110' 
                                        : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}
                                `}>
                                    {React.cloneElement(item.icon, { 
                                        size: isActive ? 22 : 20,
                                        className: isActive ? 'animate-pulse-subtle' : '' 
                                    })}
                                    
                                    {isActive && (
                                        <motion.div 
                                          layoutId="active-nav-glow"
                                          className="absolute -inset-2 bg-primary/20 blur-xl rounded-full -z-10"
                                        />
                                    )}
                                </div>
                                <span className={`
                                    text-[7px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-300
                                    ${isActive ? 'text-primary opacity-100' : 'text-slate-500 opacity-40'}
                                `}>
                                    {item.name}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                      layoutId="active-dot"
                                      className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </AnimatePresence>
                
                {/* Decorative scanning line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            </div>
        </div>
    );
};

export default MobileBottomNav;

