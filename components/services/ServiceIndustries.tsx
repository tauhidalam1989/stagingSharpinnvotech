'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingCart, Stethoscope, Landmark, GraduationCap, Factory } from 'lucide-react';

interface ServiceIndustriesProps {
  lang: string;
  dict: any;
}

const ServiceIndustries: React.FC<ServiceIndustriesProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.SERVICE_LISTING;

  const industries = [
    { icon: <Landmark className="w-8 h-8" />, name: isAr ? 'الحكومة' : 'Government', color: 'bg-blue-600' },
    { icon: <Building2 className="w-8 h-8" />, name: isAr ? 'المؤسسات' : 'Enterprise', color: 'bg-cyan-500' },
    { icon: <Stethoscope className="w-8 h-8" />, name: isAr ? 'الرعاية الصحية' : 'Healthcare', color: 'bg-indigo-600' },
    { icon: <ShoppingCart className="w-8 h-8" />, name: isAr ? 'التجزئة' : 'Retail', color: 'bg-blue-800' },
    { icon: <GraduationCap className="w-8 h-8" />, name: isAr ? 'التعليم' : 'Education', color: 'bg-sky-500' },
    { icon: <Factory className="w-8 h-8" />, name: isAr ? 'التصنيع' : 'Manufacturing', color: 'bg-blue-700' }
  ];

  return (
    <section className="py-24 md:py-32 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#0d6efd] text-xs font-bold uppercase tracking-widest mb-4">
              {s.IND_BADGE}
            </div>
            <h2 className="font-syne text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
              {s.IND_TITLE}
            </h2>
            <p className="font-dm-sans text-zinc-500 text-lg font-light leading-relaxed mb-8">
              {s.IND_SUB}
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-10 rounded-[2.5rem] ${ind.color} text-white shadow-xl shadow-blue-900/10 transition-all duration-300 flex flex-col items-center justify-center text-center group`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                  {ind.icon}
                </div>
                <h4 className="font-syne font-bold text-white text-lg tracking-tight">{ind.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceIndustries;
