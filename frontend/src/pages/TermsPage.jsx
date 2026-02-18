import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, RefreshCcw, ShieldCheck, Users, Mail, ChevronRight } from 'lucide-react';

const TermsPage = () => {
    const sections = [
        {
            title: "1. ბილეთის შეძენა",
            icon: <Scale size={24} />,
            content: "ბილეთის შეძენა ხორციელდება საბანკო გადმორიცხვის გზით. მომხმარებელი ვალდებულია ატვირთოს სწორი და უტყუარი გადახდის ქვითარი."
        },
        {
            title: "2. ბილეთის დაბრუნება",
            icon: <RefreshCcw size={24} />,
            content: "შეძენილი ბილეთი დაბრუნებას არ ექვემდებარება, გარდა იმ შემთხვევისა, როდესაც ღონისძიება სრულად უქმდება ორგანიზატორის მიზეზით."
        },
        {
            title: "3. უსაფრთხოება",
            icon: <ShieldCheck size={24} />,
            content: "დასტურის კოდი არის კონფიდენციალური. მისი მესამე პირზე გადაცემის შემთხვევაში, ორგანიზატორი არ იღებს პასუხისმგებლობას ბილეთის გამოყენებაზე."
        },
        {
            title: "4. ასაკობრივი შეზღუდვა",
            icon: <Users size={24} />,
            content: "ღონისძიებაზე დაიშვებიან მხოლოდ 18+ ასაკის პირები. შესასვლელთან სავალდებულოა პირადობის მოწმობის წარდგენა."
        }
    ];

    return (
        <div className="pt-32 pb-20 ai-grid min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-16 text-center"
                >
                    <div className="flex justify-center mb-6 md:mb-8">
                        <div className="p-3 md:p-4 bg-accent-purple/10 rounded-2xl text-accent-purple shadow-premium">
                            <FileText size={40} className="md:w-12 md:h-12" />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-6xl font-black mb-4 md:mb-6 font-orbitron text-gradient uppercase tracking-tighter leading-[1.1]">წესები და პირობები</h1>
                    <p className="text-light-purple/60 text-sm md:text-lg font-medium">გთხოვთ ყურადღებით გაეცნოთ ღონისძიებაზე დასწრების წესებს</p>
                </motion.div>

                <div className="space-y-4 md:space-y-6">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 md:p-10 border-l-4 border-l-accent-purple group hover:bg-accent-purple/[0.02] transition-colors"
                        >
                            <div className="flex items-center space-x-4 md:space-x-6 mb-4 md:mb-6">
                                <div className="text-accent-purple/40 group-hover:text-accent-purple transition-colors flex-shrink-0">
                                    {section.icon}
                                </div>
                                <h2 className="text-lg md:text-2xl font-black text-white font-orbitron tracking-tight uppercase leading-tight">{section.title}</h2>
                            </div>
                            <p className="text-light-purple/70 leading-relaxed text-sm md:text-lg font-medium">{section.content}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 p-12 glass-card bg-accent-purple/5 text-center border-dashed border-accent-purple/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-button-gradient opacity-20"></div>
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-white/5 rounded-2xl text-light-purple">
                            <Mail size={32} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black mb-4 font-orbitron uppercase tracking-widest text-white">დამატებითი კითხვები?</h3>
                    <p className="text-light-purple/60 mb-10 max-w-md mx-auto font-medium">დაგვიკავშირდით სოციალურ ქსელებში ან ემაილზე:luka.gogilashvili.2@btu.edu.ge</p>
                    <a
                        href="mailto:luka.gogilashvili.2@btu.edu.ge"
                        className="inline-flex items-center space-x-3 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-premium"
                    >
                        <span>მოგვწერეთ ემაილზე</span>
                        <ChevronRight size={16} />
                    </a>
                    <p className="mt-8 text-white font-black tracking-widest text-sm">luka.gogilashvili.2@btu.edu.ge</p>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
