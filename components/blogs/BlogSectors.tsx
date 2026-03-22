'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Terminal, TrendingUp, Lock, Zap, Search } from 'lucide-react';

interface BlogSectorsProps {
  lang: string;
  dict: any;
}

const BlogSectors: React.FC<BlogSectorsProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.BLOG_LISTING;

  const sectors = [
    { 
      Icon: Shield, 
      name: isAr ? 'قادة التكنولوجيا' : 'Tech Leaders & CIOs', 
      color: 'bg-blue-600' 
    },
    { 
      Icon: Terminal, 
      name: isAr ? 'المطورون والمهندسون' : 'Developers & Architects', 
      color: 'bg-cyan-500' 
    },
    { 
      Icon: TrendingUp, 
      name: isAr ? 'أصحاب الأعمال' : 'Business Strategy', 
      color: 'bg-indigo-600' 
    },
    { 
      Icon: Lock, 
      name: isAr ? 'محترفو الأمن' : 'Security Experts', 
      color: 'bg-blue-800' 
    },
    { 
      Icon: Zap, 
      name: isAr ? 'مكاملو الأنظمة' : 'System Integrators', 
      color: 'bg-sky-500' 
    },
    { 
      Icon: Search, 
      name: isAr ? 'محللو الصناعة' : 'Industry Analysts', 
      color: 'bg-blue-700' 
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-zinc-950" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0d6efd] text-[10px] font-bold uppercase tracking-widest mb-3">
              {isAr ? 'قطاعاتنا المستهدفة' : 'WHO WE WRITE FOR'}
            </div>
            <h2 className="font-syne text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
              {isAr ? 'رؤى مصممة لكل تخصص' : 'Tailored Insights for Every Role'}
            </h2>
            <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 text-sm md:text-base font-light leading-relaxed mb-6">
              {isAr 
                ? 'نحن نقدم محتوى متخصصًا يلبي الاحتياجات الفريدة للمحترفين في مختلف مجالات التكنولوجيا والأعمال.'
                : 'We provide specialized content that addresses the unique needs of professionals across various technology and business domains.'}
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-5 md:p-6 rounded-[1.5rem] ${sector.color} text-white shadow-lg shadow-blue-900/10 transition-all duration-300 flex flex-col items-center justify-center text-center group`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                  <sector.Icon className="w-5 h-5" />
                </div>
                <h4 className="font-syne font-bold text-white text-xs md:text-sm tracking-tight">{sector.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSectors;
