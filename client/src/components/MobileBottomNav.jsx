import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, List, Wallet, Home, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const isDark = theme === 'dark';

    if (!user) return null;

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: <Home size={18} /> },
        { name: 'Store', path: '/dashboard/services', icon: <ShoppingCart size={18} /> },
        { name: 'Status', path: '/dashboard/orders', icon: <List size={18} /> },
        { name: 'Vault', path: '/dashboard/wallet', icon: <Wallet size={18} /> },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin', path: '/staff-portal-99', icon: <Settings size={18} /> });
    } else {
        navItems.push({ name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> });
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none">
            <div className={`pointer-events-auto backdrop-blur-xl rounded-[2rem] border flex items-center justify-around p-2 shadow-2xl transition-all duration-500 overflow-hidden relative ${isDark ? 'bg-slate-900/90 border-white/10 shadow-primary/10' : 'bg-white/90 border-slate-100 shadow-slate-200'}`}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            className="relative flex flex-col items-center gap-1.5 transition-all group"
                        >
                            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-900'}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-primary opacity-100 scale-105' : 'text-slate-500 opacity-60'}`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
                {/* Visual Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary/20 rounded-full"></div>
            </div>
        </div>
    );
};

export default MobileBottomNav;
