import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Add timestamp to prevent caching
                const res = await axios.get(`/api/tickets?t=${new Date().getTime()}`);
                setSettings(res.data);
            } catch (err) {
                console.error("Error fetching settings:", err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="relative min-h-screen ai-grid overflow-x-hidden">
            {/* Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-accent-purple/20 blur-[100px] md:blur-[150px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-vibrant-purple/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none"></div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-6 md:mb-8"
                    >
                        <span className="inline-block py-1 pr-4 pl-4 rounded-full border border-accent-purple/30 bg-accent-purple/10 text-accent-purple text-[10px] md:text-xs font-black tracking-widest uppercase mb-4 md:mb-6">
                            Exclusive Event 2026
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl sm:text-7xl md:text-9xl font-black mb-6 md:mb-8 tracking-tighter font-orbitron leading-[1.1]"
                    >
                        OMNIA <br />
                        <span className="text-gradient">AFTER LECTURE</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-light-purple/60 mb-10 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        აღმოაჩინე გართობის ახალი განზომილება. 2026 წლის ყველაზე ექსკლუზიური ღამე გელოდება.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                    >
                        <Link
                            to="/purchase"
                            className="group relative bg-button-gradient w-full sm:w-auto px-12 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:shadow-premium transition-all duration-500 overflow-hidden text-center"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                            <span className="relative uppercase tracking-widest text-sm md:text-base">შეიძინე ბილეთი</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-light-purple/30 hidden md:block"
                >
                    <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-current rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* Info Section - Bento Grid */}
            <section className="py-20 md:py-32 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bento-card col-span-1 md:col-span-2 group min-h-[220px] md:min-h-0 p-8 md:p-12"
                        >
                            <div className="absolute top-0 right-0 p-6 md:p-8 text-6xl md:text-8xl opacity-5 font-black group-hover:opacity-10 transition-opacity">01</div>
                            <h3 className="text-xl md:text-3xl font-black mb-4">
                                {settings?.locationTitle || 'ლოკაცია და დრო'}
                            </h3>
                            <p className="text-light-purple/60 text-sm md:text-lg whitespace-pre-line leading-relaxed">
                                {settings?.locationText || 'თბილისი, ექსკლუზიური ტერიტორია. \n24 მაისი, 22:00-დან გვიანობამდე.'}
                            </p>
                            <div className="mt-8 md:mt-10 h-1 w-20 bg-accent-purple rounded-full"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bento-card group min-h-[220px] md:min-h-0 p-8 md:p-12"
                        >
                            <div className="absolute top-0 right-0 p-6 md:p-8 text-6xl md:text-8xl opacity-5 font-black group-hover:opacity-10 transition-opacity">02</div>
                            <h3 className="text-xl md:text-3xl font-black mb-4">
                                {settings?.lineupTitle || 'ლაინაფი'}
                            </h3>
                            <p className="text-light-purple/60 text-sm md:text-lg whitespace-pre-line leading-relaxed">
                                {settings?.lineupText || 'საუკეთესო DJ-ები და დავიწყარი ვიზუალური ეფექტები.'}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bento-card md:col-span-3 text-center py-16 md:py-20 bg-accent-purple/5 border-accent-purple/20"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 font-orbitron leading-tight">GET READY FOR <br className="sm:hidden" /> <span className="text-gradient uppercase">OMNIA</span></h2>
                            <p className="text-light-purple/60 max-w-xl mx-auto text-sm md:text-base px-4 whitespace-pre-line">
                                {settings?.promoText || 'ბილეთების რაოდენობა მკაცრად შეზღუდულია. იჩქარე და დაიკავე ადგილი წლის მთავარ მოვლენაზე.'}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
