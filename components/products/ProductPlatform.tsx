'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Cpu, Zap, Shield, Database, Layout } from 'lucide-react';

interface ProductPlatformProps {
  lang: string;
}

const ProductPlatform: React.FC<ProductPlatformProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const features = isAr ? [
    { title: "محرك الذكاء الاصطناعي الأساسي", desc: "تتم معالجة جميع المنتجات بواسطة محرك الذكاء الاصطناعي المتطور الخاص بنا لضمان الدقة والسرعة.", icon: <Cpu className="w-6 h-6" /> },
    { title: "أمان بمستوى المؤسسات", desc: "تشفير كامل وحماية متطورة للبيانات في جميع حلولنا الرقمية.", icon: <Shield className="w-6 h-6" /> },
    { title: "تكامل البيانات الموحد", desc: "سحب البيانات من مصادر متعددة وتدفقها بسلاسة عبر واجهة موحدة.", icon: <Database className="w-6 h-6" /> },
    { title: "واجهات مستخدم ذكية", desc: "تصاميم تركز على المستخدم توفر تجربة سلسة وتفاعلية.", icon: <Layout className="w-6 h-6" /> },
  ] : [
    { title: "Core AI Engine", desc: "All products are powered by our advanced AI engine, ensuring high precision and processing speed.", icon: <Cpu className="w-6 h-6" /> },
    { title: "Enterprise-Grade Security", desc: "End-to-end encryption and advanced data protection across all our digital solutions.", icon: <Shield className="w-6 h-6" /> },
    { title: "Unified Data Integration", desc: "Pull data from multiple sources seamlessly through our unified integration layer.", icon: <Database className="w-6 h-6" /> },
    { title: "Intelligent UI/UX", desc: "User-centric designs providing a smooth and highly interactive experience.", icon: <Layout className="w-6 h-6" /> },
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: isAr ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 block">
                  {isAr ? "الأساس التقني" : "Technical Foundation"}
                </span>
                <h2 className="font-syne text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-6">
                  {isAr ? "مبني على منصة ذكاء اصطناعي موحدة" : "Built on a Unified AI Platform"}
                </h2>
                <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                  {isAr 
                    ? "ليست مجرد منتجات منفصلة، بل منظومة متكاملة تعمل بذكاء لتوفير رؤى أعمق وكفاءة أعلى لمؤسستك."
                    : "More than just separate products—our ecosystem works intelligently to provide deeper insights and higher efficiency for your organization."
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feat, idx) => (
                  <div key={idx} className="group p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <h4 className="text-zinc-900 dark:text-white font-bold mb-2">{feat.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
             {/* Decorative element for the visual side */}
             <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square max-w-md mx-auto"
            >
              <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[80px] animate-pulse"></div>
              <div className="relative z-10 w-full h-full border-2 border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-4 flex items-center justify-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-[#0d6efd] to-cyan-500 p-8 flex flex-col justify-center items-center text-center text-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  <Zap className="w-20 h-20 mb-6 animate-bounce" />
                  <h3 className="font-syne text-2xl font-black mb-4">SHARP ENGINE v4.0</h3>
                  <div className="space-y-3 w-full">
                    {[80, 60, 95].map((w, i) => (
                      <div key={i} className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white" 
                          initial={{ width: 0 }} 
                          whileInView={{ width: `${w}%` }} 
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 z-20 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-black uppercase text-zinc-900 dark:text-white">Certified Secure</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPlatform;
