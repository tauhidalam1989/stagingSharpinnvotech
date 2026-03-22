'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Box } from 'lucide-react';
import { Product } from '@/lib/api';

interface ProductCardV2Props {
  product: Product;
  lang: string;
  dict: any;
  categoryName?: string;
}

const ProductCardV2: React.FC<ProductCardV2Props> = ({ product, lang, dict, categoryName }) => {
  const isAr = lang === 'ar';
  const title = isAr && product.titleAr ? product.titleAr : product.title;
  const description = isAr && product.shortDescriptionAr ? product.shortDescriptionAr : product.shortDescription;
  
  // Theme Mapping
  const getTheme = (catName: string | undefined) => {
    const n = (catName || '').toLowerCase();
    
    // AI Smart City -> Cyan
    if (n.includes('city') || n.includes('مدينة')) {
      return {
        border: 'hover:border-cyan-500',
        iconBg: 'bg-cyan-50 group-hover:bg-cyan-600',
        iconColor: 'text-cyan-600 group-hover:text-white',
        tag: 'bg-cyan-500/10 text-cyan-600',
        shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(6,182,212,0.3)]',
        accent: 'group-hover:bg-cyan-500/5',
        btn: 'text-cyan-600'
      };
    }
    
    // Industrial Safety -> Amber
    if (n.includes('industrial') || n.includes('safety') || n.includes('صناعي')) {
      return {
        border: 'hover:border-amber-500',
        iconBg: 'bg-amber-50 group-hover:bg-amber-600',
        iconColor: 'text-amber-600 group-hover:text-white',
        tag: 'bg-amber-500/10 text-amber-600',
        shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.3)]',
        accent: 'group-hover:bg-amber-500/5',
        btn: 'text-amber-600'
      };
    }

    // Management / HR -> Blue/Indigo
    if (n.includes('management') || n.includes('resource') || n.includes('إدارة')) {
      return {
        border: 'hover:border-blue-500',
        iconBg: 'bg-blue-50 group-hover:bg-blue-600',
        iconColor: 'text-blue-600 group-hover:text-white',
        tag: 'bg-blue-500/10 text-blue-600',
        shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)]',
        accent: 'group-hover:bg-blue-500/5',
        btn: 'text-blue-600'
      };
    }

    // GIS / Telematics -> Emerald/Teal
    if (n.includes('gis') || n.includes('telematics') || n.includes('خرائط')) {
      return {
        border: 'hover:border-emerald-500',
        iconBg: 'bg-emerald-50 group-hover:bg-emerald-600',
        iconColor: 'text-emerald-600 group-hover:text-white',
        tag: 'bg-emerald-500/10 text-emerald-600',
        shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.3)]',
        accent: 'group-hover:bg-emerald-500/5',
        btn: 'text-emerald-600'
      };
    }

    // Default
    return {
      border: 'hover:border-blue-500',
      iconBg: 'bg-blue-50 group-hover:bg-blue-600',
      iconColor: 'text-blue-600 group-hover:text-white',
      tag: 'bg-blue-500/10 text-blue-600',
      shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)]',
      accent: 'group-hover:bg-blue-500/5',
      btn: 'text-blue-600'
    };
  };

  const theme = getTheme(categoryName);

  const isIconClass = (str: string | undefined) => {
    if (!str) return false;
    const s = str.trim();
    return s.startsWith('fa-') || s.includes(' fa-') || s.startsWith('fas') || s.startsWith('fab');
  };

  const displayIconClass = product.cardIcon && isIconClass(product.cardIcon) ? product.cardIcon : null;

  const getFullImageUrl = (path: string) => {
    if (!path || isIconClass(path)) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
    if (path.startsWith('http')) return path;
    return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
  };

  const cardIconUrl = getFullImageUrl(product.cardIcon || '');

  // Extract features - for demo, we'll use a few placeholders if list is empty
  const featuresList = isAr && product.keyFeaturesListAr && product.keyFeaturesListAr.length > 0 
    ? product.keyFeaturesListAr 
    : product.keyFeaturesList;

  const features = featuresList?.slice(0, 3).map(f => f.text) || 
                   (isAr ? ["أداء عالي", "أمان متقدم", "تكامل سلس"] : ["High Performance", "Advanced Security", "Seamless Integration"]);

  return (
    <Link href={`/${lang}/products/${product.slug}`} className="block">
      <motion.div
        whileHover={{ y: -10, scale: 1.01 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 ${theme.border} ${theme.shadow} h-full flex flex-col overflow-hidden`}
      >
        {/* Decorative background element */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-12 -mt-12 transition-all duration-700 ${theme.accent} opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-150 transform`}></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header with Icon and Tag */}
          <div className="flex items-start justify-between mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${theme.iconBg} ${theme.iconColor} shadow-sm border border-zinc-50 dark:border-zinc-800`}>
              {displayIconClass ? (
                <i className={`${displayIconClass} text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}></i>
              ) : cardIconUrl ? (
                <div className="relative w-9 h-9">
                  <Image src={cardIconUrl} alt={title} fill className="object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500" />
                </div>
              ) : (
                <Box className="w-8 h-8 group-hover:scale-110 transition-all duration-500" />
              )}
            </div>
            {categoryName && (
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.tag}`}>
                {categoryName}
              </span>
            )}
          </div>

          {/* Title and Description */}
          <div className="mb-6">
            <h3 className="font-syne text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors leading-tight">
              {title}
            </h3>
            <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Features Checklist */}
          <div className="mt-4 mb-8 space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${theme.btn.replace('text-', 'text-')}`} />
                <span className="text-xs font-semibold">{feature}</span>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <div className={`mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between ${theme.btn} font-bold text-xs uppercase tracking-widest`}>
            <span>{dict.PRODUCT_LISTING?.EXPLORE || (isAr ? "استكشف المنتج" : "Explore Product")}</span>
            <div className={`w-8 h-8 rounded-full border border-current flex items-center justify-center transition-all duration-300 group-hover:bg-current group-hover:text-white ${isAr ? 'rotate-180' : ''}`}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCardV2;
