'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Mail, ArrowRight } from 'lucide-react';

interface BlogCTAProps {
  lang: string;
  dict: any;
}

const BlogCTA: React.FC<BlogCTAProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  
  return (
    <section className="py-4 md:py-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="relative rounded-[32px] bg-[#0d6efd] p-6 md:p-8 lg:p-10 overflow-hidden shadow-2xl shadow-blue-200 dark:shadow-blue-900/20">
          {/* Background patterns */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[40px] border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-start">
            <div className="lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                {isAr ? 'ابقَ على اطلاع' : 'STAY UPDATED'}
              </div>
              <h2 className="font-syne text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-4">
                {isAr ? 'هل أنت مستعد لهذه الرحلة المعرفية؟' : 'Ready to Deep Dive into Tech?'}
              </h2>
              <p className="font-dm-sans text-xs md:text-sm text-white/80 font-light leading-relaxed !text-white max-w-2xl">
                {isAr 
                  ? 'اشترك في نشرتنا الإخبارية للحصول على أحدث الرؤى التقنية والاتجاهات المستقبلية مباشرة في بريدك الوارد.'
                  : 'Subscribe to our newsletter to receive the latest tech insights and future trends directly in your inbox.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
              <Link
                href={`/${lang}/contact`}
                className="group inline-flex items-center justify-center gap-3 bg-white text-[#0d6efd] px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>{isAr ? 'اشترك الآن' : 'Subscribe Now'}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </Link>
              <Link
                href={`/${lang}/blogs`}
                className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm text-sm"
              >
                <span>{isAr ? 'تصفح المزيد' : 'Explore More'}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
