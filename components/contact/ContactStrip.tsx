'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactStripProps {
  lang: string;
  dict: any;
}

const ContactStrip: React.FC<ContactStripProps> = ({ lang, dict }) => {
  const isAr = lang === 'ar';
  const f = dict.FOOTER;
  const s = dict['CONTACT-FORM'];

  const items = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: isAr ? 'اتصل بنا' : 'Call Us',
      value: f.PHONE || '+966 53 140 9624',
      href: `tel:${(f.PHONE || '+966 53 140 9624').replace(/\s/g, '')}`
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: isAr ? 'راسلنا' : 'Email Us',
      value: f.EMAIL || 'info@sharpinnvotech.com',
      href: `mailto:${f.EMAIL || 'info@sharpinnvotech.com'}`
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: isAr ? 'تفضل بزيارتنا' : 'Visit Us',
      value: f.ADDRESS || '7576 Sulay, Al-Riyadh, KSA',
      href: '#'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: isAr ? 'ساعات العمل' : 'Business Hours',
      value: isAr ? 'الأحد – الخميس: 8ص – 5م' : 'Sun – Thu: 8 AM – 5 PM',
      href: '#'
    }
  ];

  return (
    <div className="bg-blue-600 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/10">
          {items.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-4 py-8 px-6 hover:bg-white/5 transition-colors cursor-pointer group ${idx === items.length - 1 ? 'lg:border-r-0' : ''}`}
            >
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 leading-none">{item.label}</div>
                <div className="text-sm font-semibold text-white whitespace-nowrap" dir={item.href.startsWith('tel:') ? 'ltr' : undefined}>{item.value}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactStrip;
