'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Users, Lightbulb, ArrowRight, Star, Heart, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CareerHeroProps {
  lang: string;
  dict: any;
}

const CareerHero: React.FC<CareerHeroProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.career;

  const cultureHighlights = [
    {
      title: isAr ? 'مشاريع مبتكرة' : 'Innovative Projects',
      desc: isAr ? 'اعمل على أحدث التقنيات التي تشكل المستقبل.' : 'Work on cutting-edge tech that shapes the future.',
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      bg: 'bg-yellow-400/10'
    },
    {
      title: isAr ? 'فريق عالمي' : 'Global Team',
      desc: isAr ? 'تعاون مع خبراء من جميع أنحاء العالم.' : 'Collaborate with experts from across the globe.',
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      bg: 'bg-blue-400/10'
    },
    {
      title: isAr ? 'نمو مهني' : 'Professional Growth',
      desc: isAr ? 'برامج توجيه وتعلم مستمر لمسيرتك.' : 'Mentorship and continuous learning for your career.',
      icon: <Rocket className="w-6 h-6 text-purple-400" />,
      bg: 'bg-purple-400/10'
    },
    {
      title: isAr ? 'بيئة داعمة' : 'Supportive Culture',
      desc: isAr ? 'نقدر التنوع والإبداع في كل ما نقوم به.' : 'We value diversity and creativity in everything we do.',
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      bg: 'bg-pink-400/10'
    }
  ];

  return (
    <section className="relative bg-[#0d6efd] pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      ></div>

      {/* Animated Orbs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Hero Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-white/30 bg-white/10 text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
          >
            <Star className="w-3 h-3 text-cyan-300 fill-cyan-300" />
            {isAr ? 'انضم إلى عائلتنا' : 'JOIN OUR VISIONARY TEAM'}
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-syne text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8"
          >
            {isAr ? (
              <>
                ابنِ مسيرتك في<br />
                <span className="text-cyan-300">عالم الابتكار</span>
              </>
            ) : (
              <>
                Build Your Future in<br />
                <span className="text-cyan-300 text-stroke-thin">The Tech Frontier</span>
              </>
            )}
          </motion.h1>

          {/* Hero Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-dm-sans text-base text-white/80 leading-relaxed max-w-2xl !text-white mb-16"
          >
            {s.careers_description}
          </motion.p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureHighlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-6 rounded-[2.5rem] bg-[#060E24] backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500"
              >
                <div className={`mb-6 p-4 w-fit rounded-2xl ${item.bg} group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-syne font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed font-dm-sans">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
