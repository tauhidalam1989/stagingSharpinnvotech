'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Code, Zap, Layers } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { Locale } from '@/lib/get-dictionary';

interface ServiceHeroProps {
  lang: string;
  dict: any;
  categories: { id: string; name: string }[];
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ lang, dict, categories }) => {
  const isAr = lang === 'ar';
  const s = dict.SERVICE_LISTING;

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(`category-${id}`);
    if (element) {
      const headerOffset = 140; // sticky header + filter bar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getCategoryIcon = (name: string, size = "w-4 h-4") => {
    const n = name.toLowerCase();
    if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) return <Shield className={size} />;
    if (n.includes('network') || n.includes('infra') || n.includes('شبكة')) return <Globe className={size} />;
    if (n.includes('software') || n.includes('app') || n.includes('برمج')) return <Code className={size} />;
    if (n.includes('enterprise') || n.includes('oracle') || n.includes('أوراكل')) return <Zap className={size} />;
    return <Layers className={size} />;
  };

  const getCategoryColorClass = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cyber') || n.includes('security')) return 'text-blue-400';
    if (n.includes('network')) return 'text-cyan-400';
    if (n.includes('software')) return 'text-indigo-400';
    if (n.includes('enterprise')) return 'text-emerald-400';
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
          items={[{ label: isAr ? 'خدماتنا' : 'Services' }]} 
          listingPage={true}
      /> */}

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 justify-between w-full">
          <div className={`w-full lg:w-[55%] xl:w-[60%] shrink-0 ${isAr ? 'mr-0 ml-auto text-right' : 'text-left'}`}>
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
                  حلول مبنية لمستقبل<br />
                  <span className="text-cyan-300">رقمي أذكى وأكثر أماناً</span>
                </>
              ) : (
                <>
                  Solutions Built for a<br />
                  <span className="text-cyan-300 text-stroke-thin">Smarter, Safer Digital Future</span>
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

            {/* Categories Grid (Interactive Scroll) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-1"
            >
              {categories.slice(0, 4).map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className="group p-6 rounded-3xl bg-[#060E24] border border-white/10 hover:bg-[#060E24] hover:border-white/20 transition-all duration-300 text-left flex flex-col items-start"
                >
                  <div className="mb-4 p-3 w-fit bg-white/5 rounded-xl group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                    {getCategoryIcon(cat.name, `w-6 h-6 ${getCategoryColorClass(cat.name)}`)}
                  </div>
                  <div className="text-[10px] md:text-xs font-syne font-bold text-white/50 leading-tight group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
                    {cat.name}
                  </div>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Side Image */}
          <div className={`w-full lg:w-[45%] xl:w-[40%] flex justify-center lg:justify-end animate-fade-in-up animation-delay-400 ${isAr ? 'lg:justify-start' : 'lg:justify-end'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-white/5 blur-xl rounded-full opacity-50"></div>
              <img
                src="/img/pagesbannersimg/Service Page.svg"
                alt="Sharp Innovations Services"
                className="w-[85%] sm:w-[60%] lg:w-full max-w-[500px] lg:max-w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
