'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ArrowLeft, ArrowRight, Filter, Loader2, ChevronDown } from 'lucide-react';
import BlogCardV2 from './BlogCardV2';
import { Blog } from '@/lib/api';

interface BlogListingClientProps {
  lang: string;
  dict: any;
  blogs: Blog[];
  total: number;
  categories: string[];
  categoriesAr: string[];
  tags: string[];
  tagsAr: string[];
  initialFilters: {
    search?: string;
    category?: string;
    tag?: string;
    page: number;
  };
}

const BlogListingClient: React.FC<BlogListingClientProps> = ({
  lang,
  dict,
  blogs,
  total,
  categories,
  categoriesAr,
  tags,
  tagsAr,
  initialFilters
}) => {
  const isAr = lang === 'ar';
  const s = dict.BLOG_LISTING;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [inputValue, setInputValue] = useState(initialFilters.search || "");
  const [activeCategory, setActiveCategory] = useState(initialFilters.category || "");
  const [activeTag, setActiveTag] = useState(initialFilters.tag || "");
  const [isSticky, setIsSticky] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pageSize = 12;
  const totalPages = Math.ceil(total / pageSize);

  // Sync internal state with URL params
  useEffect(() => {
    const q = searchParams.get('search') || "";
    // Avoid feedback loops: only update if the URL's value is different from the committed searchQuery
    if (q !== searchQuery) {
      setSearchQuery(q);
      setInputValue(q);
    }
    setActiveCategory(searchParams.get('category') || "");
    setActiveTag(searchParams.get('tag') || "");
  }, [searchParams, searchQuery]);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([name, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(name);
        } else {
          newSearchParams.set(name, value);
        }
      });
      newSearchParams.set("page", "1");
      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handle debounced search updates to the URL
  useEffect(() => {
    const handler = setTimeout(() => {
      // Use trimmed values for the comparison to avoid flickering on trailing spaces
      const trimmedInput = inputValue.trim();
      if (trimmedInput !== searchQuery) {
        startTransition(() => {
          setSearchQuery(trimmedInput);
          router.push(`${pathname}?${createQueryString({ search: trimmedInput })}`, { scroll: false });
        });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, searchQuery, pathname, router, createQueryString]);

  useEffect(() => {
    const handleScroll = () => {
      // Sticky after hero section (approx 500px)
      setIsSticky(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (type: 'search' | 'category' | 'tag', value: string) => {
    if (type === 'search') {
      setInputValue(value);
      return; 
    }
    
    startTransition(() => {
      if (type === 'category') setActiveCategory(value);
      if (type === 'tag') setActiveTag(value);
      router.push(`${pathname}?${createQueryString({ [type]: value })}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setSearchQuery("");
      setInputValue("");
      setActiveCategory("");
      setActiveTag("");
      router.push(pathname, { scroll: false });
    });
  };

  const currentCategories = isAr ? categoriesAr : categories;
  const currentTags = isAr ? tagsAr : tags;

  const filteredBlogs = blogs.filter(blog => {
    const q = inputValue.trim().toLowerCase(); // Use trimmed query for matching
    if (!q) return true;
    
    const title = (isAr ? blog.titleAr : blog.title) || "";
    const excerpt = (isAr ? blog.excerptAr : blog.excerpt) || "";
    const content = (isAr ? blog.contentAr : blog.content) || "";
    const rawTags = (isAr ? blog.tagsAr : blog.tags) || [];
    const tagsArr = Array.isArray(rawTags) ? rawTags : (typeof rawTags === 'string' ? [rawTags] : []);
    const rawCats = (isAr ? blog.categoriesAr : blog.categories) || [];
    const catsArr = Array.isArray(rawCats) ? rawCats : (typeof rawCats === 'string' ? [rawCats] : []);
    
    return title.toLowerCase().includes(q) || 
           excerpt.toLowerCase().includes(q) || 
           content.toLowerCase().includes(q) ||
           tagsArr.some(t => t && typeof t === 'string' && t.toLowerCase().includes(q)) ||
           catsArr.some(c => c && typeof c === 'string' && c.toLowerCase().includes(q));
  });

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sticky Filter Bar */}
      <div className={`sticky top-[80px] z-40 w-full transition-all duration-500 ${isSticky ? 'py-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-md' : 'py-8 bg-zinc-50/50 dark:bg-zinc-950/50'}`}>
        <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search */}
             <div className="relative max-w-md w-full">
               <input
                 type="text"
                 value={inputValue}
                 onChange={(e) => handleFilterChange('search', e.target.value)}
                 placeholder={s.SEARCH_PLACEHOLDER}
                className="w-full pl-12 pr-12 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
               <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400`} />
               {inputValue && (
                 <button onClick={() => handleFilterChange('search', '')} className={`absolute ${isAr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors`}>
                   <X className="w-3 h-3 text-zinc-500" />
                 </button>
               )}
             </div>

              {/* Filter Actions */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full lg:w-auto">
                {/* Category Dropdown */}
                <div className="relative group min-w-[180px]">
                  <select
                    value={activeCategory}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full appearance-none px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none pr-12 cursor-pointer hover:border-blue-500"
                  >
                    <option value="">{s.ALL_CATEGORIES}</option>
                    {(currentCategories || []).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                </div>

                {/* Tag Dropdown */}
                <div className="relative group min-w-[180px]">
                  <select
                    value={activeTag}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    className="w-full appearance-none px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-blue-600 transition-all outline-none pr-12 cursor-pointer hover:border-zinc-900 dark:hover:border-white/20"
                  >
                    <option value="">{isAr ? 'كل العلامات' : 'All Tags'}</option>
                    {(currentTags || []).map((tag) => (
                      <option key={tag} value={tag}>
                        # {tag}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                </div>

                {/* Clear Filters (angular parity) */}
                {(inputValue || activeCategory || activeTag) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all active:scale-95"
                  >
                    <X className="w-3 h-3" />
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>

       {/* Blogs Grid */}
       <section className="py-20 relative min-h-[400px]">
         {/* Loading Overlay */}
         <AnimatePresence>
           {isPending && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-x-0 top-0 z-20 flex flex-col items-center justify-start pt-20 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-[2px] h-full"
             >
               <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest animate-pulse">
                {isAr ? 'جاري التحميل...' : 'Refreshing...'}
               </p>
             </motion.div>
           )}
         </AnimatePresence>

         <div className={`container mx-auto px-6 transition-opacity duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
           <AnimatePresence mode="wait">
             {filteredBlogs.length > 0 ? (
               <motion.div
                 key="grid"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
               >
                 {filteredBlogs.map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <BlogCardV2 blog={blog} lang={lang} dict={dict} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
              >
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-8">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-syne text-3xl font-bold mb-4">{s.NO_RESULTS}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-10 leading-relaxed font-dm-sans">
                  {s.NO_RESULTS_DESC}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                  {s.CLEAR_FILTERS}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="flex gap-4">
                <button
                  disabled={initialFilters.page <= 1}
                  onClick={() => router.push(`${pathname}?${createQueryString({ page: (initialFilters.page - 1).toString() })}`)}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 disabled:opacity-30 hover:border-blue-500 transform hover:-translate-y-1 transition-all shadow-lg"
                >
                  <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
                <div className="px-8 flex items-center bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20">
                  {initialFilters.page} / {totalPages}
                </div>
                <button
                  disabled={initialFilters.page >= totalPages}
                  onClick={() => router.push(`${pathname}?${createQueryString({ page: (initialFilters.page + 1).toString() })}`)}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 disabled:opacity-30 hover:border-blue-500 transform hover:-translate-y-1 transition-all shadow-lg"
                >
                  <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {total} {isAr ? 'مقال' : 'Articles'} {isAr ? 'تم العثور عليها' : 'Found'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogListingClient;
