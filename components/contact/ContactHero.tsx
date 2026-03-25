'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../Breadcrumbs';
import { Locale } from '@/lib/get-dictionary';

interface ContactHeroProps {
  lang: string;
  dict: any;
}

const ContactHero: React.FC<ContactHeroProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0d6efd] overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[120px] -right-[80px] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(22,80,200,0.28)_0%,transparent_65%)]"
        />
        <motion.div
          animate={{ x: [-20, 20, -20], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[160px] left-[10%] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_65%)]"
        />
      </div>

      {/* <Breadcrumbs 
          lang={lang as Locale} 
          dict={dict} 
          items={[{ label: isAr ? 'اتصل بنا' : 'Contact Us' }]} 
          listingPage={true}
      /> */}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/30 text-blue-50 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          {isAr ? 'اتصل بنا' : 'Contact Us'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-syne text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight"
        >
          {isAr ? (
            <>دعونا نتحدث عن<br /><span className="text-cyan-300">مشروعك القادم</span></>
          ) : (
            <>Let's Talk About<br />Your <span className="text-cyan-300 font-normal">Next Project</span></>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-dm-sans text-base md:text-lg text-white/80 max-w-2xl leading-relaxed !text-white font-light"
        >
          {isAr
            ? 'نحن نحب أن نسمع منك. سواء كان لديك سؤال حول خدماتنا، أو ترغب في طلب عرض تجريبي، أو كنت مستعدًا لبدء مشروع - فريقنا هنا وجاهز للمساعدة.'
            : "We'd love to hear from you. Whether you have a question about our services, want to request a demo, or are ready to kick off a project — our team is here and ready to help."}
        </motion.p>
      </div>
    </div>
    </section>
  );
};

export default ContactHero;
