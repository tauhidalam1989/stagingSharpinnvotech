'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Users, Shield, Zap } from 'lucide-react';

interface ContactWhyProps {
  lang: string;
  dict: any;
}

const ContactWhy: React.FC<ContactWhyProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  
  const reasons = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: isAr ? 'استجابة سريعة' : 'Fast Response',
      desc: isAr 
        ? 'نقوم بالرد على جميع الاستفسارات خلال يوم عمل واحد - وغالبًا في وقت أقصر. لا يوجد تحويلات آلية، بل شخص حقيقي جاهز للمساعدة.'
        : 'We respond to all inquiries within one business day — often sooner. No automated runaround, just a real person ready to help.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: isAr ? 'استشارة الخبراء' : 'Expert Consultation',
      desc: isAr 
        ? 'يذهب استفسارك مباشرة إلى خبير متخصص في المجال - وليس فريق مبيعات عام. تحصل على توجيه فني وتقني من اليوم الأول.'
        : 'Your inquiry goes directly to a relevant domain expert — not a generic sales team. You get informed, technical guidance from day one.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: isAr ? 'بدون التزام' : 'No Obligation',
      desc: isAr 
        ? 'تواصل معنا بحرية. المحادثة الأولية لا تكلف شيئًا - نحن هنا لفهم احتياجاتك قبل اقتراح أي حل.'
        : "Reach out freely. An initial conversation costs nothing — we're here to understand your needs before suggesting any solution."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: isAr ? 'مقترح مفصل' : 'Tailored Proposal',
      desc: isAr 
        ? 'إذا كان احتياجك مناسبًا، نقوم بإعداد مقترح مخصص - مصمم خصيصًا لأهدافك وجدولك الزمني وميزانيتك - وليس حزمة عامة.'
        : 'If your need is a fit, we prepare a customized proposal — scoped specifically to your goals, timeline, and budget — not a generic package.'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-zinc-950" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0d6efd] text-xs font-bold uppercase tracking-widest mb-6"
          >
            {isAr ? 'لماذا تواصل معنا' : 'Why Reach Out'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syne text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 leading-tight"
          >
            {isAr ? 'ماذا يحدث عندما تتواصل معنا' : 'What Happens When You Contact Us'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-dm-sans text-lg text-zinc-500 dark:text-zinc-400 font-light leading-relaxed"
          >
            {isAr 
              ? 'نحن نجعل كل استفسار مهمًا. إليك ما يمكن توقعه عند التواصل مع فريق ابتكارات حادة.'
              : "We make every inquiry count. Here's what to expect when you get in touch with the Sharp Innovations team."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 pb-10 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {reason.icon}
              </div>
              <h4 className="font-syne text-lg font-bold text-zinc-900 dark:text-white mb-4">{reason.title}</h4>
              <p className="font-dm-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactWhy;
