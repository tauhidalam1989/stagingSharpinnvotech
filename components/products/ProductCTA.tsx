'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

interface ProductCTAProps {
  lang: string;
}

const ProductCTA: React.FC<ProductCTAProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-zinc-950 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="relative rounded-[3rem] bg-[#0d6efd] p-8 md:p-16 lg:p-24 overflow-hidden shadow-2xl shadow-blue-500/20">
          {/* Patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute -top-1/2 -right-1/4 w-full h-[200%] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:max-w-xl text-center lg:text-left rtl:lg:text-right">
              <h2 className="font-syne text-3xl md:text-5xl font-extrabold text-white leading-tight mb-8">
                {isAr ? "هل تريد رؤية منتجاتنا قيد التشغيل؟" : "Want to See Our Products in Action?"}
              </h2>
              <p className="font-dm-sans text-lg text-white/80 font-light !text-white mb-12">
                {isAr
                  ? "احجز جلسة عرض مباشرة مع خبرائنا لاكتشاف كيف يمكن لحلولنا المدعومة بالذكاء الاصطناعي تحويل أعمالك."
                  : "Book a live demo session with our experts to discover how our AI-powered solutions can transform your business operations."
                }
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start rtl:lg:justify-start">
                <Link href={`/${lang}/contact`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-md hover:bg-zinc-50 transition-all flex items-center gap-3"
                  >
                    {isAr ? "احجز ديمو الآن" : "Schedule Demo Now"}
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </Link>
                <Link href={`/${lang}/contact`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                    {isAr ? "احجز عرضاً توضيحياً" : "Book Video Demo"}
                  </motion.button>
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative lg:w-1/3 flex justify-center"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center relative shadow-inner">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] bg-white animate-pulse flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0d6efd] rounded-lg animate-spin-slow"></div>
                  </div>
                </div>
                {/* Orbital dots */}
                {[0, 90, 180, 270].map((deg, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="w-3 h-3 bg-cyan-400 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-lg shadow-cyan-400/50"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCTA;
