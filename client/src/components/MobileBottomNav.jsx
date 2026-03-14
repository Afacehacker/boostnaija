import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, ShoppingCart, List, Wallet, Home, Settings, 
    Shield, Cpu, Activity, Zap, User
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
        { name: 'HOME', path: '/dashboard', icon: <Home size={20} /> },
        { name: 'SERVICES', path: '/dashboard/services', icon: <ShoppingCart size={20} /> },
        { name: 'ORDERS', path: '/dashboard/orders', icon: <List size={20} /> },
        { name: 'WALLET', path: '/dashboard/wallet', icon: <Wallet size={20} /> },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'ADMIN', path: '/staff-portal-99', icon: <User size={20} /> });
    }

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-[100] px-6 pointer-events-none">
            <div className={`
                pointer-events-auto backdrop-blur-2xl rounded-3xl border flex items-center justify-around p-2 shadow-2xl transition-all duration-500 relative
                ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white/95 border-slate-100'}
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
                                    relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${isActive 
                                        ? 'bg-primary text-white shadow-lg' 
                                        : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}
                                `}>
                                    {React.cloneElement(item.icon, { 
                                        size: 18
                                    })}
                                </div>
                                <span className={`
                                    text-[8px] font-bold uppercase tracking-wider mt-1.5 transition-all
                                    ${isActive ? 'text-primary opacity-100' : 'text-slate-500 opacity-60'}
                                `}>
                                    {item.name}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                      layoutId="active-nav-dot"
                                      className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MobileBottomNav;
