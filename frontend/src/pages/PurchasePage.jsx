import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    User,
    CreditCard,
    Upload,
    CheckCircle,
    Zap,
    Copy,
    FileText,
    ChevronRight,
    ChevronLeft,
    Check,
    AlertCircle
} from 'lucide-react';

const PurchasePage = () => {
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        personalId: '',
        email: '',
        ticketQuantity: 1,
        paymentMethod: 'BOG',
        receipt: null
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [copied, setCopied] = useState(false);
    const [ticketSettings, setTicketSettings] = useState(null);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('omniaPurchaseData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({
                    ...prev,
                    fullName: parsed.fullName || '',
                    personalId: parsed.personalId || '',
                    email: parsed.email || '',
                    ticketQuantity: parsed.ticketQuantity || 1,
                    paymentMethod: parsed.paymentMethod || 'BOG'
                }));
                // If they had data, maybe stay on step 1 but at least it's there
            } catch (err) {
                console.error("Error parsing saved data:", err);
            }
        }
    }, []);

    // Fetch ticket settings (stock)
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/purchases/settings');
                setTicketSettings(response.data);
            } catch (err) {
                console.error("Error fetching settings:", err);
            }
        };
        fetchSettings();
    }, []);

    // Save data to localStorage when formData changes (excluding receipt)
    useEffect(() => {
        const dataToSave = {
            fullName: formData.fullName,
            personalId: formData.personalId,
            email: formData.email,
            ticketQuantity: formData.ticketQuantity,
            paymentMethod: formData.paymentMethod
        };
        localStorage.setItem('omniaPurchaseData', JSON.stringify(dataToSave));
    }, [formData.fullName, formData.personalId, formData.email, formData.ticketQuantity, formData.paymentMethod]);

    const steps = [
        { name: "ინფო", icon: <User size={18} /> },
        { name: "გადახდა", icon: <CreditCard size={18} /> },
        { name: "ატვირთვა", icon: <Upload size={18} /> },
        { name: "დასტური", icon: <CheckCircle size={18} /> }
    ];

    const validateStep1 = () => {
        const newErrors = {};
        if (formData.fullName.trim().length < 5) newErrors.fullName = 'სახელი და გვარი უნდა იყოს მინიმუმ 5 ასო';
        if (!/^\d{11}$/.test(formData.personalId)) newErrors.personalId = 'პირადი ნომერი უნდა იყოს ზუსტად 11 ციფრი';
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'გთხოვთ მიუთითოთ ვალიდური ემაილი';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        setStep(s => s + 1);
    };
    const handleBack = () => setStep(s => s - 1);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            await axios.post('/api/purchases', data);
            setSuccess(true);
            setStep(4);
            // Clear saved data on success
            localStorage.removeItem('omniaPurchaseData');
        } catch (err) {
            alert('დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 md:pt-32 pb-12 md:pb-20 ai-grid min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                {/* Progress Bar */}
                <div className="mb-10 md:mb-16 flex justify-between relative">
                    <div className="absolute top-5 md:top-6 left-0 w-full h-0.5 bg-white/5 -z-10"></div>
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black mb-2 md:mb-3 transition-all duration-500 scale-100 ${step > i + 1 ? 'bg-green-500 text-black' : step === i + 1 ? 'bg-accent-purple shadow-premium scale-110' : 'bg-royal-purple'
                                }`}>
                                {step > i + 1 ? <Check size={16} className="md:w-6 md:h-6" /> : <span className="text-xs md:text-sm">{i + 1}</span>}
                            </div>
                            <span className={`text-[8px] md:text-[10px] font-black tracking-widest uppercase ${step === i + 1 ? 'text-accent-purple' : 'text-light-purple/40'}`}>{s.name}</span>
                        </div>
                    ))}
                </div>

                <div className="glass-card p-6 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-accent-purple/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="mb-6 md:mb-8">
                                    <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                                        <div className="p-2 md:p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
                                            <User size={20} className="md:w-6 md:h-6" />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black font-orbitron uppercase tracking-tighter">პერსონალური ინფო</h2>
                                    </div>
                                    <p className="text-light-purple/40 font-bold uppercase tracking-widest text-[10px]">შეავსეთ თქვენი მონაცემები ყურიდებით</p>
                                </div>

                                {ticketSettings && ticketSettings.availableTickets < 30 && ticketSettings.availableTickets > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-center space-x-3 text-yellow-500"
                                    >
                                        <Zap size={18} className="animate-pulse" />
                                        <p className="text-xs font-black uppercase tracking-widest">ბილეთები იწურება! დარჩენილია მხოლოდ {ticketSettings.availableTickets}</p>
                                    </motion.div>
                                )}

                                {ticketSettings && ticketSettings.availableTickets === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="inline-flex p-6 bg-red-500/10 text-red-500 rounded-3xl mb-6">
                                            <AlertCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black font-orbitron text-red-500 uppercase tracking-tighter mb-2">ბილეთები ამოწურულია</h3>
                                        <p className="text-light-purple/40 text-[10px] font-bold uppercase tracking-widest">სამწუხაროდ ყველა ბილეთი გაყიდულია</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4 md:space-y-6">
                                            <div>
                                                <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 md:mb-3 text-light-purple/60">სახელი და გვარი</label>
                                                <input
                                                    type="text"
                                                    className={`w-full bg-deep-dark/40 border ${errors.fullName ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-3 md:p-4 focus:border-accent-purple/50 outline-none transition-all font-medium placeholder:opacity-20 text-sm md:text-base`}
                                                    placeholder="მაგ: გიორგი ბერიძე"
                                                    value={formData.fullName}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, fullName: e.target.value });
                                                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                                                    }}
                                                />
                                                {errors.fullName && (
                                                    <div className="flex items-center space-x-2 mt-2 text-red-500">
                                                        <AlertCircle size={10} />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest">{errors.fullName}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 md:mb-3 text-light-purple/60">პირადი ნომერი (11 ციფრი)</label>
                                                <input
                                                    type="text"
                                                    maxLength={11}
                                                    className={`w-full bg-deep-dark/40 border ${errors.personalId ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-3 md:p-4 focus:border-accent-purple/50 outline-none transition-all font-medium placeholder:opacity-20 text-sm md:text-base`}
                                                    placeholder="11 ნიშნა კოდი"
                                                    value={formData.personalId}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setFormData({ ...formData, personalId: val });
                                                        if (errors.personalId) setErrors({ ...errors, personalId: null });
                                                    }}
                                                />
                                                {errors.personalId && (
                                                    <div className="flex items-center space-x-2 mt-2 text-red-500">
                                                        <AlertCircle size={10} />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest">{errors.personalId}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 md:mb-3 text-light-purple/60">ემაილი</label>
                                                <input
                                                    type="email"
                                                    className={`w-full bg-deep-dark/40 border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-3 md:p-4 focus:border-accent-purple/50 outline-none transition-all font-medium placeholder:opacity-20 text-sm md:text-base`}
                                                    placeholder="email@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, email: e.target.value });
                                                        if (errors.email) setErrors({ ...errors, email: null });
                                                    }}
                                                />
                                                {errors.email && (
                                                    <div className="flex items-center space-x-2 mt-2 text-red-500">
                                                        <AlertCircle size={10} />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest">{errors.email}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleNext}
                                            className="w-full bg-button-gradient py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:shadow-premium transition-all transform active:scale-95 flex items-center justify-center space-x-3 group mt-8"
                                        >
                                            <span>გაგრძელება</span>
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="mb-6 md:mb-8">
                                    <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                                        <div className="p-2 md:p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
                                            <CreditCard size={20} className="md:w-6 md:h-6" />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black font-orbitron uppercase tracking-tighter">გადახდის მეთოდი</h2>
                                    </div>
                                    <p className="text-light-purple/40 font-bold uppercase tracking-widest text-[10px]">აირჩიეთ სასურველი ბანკი</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <button
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'BOG' })}
                                        className={`p-6 md:p-8 rounded-2xl border-2 transition-all flex flex-col items-center ${formData.paymentMethod === 'BOG' ? 'border-accent-purple bg-accent-purple/10 shadow-premium scale-[1.02]' : 'border-white/5 bg-deep-dark/40 hover:border-white/10'}`}
                                    >
                                        <span className="text-2xl md:text-3xl font-black font-orbitron block mb-1 md:mb-2 tracking-tighter">BOG</span>
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">საქართველოს ბანკი</p>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'TBC' })}
                                        className={`p-6 md:p-8 rounded-2xl border-2 transition-all flex flex-col items-center ${formData.paymentMethod === 'TBC' ? 'border-accent-purple bg-accent-purple/10 shadow-premium scale-[1.02]' : 'border-white/5 bg-deep-dark/40 hover:border-white/10'}`}
                                    >
                                        <span className="text-2xl md:text-3xl font-black font-orbitron block mb-1 md:mb-2 tracking-tighter">TBC</span>
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">თიბისი ბანკი</p>
                                    </button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-accent-purple/10 border border-accent-purple/30 p-6 rounded-3xl text-center mb-8 shadow-[0_0_30px_rgba(157,78,221,0.1)]"
                                >
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-purple mb-2">გადასახდელი თანხა</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="text-4xl md:text-6xl font-black font-orbitron text-white">
                                            {(ticketSettings?.price || 30) * formData.ticketQuantity}
                                        </span>
                                        <span className="text-2xl md:text-3xl font-black text-accent-purple">₾</span>
                                    </div>
                                    <p className="text-[8px] md:text-[10px] font-bold text-light-purple/40 mt-3 uppercase tracking-widest">
                                        {formData.ticketQuantity} ბილეთი × {ticketSettings?.price || 30}₾
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-deep-dark/60 p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
                                >
                                    <div className="relative z-10">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-accent-purple mb-4">გადმორიცხეთ შემდეგ ანგარიშზე:</p>
                                        <div className="flex items-center justify-between space-x-2 md:space-x-4">
                                            <p className="font-orbitron text-[11px] sm:text-sm md:text-xl text-white tracking-normal md:tracking-widest break-all">
                                                {formData.paymentMethod === 'BOG' ? 'GE81BG0000000534065444' : 'GE74TB7077645064300066'}
                                            </p>
                                            <button
                                                onClick={() => handleCopy(formData.paymentMethod === 'BOG' ? 'GE81BG0000000534065444' : 'GE74TB7077645064300066')}
                                                className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex-shrink-0 ${copied ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/5 text-light-purple hover:text-white hover:bg-white/10'}`}
                                            >
                                                {copied ? <Check size={16} className="md:w-5 md:h-5" /> : <Copy size={16} className="md:w-5 md:h-5" />}
                                            </button>
                                        </div>
                                        <div className="mt-4 md:mt-6 flex items-center space-x-2">
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-light-purple/40">მიმღები:</span>
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">Nika Jebashvili</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-6">
                                    <button onClick={handleBack} className="order-2 md:order-1 flex-1 bg-royal-purple/50 border border-white/5 py-4 md:py-5 rounded-2xl font-black tracking-widest uppercase text-[10px] flex items-center justify-center space-x-2 hover:bg-royal-purple transition-all active:scale-95">
                                        <ChevronLeft size={16} />
                                        <span>უკან</span>
                                    </button>
                                    <button onClick={handleNext} className="order-1 md:order-2 flex-[2] bg-button-gradient py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:shadow-premium transition-all transform active:scale-95 flex items-center justify-center space-x-3 group">
                                        <span>გაგრძელება</span>
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="mb-6 md:mb-8">
                                    <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                                        <div className="p-2 md:p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
                                            <Upload size={20} className="md:w-6 md:h-6" />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black font-orbitron uppercase tracking-tighter">ქვითრის ატვირთვა</h2>
                                    </div>
                                    <p className="text-light-purple/40 font-bold uppercase tracking-widest text-[10px]">გთხოვთ ატვირთოთ გადახდის დამადასტურებელი დოკუმენტი</p>
                                </div>

                                <div
                                    onClick={handleUploadClick}
                                    className={`group border-2 border-dashed ${errors.receipt ? 'border-red-500/50' : 'border-white/5'} rounded-3xl p-8 md:p-16 text-center hover:border-accent-purple/30 bg-deep-dark/20 transition-all cursor-pointer relative overflow-hidden`}
                                >
                                    <div className="absolute inset-0 bg-accent-purple/0 group-hover:bg-accent-purple/5 transition-all"></div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && file.size > 5 * 1024 * 1024) {
                                                setErrors({ ...errors, receipt: 'ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს' });
                                                return;
                                            }
                                            setFormData({ ...formData, receipt: file });
                                            setErrors({ ...errors, receipt: null });
                                        }}
                                    />
                                    {formData.receipt ? (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 text-green-500 rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                                                <Check size={32} className="md:w-10 md:h-10" />
                                            </div>
                                            <span className="text-white font-black tracking-widest uppercase text-[10px] break-all px-4">{formData.receipt.name}</span>
                                        </div>
                                    ) : (
                                        <div className="relative z-10">
                                            <div className="flex justify-center mb-6 md:mb-8">
                                                <div className="p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-3xl text-light-purple/20 group-hover:text-accent-purple group-hover:bg-accent-purple/10 transition-all group-hover:scale-110">
                                                    <FileText size={40} className="md:w-14 md:h-14" />
                                                </div>
                                            </div>
                                            <p className="text-light-purple/60 font-black uppercase tracking-widest text-[10px] mb-2">დააწკაპუნეთ ასარჩევად</p>
                                            <p className="text-white/20 font-black uppercase tracking-widest text-[8px] md:text-[10px]">MAX FILE SIZE: 5MB</p>
                                        </div>
                                    )}
                                </div>
                                {errors.receipt && (
                                    <div className="flex items-center justify-center space-x-2 text-red-500 mt-4">
                                        <AlertCircle size={12} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{errors.receipt}</p>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-6">
                                    <button onClick={handleBack} className="order-2 md:order-1 flex-1 bg-royal-purple/50 border border-white/5 py-4 md:py-5 rounded-2xl font-black tracking-widest uppercase text-[10px] flex items-center justify-center space-x-2 hover:bg-royal-purple transition-all active:scale-95">
                                        <ChevronLeft size={16} />
                                        <span>უკან</span>
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.receipt || loading}
                                        className="order-1 md:order-2 flex-[2] bg-button-gradient py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:shadow-premium disabled:opacity-30 transform active:scale-95 transition-all flex items-center justify-center space-x-2 group"
                                    >
                                        {loading ? <span className="text-sm">იშვება...</span> : (
                                            <>
                                                <span>დასრულება</span>
                                                <Zap size={18} className="fill-white group-hover:scale-125 transition-transform md:w-5 md:h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10 md:py-16"
                            >
                                <div className="inline-flex w-24 h-24 md:w-32 md:h-32 bg-accent-purple/10 text-accent-purple rounded-[2rem] md:rounded-[2.5rem] items-center justify-center mb-8 md:mb-12 shadow-premium relative">
                                    <div className="absolute inset-0 bg-accent-purple/5 animate-ping rounded-full opacity-20"></div>
                                    <Zap size={40} className="md:w-14 md:h-14 fill-accent-purple relative z-10" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 font-orbitron text-gradient uppercase tracking-tighter">წარმატებულია!</h2>
                                <p className="text-light-purple/60 mb-8 md:mb-12 max-w-sm mx-auto font-medium leading-relaxed text-sm md:text-base">
                                    თქვენი მოთხოვნა მიღებულია. ადმინისტრაცია გადაამოწმებს ქვითარს და დასტურის კოდს გამოგიგზავნით მეილზე: <br />
                                    <span className="text-white font-black text-base md:text-lg block mt-2 underline decoration-accent-purple decoration-2 underline-offset-4 break-all px-4">{formData.email}</span>
                                </p>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="bg-white text-black px-10 md:px-16 py-4 md:py-6 rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] md:text-xs hover:scale-105 transition-all active:scale-95 flex items-center justify-center mx-auto space-x-3 md:space-x-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                    <span>მთავარზე დაბრუნება</span>
                                    <ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PurchasePage;
