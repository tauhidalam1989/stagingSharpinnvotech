'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Zap, Users } from 'lucide-react';

interface ServiceWhyProps {
  lang: string;
  dict: any;
}

const ServiceWhy: React.FC<ServiceWhyProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.SERVICE_LISTING;

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      title: s.WHY_ITEM_1_TITLE,
      desc: s.WHY_ITEM_1_DESC
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-500" />,
      title: s.WHY_ITEM_2_TITLE,
      desc: s.WHY_ITEM_2_DESC
    },
    {
      icon: <Award className="w-5 h-5 text-blue-500" />,
      title: s.WHY_ITEM_3_TITLE,
      desc: s.WHY_ITEM_3_DESC
    },
    {
      icon: <Users className="w-5 h-5 text-cyan-500" />,
      title: s.WHY_ITEM_4_TITLE,
      desc: s.WHY_ITEM_4_DESC
    }
  ];

  const stats = [
    { num: s.WHY_STAT_1_N, label: s.WHY_STAT_1_L, color: 'bg-blue-600' },
    { num: s.WHY_STAT_2_N, label: s.WHY_STAT_2_L, color: 'bg-cyan-500' },
    { num: s.WHY_STAT_3_N, label: s.WHY_STAT_3_L, color: 'bg-indigo-600' },
    { num: s.WHY_STAT_4_N, label: s.WHY_STAT_4_L, color: 'bg-blue-800' }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#eff6ff]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
          {/* Content side */}
          <div className="lg:w-1/2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-[#0d6efd] text-xs font-bold uppercase tracking-widest mb-4">
              {s.WHY_BADGE}
            </div>
            <h2 className="font-syne text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
              {s.WHY_TITLE}
            </h2>
            <p className="font-dm-sans text-zinc-500 text-lg font-light leading-relaxed mb-12">
              {s.WHY_SUB}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-zinc-900 mb-2">{feature.title}</h4>
                    <p className="font-dm-sans text-xs text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats side */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-3xl ${stat.color} text-white shadow-xl shadow-blue-900/10 transition-all duration-300 group`}
                >
                  <div className="text-3xl md:text-4xl font-bold font-sons-serif mb-2 group-hover:scale-110 transition-transform duration-500 origin-left">
                    {stat.num}
                  </div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-80">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceWhy;
