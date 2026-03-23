'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Code, Zap, Layers, ArrowRight, LayoutGrid } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { ServicePage } from '@/lib/api';

interface ServiceListingClientProps {
  lang: string;
  dict: any;
  servicesByCategory: { [key: string]: { name: string, services: ServicePage[] } };
  categoryIds: string[];
}

const ServiceListingClient: React.FC<ServiceListingClientProps> = ({
  lang,
  dict,
  servicesByCategory,
  categoryIds
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [scrolledSection, setScrolledSection] = useState<string | null>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const isAr = lang === 'ar';
  const s = dict.SERVICE_LISTING;
  const manualScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync Horizontal Scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeFilter, scrolledSection]);

  // Scroll Spy Logic
  useEffect(() => {
    if (!isManualScroll) {
      const handleInitialScroll = () => {
        if (window.scrollY < 100) setScrolledSection(null);
      };
      window.addEventListener('scroll', handleInitialScroll);
      return () => window.removeEventListener('scroll', handleInitialScroll);
    }
  }, [isManualScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;

        // Find the entry that is intersecting at the top with a bit of buffer
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          const id = intersectingEntry.target.id.replace('category-', '');
          setScrolledSection(id);
        } else if (window.scrollY < 200) {
          setScrolledSection(null);
        }
      },
      {
        rootMargin: '-160px 0px -70% 0px',
        threshold: 0
      }
    );

    categoryIds.forEach((id) => {
      const el = document.getElementById(`category-${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categoryIds, isManualScroll]);

  // Category Icon Mapping
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) return <Shield className="w-6 h-6" />;
    if (n.includes('network') || n.includes('infra') || n.includes('شبكة')) return <Globe className="w-6 h-6" />;
    if (n.includes('software') || n.includes('app') || n.includes('برمج')) return <Code className="w-6 h-6" />;
    if (n.includes('enterprise') || n.includes('oracle') || n.includes('أوراكل')) return <Zap className="w-6 h-6" />;
    return <Layers className="w-6 h-6" />;
  };

  // Helper for dynamic colors
  const getDeterministicColor = (id: string) => {
    const palette = [
      { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
      { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', dot: 'bg-violet-500' },
      { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-100', dot: 'bg-fuchsia-500' },
      { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
      { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return palette[hash % palette.length];
  };

  // Category Color Mapping
  const getCategoryColorClass = (id: string, name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (n.includes('network') || n.includes('infra') || n.includes('شبكة')) return 'bg-cyan-50 text-cyan-600 border-cyan-100';
    if (n.includes('software') || n.includes('app') || n.includes('برمج')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    if (n.includes('enterprise') || n.includes('oracle') || n.includes('أوراكل')) return 'bg-amber-50 text-amber-600 border-amber-100';

    // Dynamic Fallback
    const fallback = getDeterministicColor(id);
    return `${fallback.bg} ${fallback.text} ${fallback.border}`;
  };

  const getCategoryDotColor = (id: string, name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) return 'bg-blue-500';
    if (n.includes('network') || n.includes('infra') || n.includes('شبكة')) return 'bg-cyan-500';
    if (n.includes('software') || n.includes('app') || n.includes('برمج')) return 'bg-indigo-500';
    if (n.includes('enterprise') || n.includes('oracle') || n.includes('أوراكل')) return 'bg-amber-500';

    // Dynamic Fallback
    return getDeterministicColor(id).dot;
  };

  const handleFilterClick = (id: string) => {
    setIsManualScroll(true);
    setActiveFilter(id);

    if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current);
    manualScrollTimerRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 1000);

    if (id !== 'all') {
      const element = document.getElementById(`category-${id}`);
      if (element) {
        const headerOffset = 140;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Sticky Filter Bar */}
      <div
        ref={scrollContainerRef}
        className="sticky top-[80px] z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 shadow-sm overflow-x-auto no-scrollbar"
      >
        <div className="container mx-auto px-6 py-4 flex items-center gap-3 whitespace-nowrap">
          <button
            onClick={() => handleFilterClick('all')}
            data-active={activeFilter === 'all' && !scrolledSection}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeFilter === 'all' && !scrolledSection
              ? 'bg-[#0d6efd] text-white shadow-lg shadow-blue-200'
              : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200'
              }`}
          >
            {/* <span className={`w-2 h-2 rounded-full bg-zinc-400 ${activeFilter === 'all' && !scrolledSection ? 'ring-2 ring-white/30' : ''}`}></span> */}
            <LayoutGrid className="w-4 h-4" />
            {s.FILTER_ALL}
          </button>
          {categoryIds.map((id) => {
            const isActive = activeFilter === id || (activeFilter === 'all' && scrolledSection === id);
            return (
              <button
                key={id}
                onClick={() => handleFilterClick(id)}
                data-active={isActive}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isActive
                  ? 'bg-[#0d6efd] text-white shadow-lg shadow-blue-200 border-transparent'
                  : 'bg-white text-zinc-600 hover:border-[#0d6efd]/30 hover:text-[#0d6efd] border border-zinc-200'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${getCategoryDotColor(id, servicesByCategory[id].name)} ${isActive ? 'ring-2 ring-white/30' : ''}`}></span>
                {servicesByCategory[id].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Content */}
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {categoryIds
              .filter(id => activeFilter === 'all' || activeFilter === id)
              .map((id) => (
                <div key={id} id={`category-${id}`} className="mb-24 last:mb-0">
                  {/* Category Header */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-8 border-b border-zinc-100">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${getCategoryColorClass(id, servicesByCategory[id].name)}`}>
                      {getCategoryIcon(servicesByCategory[id].name)}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-syne text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
                        {servicesByCategory[id].name}
                      </h2>
                      <p className="text-zinc-500 font-light text-sm md:text-base">
                        {/* Summary description could potentially be dynamic if available */}
                        {isAr ? 'حلول متكاملة مصممة خصيصاً لمؤسستك.' : 'Comprehensive solutions tailored specifically for your organization.'}
                      </p>
                    </div>
                    <div className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest hidden md:block border ${getCategoryColorClass(id, servicesByCategory[id].name)}`}>
                      {servicesByCategory[id].services.length} {isAr ? 'خدمات' : 'Services'}
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {servicesByCategory[id].services
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          lang={lang}
                          dict={dict}
                          categoryName={servicesByCategory[id].name}
                          categoryId={id}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceListingClient;
