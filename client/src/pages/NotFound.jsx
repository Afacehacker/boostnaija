import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20 shadow-2xl">
                    <ShieldAlert size={48} />
                </div>
                <h1 className="text-7xl font-black mb-4 tracking-tighter">404</h1>
                <p className="text-2xl font-bold uppercase tracking-widest opacity-50 mb-8">Access Points Not Found</p>
                <p className={`max-w-md mx-auto mb-12 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    The node you are trying to reach does not exist or has been moved to a classified location.
                </p>
            </motion.div>

            <Link 
                to="/" 
                className="btn-primary py-4 px-10 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm"
            >
                <Home size={18} /> Return to Base
            </Link>
        </div>
    );
};

export default NotFound;
