'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Shield, Globe, Cpu, Layers, LayoutGrid } from 'lucide-react';
import ProductCardV2 from './ProductCardV2';
import { Product } from '@/lib/api';

interface ProductListingClientProps {
  lang: string;
  dict: any;
  productsByCategory: { [key: string]: { name: string, products: Product[] } };
  categoryIds: string[];
}

const ProductListingClient: React.FC<ProductListingClientProps> = ({
  lang,
  dict,
  productsByCategory,
  categoryIds
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [scrolledSection, setScrolledSection] = useState<string | null>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const isAr = lang === 'ar';
  const p = dict.PRODUCT_LISTING;
  const manualScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync Horizontal Scroll for Desktop/Mobile
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
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          const id = intersectingEntry.target.id.replace('category-', '');
          setScrolledSection(id);
        } else if (window.scrollY < 400) {
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
        const headerOffset = 180;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('city') || n.includes('مدينة')) return <Globe className="w-5 h-5" />;
    if (n.includes('safety') || n.includes('industrial') || n.includes('صناعي')) return <Shield className="w-5 h-5" />;
    if (n.includes('management') || n.includes('resource') || n.includes('إدارة')) return <Layers className="w-5 h-5" />;
    if (n.includes('gis') || n.includes('خرائط')) return <Cpu className="w-5 h-5" />;
    return <Box className="w-5 h-5" />;
  };

  const getCategoryDotColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('city') || n.includes('مدينة')) return 'bg-cyan-500';
    if (n.includes('safety') || n.includes('industrial') || n.includes('صناعي')) return 'bg-amber-500';
    if (n.includes('management') || n.includes('resource') || n.includes('إدارة')) return 'bg-blue-500';
    if (n.includes('gis') || n.includes('خرائط')) return 'bg-emerald-500';
    return 'bg-indigo-500';
  };

  const getCategoryColorClass = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('city') || n.includes('مدينة')) return 'bg-cyan-50 text-cyan-600 border-cyan-100';
    if (n.includes('safety') || n.includes('industrial') || n.includes('صناعي')) return 'bg-amber-50 text-amber-600 border-amber-100';
    if (n.includes('management') || n.includes('resource') || n.includes('إدارة')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (n.includes('gis') || n.includes('خرائط')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-indigo-50 text-indigo-600 border-indigo-100';
  };

  const filteredCategories = categoryIds.filter(id => {
    return activeFilter === 'all' || activeFilter === id;
  });

  return (
    <div className="relative" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Sticky Filter Bar */}
      <div className="sticky top-[80px] z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100 shadow-md transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Filter Pills */}
            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 lg:pb-0"
            >
              <button
                onClick={() => handleFilterClick('all')}
                data-active={activeFilter === 'all' && !scrolledSection}
                className={`px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-500 flex items-center gap-3 whitespace-nowrap border shrink-0 ${
                  activeFilter === 'all' && !scrolledSection
                    ? 'bg-[#0d6efd] text-white shadow-xl shadow-blue-200 border-transparent'
                    : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border-zinc-200 shadow-sm'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                {p.FILTER_ALL}
              </button>
              {categoryIds.map((id) => {
                const isActive = activeFilter === id || (activeFilter === 'all' && scrolledSection === id);
                const category = productsByCategory[id];
                return (
                  <button
                    key={id}
                    onClick={() => handleFilterClick(id)}
                    data-active={isActive}
                    className={`px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-500 flex items-center gap-3 whitespace-nowrap border shrink-0 ${
                      isActive
                        ? 'bg-[#0d6efd] text-white shadow-xl shadow-blue-200 border-transparent'
                        : 'bg-white text-zinc-600 hover:border-[#0d6efd]/30 hover:text-[#0d6efd] border-zinc-200 shadow-sm'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${getCategoryDotColor(category.name)} ${isActive ? 'ring-4 ring-white/30' : ''}`}></span>
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Content Area */}
      <div className="container mx-auto px-6 py-20 lg:py-32 bg-zinc-50/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-32"
          >
            {filteredCategories.map((id) => (
              <div key={id} id={`category-${id}`} className="scroll-mt-48">
                {/* Section Title */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative">
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-2xl bg-white shadow-sm border border-zinc-100 ${getCategoryDotColor(productsByCategory[id].name).replace('bg-', 'text-')}`}>
                        {getCategoryIcon(productsByCategory[id].name)}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-60 ${isAr ? 'font-dm-sans' : ''}`}>
                        {productsByCategory[id].products.length} {isAr ? "منتجات متوفرة" : "Available Products"}
                      </span>
                    </div>
                    <h2 className="font-syne text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight">
                      {productsByCategory[id].name}
                    </h2>
                  </div>
                  <div className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] hidden md:block border shadow-sm ${getCategoryColorClass(productsByCategory[id].name)}`}>
                    {productsByCategory[id].products.length} {isAr ? 'منتجات' : 'Products'}
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {productsByCategory[id].products
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((product) => (
                      <ProductCardV2
                        key={product.id}
                        product={product}
                        lang={lang}
                        dict={dict}
                        categoryName={productsByCategory[id].name}
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

export default ProductListingClient;
