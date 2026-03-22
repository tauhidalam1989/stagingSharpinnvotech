'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare, Briefcase } from 'lucide-react';

interface ServiceCTAProps {
  lang: string;
  dict: any;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const s = dict.SERVICE_LISTING;

  return (
    <section className="py-8 md:py-12" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="relative rounded-[32px] bg-[#0d6efd] p-6 md:p-8 lg:p-10 overflow-hidden shadow-2xl shadow-blue-200">
          {/* Background patterns */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[40px] border-white/10 rounded-full"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-start">
            <div className="lg:w-2/3">
              <h2 className="font-syne text-2xl md:text-2xl font-extrabold text-white leading-tight mb-6">
                {s.CTA_TITLE}
              </h2>
              <p className="font-dm-sans text-sm text-white/70 font-light leading-relaxed !text-white max-w-2xl">
                {s.CTA_SUB}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                href={`/${lang}/contact`}
                className="group inline-flex items-center justify-center gap-3 bg-white text-[#0d6efd] px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{s.CTA_BTN_1}</span>
                <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </Link>
              <Link
                href={`/${lang}/products`}
                className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                <Briefcase className="w-5 h-5" />
                <span>{s.CTA_BTN_2}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCTA;
