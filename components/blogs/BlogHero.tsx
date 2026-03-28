'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Globe, Code, Zap, Layers, Cpu, Newspaper, Terminal } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { Locale } from '@/lib/get-dictionary';

interface BlogHeroProps {
  lang: string;
  dict: any;
  categories: string[];
  categoriesAr: string[];
}

const BlogHero: React.FC<BlogHeroProps> = ({ lang, dict, categories, categoriesAr }) => {
  const router = useRouter();
  const isAr = lang === 'ar';
  const s = dict.BLOG_LISTING;

  const currentCategories = isAr ? categoriesAr : categories;

  const getCategoryIcon = (name: string, size = "w-4 h-4") => {
    const n = name.toLocaleLowerCase();
    if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) return <Shield className={size} />;
    if (n.includes('network') || n.includes('infra') || n.includes('شبكة')) return <Globe className={size} />;
    if (n.includes('software') || n.includes('app') || n.includes('برمج') || n.includes('تطوير')) return <Code className={size} />;
    if (n.includes('ai') || n.includes('intelligence') || n.includes('ذكاء')) return <Cpu className={size} />;
    if (n.includes('news') || n.includes('update') || n.includes('أخبار')) return <Newspaper className={size} />;
    if (n.includes('tech') || n.includes('تقني')) return <Terminal className={size} />;
    return <Layers className={size} />;
  };

  const getCategoryColorClass = (name: string) => {
    const n = name.toLocaleLowerCase();
    if (n.includes('cyber') || n.includes('security')) return 'text-blue-400';
    if (n.includes('ai') || n.includes('intelligence')) return 'text-purple-400';
    if (n.includes('software') || n.includes('app')) return 'text-indigo-400';
    if (n.includes('news') || n.includes('update')) return 'text-emerald-400';
    return 'text-blue-400';
  };

  return (
    <section className="relative bg-[#0d6efd] pt-32 pb-20 md:pt-30 md:pb-32 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      ></div>

      {/* Animated Orbs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* <Breadcrumbs 
          lang={lang as Locale} 
          dict={dict} 
          items={[{ label: isAr ? 'المدونة' : 'Blog' }]} 
          listingPage={true}
      /> */}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Hero Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-white/30 bg-white/10 text-blue-50 text-[11px] font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            {s.HERO_PILL}
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-8"
          >
            {isAr ? (
              <>
                تحليلاتنا وأخبارنا<br />
                <span className="text-cyan-300">نواكب أحدث التقنيات</span>
              </>
            ) : (
              <>
                Our Insights & News<br />
                <span className="text-cyan-300 text-stroke-thin">Exploring the Tech Frontier</span>
              </>
            )}
          </motion.h1>

          {/* Hero Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-dm-sans text-base md:text-base text-white/70 font-light leading-relaxed max-w-2xl !text-white mb-16"
          >
            {s.HERO_DESC}
          </motion.p>

          {/* Categories Grid (Interactive Quick Filter) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-1 max-w-4xl"
          >
            {(currentCategories.length > 0 ? currentCategories.slice(0, 4) :
              (isAr
                ? ['الأمن السيبراني', 'الذكاء الاصطناعي', 'تطوير البرمجيات', 'أخبار التكنولوجيا']
                : ['Cybersecurity', 'AI & Innovation', 'Software Dev', 'Tech News'])
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => router.push(`/${lang}/blogs?category=${cat}`)}
                className="group p-6 rounded-3xl bg-[#060E24] border border-white/10 hover:bg-[#060E24] hover:border-white/20 transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="mb-4 p-3 w-fit bg-white/5 rounded-xl group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                  {getCategoryIcon(cat, `w-6 h-6 ${getCategoryColorClass(cat)}`)}
                </div>
                <div className="text-[10px] md:text-xs font-syne font-bold text-white/50 leading-tight group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
                  {cat}
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
