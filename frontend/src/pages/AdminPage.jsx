import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    Ticket,
    CheckCircle,
    Clock,
    AlertCircle,
    Wallet,
    ExternalLink,
    ChevronRight,
    RefreshCw,
    Check
} from 'lucide-react';

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [ticketSettings, setTicketSettings] = useState({
        totalTickets: 500,
        price: 30,
        locationTitle: '',
        locationText: '',
        lineupTitle: '',
        lineupText: '',
        promoText: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/admin/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            setIsLoggedIn(true);
            fetchData();
        } catch (err) {
            alert('არასწორი მონაცემები');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setIsLoggedIn(false);
                return;
            }
            const [pRes, tRes] = await Promise.all([
                axios.get('/api/purchases', { headers: { 'x-auth-token': token } }),
                axios.get('/api/tickets')
            ]);
            setPurchases(pRes.data);
            if (tRes.data && Object.keys(tRes.data).length > 0) {
                setTicketSettings(prev => ({ ...prev, ...tRes.data }));
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('adminToken');
                setIsLoggedIn(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/tickets/update', ticketSettings, {
                headers: { 'x-auth-token': token }
            });
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
            fetchData(); // Refresh to get synced availableTickets
        } catch (err) {
            alert('შეცდომა განახლებისას');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsLoggedIn(true);
            fetchData();
        }
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 ai-grid px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 md:p-12 w-full max-w-md relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 blur-[50px] rounded-full"></div>
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-accent-purple/10 rounded-2xl text-accent-purple">
                            <Settings size={40} />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-10 text-center font-orbitron text-gradient uppercase tracking-widest">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-light-purple/40">მომხმარებელი</label>
                            <input
                                type="text"
                                className="w-full bg-deep-dark/60 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-light-purple/40">პაროლი</label>
                            <input
                                type="password"
                                className="w-full bg-deep-dark/60 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="w-full bg-button-gradient py-5 rounded-2xl font-black text-lg hover:shadow-premium transform active:scale-95 transition-all uppercase tracking-widest">შესვლა</button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 ai-grid min-h-screen">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="p-3 md:p-4 bg-accent-purple/10 rounded-xl md:rounded-2xl text-accent-purple">
                            <LayoutDashboard size={28} className="md:w-8 md:h-8" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-3xl md:text-5xl font-black text-gradient font-orbitron uppercase tracking-tighter line-height-1">Dashboard</h1>
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 rounded-lg text-light-purple/40 hover:text-white transition-colors"
                                    title="საიტის ნახვა"
                                >
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                            <p className="text-light-purple/40 font-black uppercase tracking-widest text-[10px] mt-2">ადმინ პანელი / Omnia Events</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }}
                        className="flex items-center space-x-2 text-red-500/60 font-black uppercase tracking-widest text-xs hover:text-red-500 transition-colors group"
                    >
                        <span>გამოსვლა</span>
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
                    {[
                        { label: 'ნაშთი', val: ticketSettings.availableTickets ?? 0, color: 'text-vibrant-purple', icon: <Ticket size={24} /> },
                        { label: 'გაყიდული', val: purchases.filter(p => p.status === 'confirmed').reduce((acc, p) => acc + (p.ticketQuantity || 0), 0), color: 'text-green-400', icon: <CheckCircle size={24} /> },
                        { label: 'მოლოდინში', val: purchases.filter(p => p.status === 'pending').reduce((acc, p) => acc + (p.ticketQuantity || 0), 0), color: 'text-yellow-400', icon: <Clock size={24} /> },
                        { label: 'შემოსავალი', val: `${purchases.reduce((acc, p) => acc + (p.status === 'confirmed' ? p.totalPrice : 0), 0)}₾`, color: 'text-gold', icon: <Wallet size={24} /> }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card bg-black/40 p-6 md:p-8 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-12 translate-x-12 rounded-full transition-transform group-hover:scale-150"></div>
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-light-purple/40">{stat.label}</p>
                                <div className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className={`text-3xl md:text-4xl font-black font-orbitron ${stat.color}`}>{stat.val}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card bg-black/40 p-6 md:p-10 mb-12 md:mb-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-purple"></div>
                    <div className="flex items-center space-x-4 mb-8 md:mb-10">
                        <Settings size={20} className="text-accent-purple" />
                        <h2 className="text-xl md:text-2xl font-black font-orbitron uppercase tracking-widest text-white">პარამეტრები</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 items-end relative z-10">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">ბილეთების რაოდენობა</label>
                            <input
                                type="number"
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold"
                                value={ticketSettings.totalTickets}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, totalTickets: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">ბილეთის ფასი (₾)</label>
                            <input
                                type="number"
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold"
                                value={ticketSettings.price}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">ლოკაციის სათაური</label>
                            <input
                                type="text"
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold"
                                value={ticketSettings.locationTitle || ''}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, locationTitle: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">ლოკაციის ტექსტი</label>
                            <textarea
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold min-h-[100px] resize-none"
                                value={ticketSettings.locationText || ''}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, locationText: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">ლაინაფის სათაური</label>
                            <input
                                type="text"
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold"
                                value={ticketSettings.lineupTitle || ''}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, lineupTitle: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">ლაინაფის ტექსტი</label>
                            <textarea
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold min-h-[100px] resize-none"
                                value={ticketSettings.lineupText || ''}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, lineupText: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-light-purple/40">პრომო ტექსტი (Get Ready სექცია)</label>
                            <textarea
                                className="w-full bg-deep-dark/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-accent-purple/50 transition-all font-bold min-h-[100px] resize-none"
                                value={ticketSettings.promoText || ''}
                                onChange={(e) => setTicketSettings({ ...ticketSettings, promoText: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={updateSettings}
                                disabled={loading}
                                className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transform active:scale-95 transition-all flex items-center justify-center space-x-2 ${updateSuccess
                                    ? 'bg-green-500 text-white'
                                    : 'bg-vibrant-purple hover:shadow-premium'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <RefreshCw size={18} className="animate-spin" />
                                ) : updateSuccess ? (
                                    <Check size={18} />
                                ) : (
                                    <RefreshCw size={18} />
                                )}
                                <span>{loading ? 'სინქრონიზაცია...' : updateSuccess ? 'განახლდა!' : 'განახლება'}</span>
                            </button>

                            {updateSuccess && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-green-400 font-bold text-xs uppercase tracking-widest"
                                >
                                    მონაცემები წარმატებით შეინახა
                                </motion.p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Purchases Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card overflow-hidden"
                >
                    <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01]">
                        <div className="flex items-center space-x-4">
                            <Users size={20} className="text-accent-purple" />
                            <h2 className="text-xl md:text-2xl font-black font-orbitron uppercase tracking-widest text-white">შეკვეთები</h2>
                        </div>
                        <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-light-purple/40 border border-white/5">{purchases.length} ჩანაწერი</span>
                    </div>
                    <div className="overflow-x-auto scrollbar-thin">
                        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                            <thead className="bg-deep-dark/40 text-light-purple/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="p-6 md:p-8">სახელი</th>
                                    <th className="p-6 md:p-8">ემაილი</th>
                                    <th className="p-6 md:p-8">სტატუსი</th>
                                    <th className="p-6 md:p-8">კოდი</th>
                                    <th className="p-6 md:p-8">ქვითარი</th>
                                    <th className="p-6 md:p-8">დრო</th>
                                    <th className="p-6 md:p-8 text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {purchases.map((purchase) => (
                                    <tr key={purchase._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6 md:p-8">
                                            <p className="text-white font-black text-base md:text-lg group-hover:text-accent-purple transition-colors truncate max-w-[150px]">{purchase.fullName}</p>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-light-purple/30 group-hover:text-light-purple/60 transition-colors">ID: {purchase.personalId}</span>
                                        </td>
                                        <td className="p-6 md:p-8 font-medium text-light-purple/70 text-sm">{purchase.email}</td>
                                        <td className="p-6 md:p-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center w-fit space-x-2 ${purchase.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                purchase.status === 'used' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                                    purchase.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {purchase.status === 'confirmed' ? <CheckCircle size={10} /> :
                                                    purchase.status === 'rejected' ? <AlertCircle size={10} /> :
                                                        purchase.status === 'used' ? <Check size={10} /> :
                                                            <Clock size={10} />}
                                                <span>
                                                    {purchase.status === 'confirmed' ? 'დადასტურებულია' :
                                                        purchase.status === 'used' ? 'გამოყენებულია' :
                                                            purchase.status === 'rejected' ? 'უარყოფილია' :
                                                                'მოლოდინში'}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="p-6 md:p-8">
                                            <span className="font-orbitron font-black text-accent-purple tracking-widest bg-accent-purple/5 px-4 py-2 rounded-xl border border-accent-purple/10 group-hover:bg-accent-purple/10 transition-all text-xs">
                                                {purchase.confirmationCode || '----'}
                                            </span>
                                        </td>
                                        <td className="p-6 md:p-8">
                                            <a href={purchase.receipt} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-light-purple/60 hover:text-white transition-colors group/link">
                                                <span>ნახვა</span>
                                                <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </td>
                                        <td className="p-6 md:p-8 text-[10px] font-bold text-light-purple/30 uppercase tracking-widest leading-tight">
                                            {new Date(purchase.createdAt).toLocaleDateString()}<br />
                                            {new Date(purchase.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-6 md:p-8 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {purchase.status !== 'confirmed' && (
                                                    <button
                                                        onClick={async () => {
                                                            const confirmMsg = purchase.status === 'rejected'
                                                                ? 'ამ ბილეთის სტატუსი უარყოფილია. ნამდვილად გსურთ ხელახლა დადასტურება? (სტოკი ისევ დაიკლებს)'
                                                                : 'დავადასტუროთ შეკვეთა და გავაგზავნოთ კოდი?';

                                                            if (window.confirm(confirmMsg)) {
                                                                try {
                                                                    const token = localStorage.getItem('adminToken');
                                                                    const res = await axios.post(`/api/admin/confirm/${purchase._id}`, {}, {
                                                                        headers: { 'x-auth-token': token }
                                                                    });
                                                                    fetchData();
                                                                    if (res.data.emailSent) {
                                                                        alert('დადასტურდა და მეილი გაიგზავნა!');
                                                                    } else {
                                                                        alert('დადასტურდა, თუმცა მეილის გაგზავნა ვერ მოხერხდა (ბილეთი მაინც აქტიურია)');
                                                                    }
                                                                } catch (err) {
                                                                    alert('შეცდომა დადასტურებისას');
                                                                }
                                                            }
                                                        }}
                                                        className="bg-green-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center space-x-2"
                                                        title="დადასტურება"
                                                    >
                                                        <Check size={14} />
                                                        <span>OK</span>
                                                    </button>
                                                )}
                                                {purchase.status !== 'rejected' && purchase.status !== 'used' && (
                                                    <button
                                                        onClick={async () => {
                                                            const rejectMsg = purchase.status === 'confirmed'
                                                                ? 'ეს ბილეთი უკვე დადასტურებულია. ნამდვილად გსურთ სტატუსის გაუქმება და სტოკში დაბრუნება?'
                                                                : 'ნამდვილად გსურთ შეკვეთის უარყოფა?';

                                                            if (window.confirm(rejectMsg)) {
                                                                try {
                                                                    const token = localStorage.getItem('adminToken');
                                                                    await axios.post(`/api/admin/reject/${purchase._id}`, {}, {
                                                                        headers: { 'x-auth-token': token }
                                                                    });
                                                                    fetchData();
                                                                    alert('შეკვეთა უარყოფილია (ბილეთი დაბრუნდა სტოკში)');
                                                                } catch (err) {
                                                                    alert('შეცდომა უარყოფისას');
                                                                }
                                                            }
                                                        }}
                                                        className="bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2"
                                                        title="უარყოფა"
                                                    >
                                                        <AlertCircle size={14} />
                                                        <span>NO</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 md:p-8 border-t border-white/5 bg-white/[0.01] text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-light-purple/20 italic">Omnia Admin System v2.0 - Secured with AI Protocol</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPage;
