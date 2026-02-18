import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'მთავარი', path: '/' },
        { name: 'წესები', path: '/terms' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-deep-dark/60 backdrop-blur-xl border-b border-white/5"
        >
            <div className="container mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
                <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-gradient font-orbitron">
                    OMNIA
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-sm font-semibold text-light-purple/70 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/purchase" className="bg-button-gradient shadow-premium px-8 py-2.5 rounded-full text-sm font-black hover:scale-105 transition-all active:scale-95">
                        ბილეთები
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-light-purple p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/5 bg-deep-dark/95 backdrop-blur-2xl overflow-hidden"
                    >
                        <div className="flex flex-col p-8 space-y-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-black text-light-purple/70 hover:text-white transition-colors uppercase tracking-[0.2em]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/purchase"
                                onClick={() => setIsOpen(false)}
                                className="bg-button-gradient shadow-premium w-full py-5 rounded-2xl text-center text-sm font-black uppercase tracking-[0.2em]"
                            >
                                ბილეთები
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
