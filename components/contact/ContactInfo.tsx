'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';

interface ContactInfoProps {
  lang: string;
  dict: any;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const f = dict.FOOTER;
  const s = dict['CONTACT-FORM'];

  const contactDetails = [
    {
      label: isAr ? 'الاستفسارات العامة' : 'General Inquiries',
      items: [
        { icon: <Phone className="w-4 h-4" />, value: f.PHONE || '+966 53 140 9624', href: `tel:${(f.PHONE || '+966 53 140 9624').replace(/\s/g, '')}` },
        { icon: <Phone className="w-4 h-4" />, value: f.LANDLINE || '+966 11 453 0073', href: `tel:${(f.LANDLINE || '+966 11 453 0073').replace(/\s/g, '')}` },
        { icon: <Mail className="w-4 h-4" />, value: f.EMAIL || 'info@sharpinnvotech.com', href: `mailto:${f.EMAIL || 'info@sharpinnvotech.com'}` },
      ]
    },
    {
      label: isAr ? 'استفسارات المبيعات' : 'Sales Inquiries',
      items: [
        { icon: <Phone className="w-4 h-4" />, value: f.PHONE || '+966 53 140 9624', href: `tel:${(f.PHONE || '+966 53 140 9624').replace(/\s/g, '')}` },
        { icon: <Mail className="w-4 h-4" />, value: f.sales || 'sales@sharpinnvotech.com', href: `mailto:${f.sales || 'sales@sharpinnvotech.com'}` },
      ]
    }
  ];

  const businessHours = [
    { day: isAr ? 'الأحد – الخميس' : 'Sunday – Thursday', time: '8:00 AM – 5:00 PM', status: 'open' },
    { day: isAr ? 'الجمعة' : 'Friday', time: isAr ? 'مغلق' : 'Closed', status: 'closed' },
    { day: isAr ? 'السبت' : 'Saturday', time: isAr ? 'مغلق' : 'Closed', status: 'closed' },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, name: 'Twitter', href: 'https://x.com/sharpInnvo1351', color: 'hover:border-[#1DA1F2] hover:text-[#1DA1F2]' },
    { icon: <Facebook className="w-4 h-4" />, name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61556338118947', color: 'hover:border-[#1877F2] hover:text-[#1877F2]' },
    { icon: <Instagram className="w-4 h-4" />, name: 'Instagram', href: 'https://www.instagram.com/sharpinnovations2104/', color: 'hover:border-[#E1306C] hover:text-[#E1306C]' },
    { icon: <Linkedin className="w-4 h-4" />, name: 'LinkedIn', href: 'https://www.linkedin.com/company/sharp-innovations-company-for-information-technology-%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D8%A8%D8%AA%D9%83%D8%A7%D8%B1%D8%A7%D8%AA-%D8%AD%D8%A7%D8%AF%D8%A9-%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA/', color: 'hover:border-[#0A66C2] hover:text-[#0A66C2]' },
  ];

  return (
    <div className="flex flex-col gap-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Map Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
      >
        <div className="h-[220px] bg-zinc-50 dark:bg-zinc-800/50 relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(22,80,200,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(22,80,200,0.5)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

          <div className="relative text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 mx-auto relative z-10"
            >
              <MapPin className="w-7 h-7 text-white" />
            </motion.div>
            <div className="mt-4 font-syne font-bold text-zinc-900 dark:text-white">{isAr ? 'مقر شركة ابتكارات حادة' : 'Sharp Innovations HQ'}</div>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-2 inline-flex items-center gap-1 transition-colors">
              {isAr ? 'فتح في خرائط جوجل' : 'Open in Google Maps'} <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="p-6 flex items-center gap-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">{f.ADDRESS}</div>
            <div className="text-[11px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">{isAr ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</div>
          </div>
        </div>
      </motion.div>

      {/* Contact Details Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
      >
        <h3 className="font-syne text-lg font-bold text-zinc-900 dark:text-white mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          {isAr ? 'تفاصيل الاتصال' : 'Contact Details'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {contactDetails.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest leading-none mb-4">{group.label}</h4>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <a key={i} href={item.href} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Business Hours Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-[#060E24] rounded-[32px] p-8 text-white relative overflow-hidden border border-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-syne text-lg font-bold">{isAr ? 'ساعات العمل' : 'Business Hours'}</h3>
          </div>
          <div className="space-y-3 mb-8">
            {businessHours.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-sm font-medium text-zinc-400">{row.day}</span>
                <span className={`text-sm font-bold ${row.status === 'open' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {row.time}
                </span>
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            {isAr ? 'نحن متاحون الآن' : "We're currently open"}
          </div>
        </div>
      </motion.div>

      {/* Social Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
      >
        <h3 className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest mb-6">{isAr ? 'تابعنا على وسائل التواصل الاجتماعي' : 'Follow Us on Social Media'}</h3>
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={`flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 group ${link.color}`}
            >
              {link.icon}
              <span className="text-sm font-bold">{link.name}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
