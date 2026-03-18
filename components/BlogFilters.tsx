"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Locale } from "@/lib/get-dictionary";

interface BlogFiltersProps {
    lang: Locale;
    dict: any;
    categories: string[];
    tags: string[];
    categoriesAr: string[];
    tagsAr: string[];
    initialFilters: {
        search?: string;
        category?: string;
        tag?: string;
    };
}

export default function BlogFilters({
    lang,
    dict,
    categories,
    tags,
    categoriesAr,
    tagsAr,
    initialFilters
}: BlogFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(initialFilters.search || "");
    const [activeCategory, setActiveCategory] = useState(initialFilters.category || "");
    const [activeTag, setActiveTag] = useState(initialFilters.tag || "");

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

            // Reset to page 1 on filter change
            newSearchParams.set("page", "1");

            return newSearchParams.toString();
        },
        [searchParams]
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`${pathname}?${createQueryString({ search })}`);
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        router.push(`${pathname}?${createQueryString({ category })}`);
    };

    const handleTagChange = (tag: string) => {
        setActiveTag(tag);
        router.push(`${pathname}?${createQueryString({ tag })}`);
    };

    const handleClear = () => {
        setSearch("");
        setActiveCategory("");
        setActiveTag("");
        router.push(pathname);
    };

    const currentCategories = lang === 'ar' ? categoriesAr : categories;
    const currentTags = lang === 'ar' ? tagsAr : tags;

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 animate-slide-up">
            <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-2 shadow-xl shadow-blue-500/5">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    {/* Search Field - Compact */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={lang === 'ar' ? 'البحث...' : 'Search...'}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-zinc-400"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-500 transition-colors text-[10px]">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    {/* Category Select - Compact */}
                    <div className="relative w-full md:w-40 lg:w-48">
                        <select
                            value={activeCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                            {currentCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none opacity-50"></i>
                    </div>

                    {/* Tag Select - Compact */}
                    <div className="relative w-full md:w-40 lg:w-48">
                        <select
                            value={activeTag}
                            onChange={(e) => handleTagChange(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="">{lang === 'ar' ? 'كل الأوسمة' : 'All Tags'}</option>
                            {currentTags.map((tag) => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                        <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none opacity-50"></i>
                    </div>

                    {/* Clear Button - Compact */}
                    {(search || activeCategory || activeTag) && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-tight text-zinc-400 hover:text-red-500 transition-colors whitespace-nowrap flex items-center gap-1.5"
                        >
                            <i className="fas fa-times-circle"></i>
                            {lang === 'ar' ? 'مسح' : 'Clear'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
