import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Search, CheckCircle, Clock } from 'lucide-react';

const SecurityPage = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.get(`/api/security/verify/${code}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'კოდი ვერ მოიძებნა');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsUsed = async () => {
        try {
            await axios.post(`/api/security/use/${code}`);
            setResult({ ...result, status: 'used' });
        } catch (err) {
            alert(err.response?.data?.message || 'შეცდომა სტატუსის განახლებისას');
        }
    };

    return (
        <div className="pt-24 md:pt-32 pb-12 md:pb-20 ai-grid min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 md:p-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-button-gradient"></div>
                    <div className="mb-8 md:mb-12">
                        <div className="flex justify-center mb-4 md:mb-6">
                            <div className="p-3 md:p-4 bg-accent-purple/10 rounded-xl md:rounded-2xl text-accent-purple shadow-premium">
                                <Lock size={32} className="md:w-12 md:h-12" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 font-orbitron text-gradient uppercase tracking-tighter">ბილეთის ვერიფიკაცია</h1>
                        <p className="text-light-purple/40 font-black uppercase tracking-widest text-[8px] md:text-[10px]">Security Protocol @e0xv / Scan Confirmation Code</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6 md:space-y-8 relative z-10">
                        <div className="relative group">
                            <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-light-purple/20 group-focus-within:text-accent-purple transition-colors">
                                <Search size={20} className="md:w-6 md:h-6" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-deep-dark/60 border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 pl-12 md:pl-16 text-center text-xl md:text-3xl font-orbitron font-black uppercase tracking-widest text-accent-purple outline-none focus:border-accent-purple/30 transition-all placeholder:opacity-10"
                                placeholder="ENTER CODE"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-button-gradient py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:shadow-premium transform active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center space-x-3"
                        >
                            <ShieldCheck size={20} className="md:w-6 md:h-6" />
                            <span>{loading ? 'მოწმდება...' : 'შემოწმება'}</span>
                        </button>
                    </form>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-8 md:mt-10 p-4 md:p-6 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center space-x-2"
                            >
                                <Lock size={12} className="opacity-50 md:w-[14px] md:h-[14px]" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-10 md:mt-12 space-y-6 md:space-y-8 text-left"
                            >
                                <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 ${result.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-light-purple/40 mb-2 underline decoration-accent-purple decoration-2 underline-offset-4">მფლობელი</p>
                                            <h3 className="text-2xl md:text-3xl font-black font-orbitron break-all">{result.fullName}</h3>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 shrink-0 ${result.status === 'confirmed' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-500 text-white'}`}>
                                            {result.status === 'confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            <span>{result.status === 'confirmed' ? 'აქტიური' : 'გამოყენებული'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8 border-t border-white/5 pt-6 md:pt-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-light-purple/40 mb-1">ბილეთები</p>
                                            <p className="text-xl md:text-2xl font-black font-orbitron text-white">{result.ticketQuantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-light-purple/40 mb-1">პირადი ნომერი</p>
                                            <p className="text-xl md:text-2xl font-black font-orbitron text-white">{result.personalId}</p>
                                        </div>
                                    </div>

                                    {result.status === 'confirmed' && (
                                        <button
                                            onClick={handleMarkAsUsed}
                                            className="w-full bg-white text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:scale-105 transition-all flex items-center justify-center space-x-2 shadow-premium"
                                        >
                                            <CheckCircle size={16} />
                                            <span>გამოყენებულად მონიშვნა [CONFIRM ENTRY]</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default SecurityPage;
