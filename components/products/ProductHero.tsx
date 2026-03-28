'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, Cpu, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { Locale } from '@/lib/get-dictionary';

interface ProductHeroProps {
  lang: string;
  dict: any;
}

const ProductHero: React.FC<ProductHeroProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const p = dict.PRODUCT_LISTING;

  const stats = [
    { label: p.STAT_PRODUCTS, value: "20+", icon: <Box className="w-5 h-5 text-blue-400" /> },
    { label: p.STAT_CATEGORIES, value: "6", icon: <Layers className="w-5 h-5 text-cyan-400" /> },
    { label: p.STAT_DEPLOYMENTS, value: "50+", icon: <Cpu className="w-5 h-5 text-indigo-400" /> },
    { label: p.STAT_ALIGNMENT, value: "2030", icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <section className="relative bg-[#0d6efd] pt-32 pb-20 md:pt-30 md:pb-32 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          // backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          //backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Animated Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* <Breadcrumbs 
          lang={lang as Locale} 
          dict={dict} 
          items={[{ label: isAr ? 'منتجاتنا' : 'Products' }]} 
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
              {p.HERO_PILL}
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sons-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8"
            >
              {isAr ? (
                <>
                  منتجات مدعومة بالذكاء الاصطناعي<br />
                  <span className="text-cyan-300">مهيأة لمستقبل المملكة</span>
                </>
              ) : (
                <>
                  AI-Powered Products<br />
                  <span className="text-cyan-300 text-stroke-thin">Engineered for Saudi's Future</span>
                </>
              )}
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-dm-sans text-base md:text-base text-white/80 font-light leading-relaxed max-w-3xl !text-white mb-16"
            >
              {p.HERO_DESC}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-1"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-3xl bg-[#060E24] border border-white/10 hover:bg-[#060E24] hover:border-white/20 transition-all duration-300 text-left"
                  style={{ direction: 'ltr' }}
                >
                  <div className="mb-4 p-2 w-fit bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-sons-serif font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className={`text-[11px] font-bold text-white/50 uppercase tracking-wider ${isAr ? 'font-dm-sans' : ''}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side Image */}
          <div className={`w-full lg:w-[45%] xl:w-[40%] flex justify-center lg:justify-end animate-fade-in-up animation-delay-400 ${isAr ? 'lg:justify-start' : 'lg:justify-end'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-white/5 blur-xl rounded-full opacity-50"></div>
              <img
                src="/img/pagesbannersimg/Product Page.svg"
                alt="Sharp Innovations Products"
                className="w-[85%] sm:w-[60%] lg:w-full max-w-[500px] lg:max-w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
