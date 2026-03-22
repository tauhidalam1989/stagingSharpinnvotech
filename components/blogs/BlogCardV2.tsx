'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { Blog } from '@/lib/api';

interface BlogCardV2Props {
  blog: Blog;
  lang: string;
  dict: any;
}

const BlogCardV2: React.FC<BlogCardV2Props> = ({ blog, lang, dict }) => {
  const isAr = lang === 'ar';
  const title = isAr && blog.titleAr ? blog.titleAr : blog.title;
  const excerpt = isAr && blog.excerptAr ? blog.excerptAr : blog.excerpt;
  const category = isAr ? (blog.categoriesAr?.[0] || 'مقال') : (blog.categories?.[0] || 'Article');

  const imageUrl = blog.featuredImage
    ? (blog.featuredImage.startsWith('http')
      ? blog.featuredImage
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${blog.featuredImage}`)
    : '/img/placeholder-blog.png';

  const dateString = new Date(blog.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Theme Mapping based on category
  const getTheme = (cat: string) => {
    const n = cat.toLowerCase();
    if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) {
      return { accent: 'text-blue-500', bg: 'bg-blue-500/10', hover: 'group-hover:bg-blue-600', shadow: 'hover:shadow-blue-500/20' };
    }
    if (n.includes('ai') || n.includes('intelligence') || n.includes('ذكاء')) {
      return { accent: 'text-purple-500', bg: 'bg-purple-500/10', hover: 'group-hover:bg-purple-600', shadow: 'hover:shadow-purple-500/20' };
    }
    if (n.includes('tech') || n.includes('تقني')) {
      return { accent: 'text-cyan-500', bg: 'bg-cyan-500/10', hover: 'group-hover:bg-cyan-600', shadow: 'hover:shadow-cyan-500/20' };
    }
    return { accent: 'text-indigo-500', bg: 'bg-indigo-500/10', hover: 'group-hover:bg-indigo-600', shadow: 'hover:shadow-indigo-500/20' };
  };

  const theme = getTheme(category);

  return (
    <Link href={`/${lang}/blogs/${blog.slug}`} className="group h-full">
      <motion.div
        whileHover={{ y: -8 }}
        className={`relative flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:border-blue-500/30 ${theme.shadow} shadow-xl shadow-zinc-200/50 dark:shadow-none`}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.bg} ${theme.accent} border border-white/20 shadow-lg`}>
              {category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          {/* Meta Information */}
          <div className="flex items-center gap-4 mb-4 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateString}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Sharp INNOVATION</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-syne text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
            {excerpt}
          </p>

          {/* Footer Card Link */}
          <div className={`mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between ${theme.accent} font-bold text-[10px] uppercase tracking-[0.2em]`}>
            <span>{dict.BLOG_LISTING?.READ_MORE || (isAr ? "اقرأ المزيد" : "Read More")}</span>
            <div className={`w-8 h-8 rounded-full border border-current flex items-center justify-center transition-all duration-300 ${theme.hover} group-hover:text-white ${isAr ? 'rotate-180' : ''}`}>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCardV2;
