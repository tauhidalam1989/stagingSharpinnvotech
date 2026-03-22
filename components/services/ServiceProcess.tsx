'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Terminal, Headphones } from 'lucide-react';

interface ServiceProcessProps {
  lang: string;
  dict: any;
}

const ServiceProcess: React.FC<ServiceProcessProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.SERVICE_LISTING;

  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: s.STEP_1_TITLE,
      desc: s.STEP_1_DESC,
      color: 'bg-blue-600'
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: s.STEP_2_TITLE,
      desc: s.STEP_2_DESC,
      color: 'bg-cyan-500'
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: s.STEP_3_TITLE,
      desc: s.STEP_3_DESC,
      color: 'bg-indigo-600'
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: s.STEP_4_TITLE,
      desc: s.STEP_4_DESC,
      color: 'bg-blue-800'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#eff6ff]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-[#0d6efd] text-xs font-bold uppercase tracking-widest mb-4">
            {s.PROCESS_BADGE}
          </div>
          <h2 className="font-syne text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
            {s.PROCESS_TITLE}
          </h2>
          <p className="font-dm-sans text-zinc-500 text-lg font-light leading-relaxed">
            {s.PROCESS_SUB}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) - Adjusted for new background */}
          <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-[1px] bg-blue-200 -z-0 opacity-50"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-8 flex justify-center">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`w-28 h-28 rounded-[2rem] ${step.color} shadow-xl shadow-blue-900/10 flex items-center justify-center text-white transition-all duration-300 relative z-10`}
                >
                  {step.icon}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white border-4 border-[#eff6ff] shadow-sm flex items-center justify-center text-xs font-black text-zinc-900">
                    0{index + 1}
                  </div>
                </motion.div>
              </div>
              <h3 className="font-syne text-xl font-bold text-zinc-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 px-4">
                {step.title}
              </h3>
              <p className="font-dm-sans text-zinc-500 text-sm leading-relaxed font-light px-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceProcess;
