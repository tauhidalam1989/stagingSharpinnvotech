'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, UserCheck, Video, CheckCircle2, ArrowRight } from 'lucide-react';

interface CareerProcessProps {
  lang: string;
  dict: any;
}

const CareerProcess: React.FC<CareerProcessProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.career;
  const p = s.process_steps;

  const steps = [
    {
      title: p.step1_title,
      desc: p.step1_desc,
      icon: <FileText className="w-8 h-8" />,
      color: 'blue'
    },
    {
      title: p.step2_title,
      desc: p.step2_desc,
      icon: <Search className="w-8 h-8" />,
      color: 'purple'
    },
    {
      title: p.step3_title,
      desc: p.step3_desc,
      icon: <UserCheck className="w-8 h-8" />,
      color: 'indigo'
    },
    {
      title: p.step4_title,
      desc: p.step4_desc,
      icon: <Video className="w-8 h-8" />,
      color: 'cyan'
    },
    {
      title: p.step5_title,
      desc: p.step5_desc,
      icon: <CheckCircle2 className="w-8 h-8" />,
      color: 'emerald'
    }
  ];

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white';
            case 'purple': return 'bg-purple-500/10 text-purple-500 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white';
            case 'indigo': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white';
            case 'cyan': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white';
            case 'emerald': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 group-hover:bg-zinc-500 group-hover:text-white';
        }
    };

    return (
        <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <ArrowRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
                        {s.process_title}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-syne font-bold mb-6 text-zinc-900 dark:text-white"
                    >
                        {s.process_subtitle}
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[4.5rem] left-10 right-10 h-1 bg-zinc-100 dark:bg-zinc-800/50 -z-0">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="h-full bg-blue-600/30"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative flex flex-col items-center group"
                            >
                                {/* Step Number (Badge) */}
                                <div className="absolute top-4 right-4 w-7 h-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg z-20">
                                    {index + 1}
                                </div>

                                {/* Main Card Container */}
                                <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] p-8 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:bg-white dark:group-hover:bg-zinc-900 flex flex-col items-center text-center h-full">
                                    {/* Step Icon */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-sm mb-8 ${getColorClasses(step.color)} group-hover:rotate-[15deg]`}>
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-syne font-bold mb-4 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-dm-sans">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CareerProcess;
