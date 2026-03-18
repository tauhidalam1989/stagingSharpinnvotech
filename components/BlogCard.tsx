import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/lib/api";
import { Locale } from "@/lib/get-dictionary";

interface BlogCardProps {
    blog: Blog;
    lang: Locale;
    dict: any;
}

export default function BlogCard({ blog, lang, dict }: BlogCardProps) {
    const imageUrl = blog.featuredImage 
        ? (blog.featuredImage.startsWith('http') 
            ? blog.featuredImage 
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${blog.featuredImage}`)
        : '/img/placeholder-blog.png';

    const title = lang === 'ar' && blog.titleAr ? blog.titleAr : blog.title;
    const excerpt = lang === 'ar' && blog.excerptAr ? blog.excerptAr : blog.excerpt;
    const category = lang === 'ar' 
        ? (blog.categoriesAr?.[0] || 'مقال') 
        : (blog.categories?.[0] || 'Article');

    return (
        <Link
            href={`/${lang}/blogs/${blog.slug}`}
            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full animate-slide-up"
        >
            {/* Image Wrapper - Compact aspect ratio */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badge - Smaller */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-blue-600 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content - Compacted padding and spacing */}
            <div className="p-4 md:p-5 flex flex-col flex-grow">
                {/* Meta - Smaller text */}
                <div className="flex items-center gap-2 mb-2.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    <span>{new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium' })}</span>
                    <span className="w-1 h-1 rounded-full bg-blue-500/30"></span>
                    <span>SHARP INNOVATION</span>
                </div>

                {/* Title - Smaller text */}
                <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 tracking-tight leading-tight">
                    {title}
                </h3>

                {/* Excerpt - Finer text */}
                <p className="text-zinc-500 dark:text-zinc-400 text-[12px] leading-relaxed mb-4 line-clamp-2 flex-grow">
                    {excerpt}
                </p>

                {/* Footer Link - Tightened */}
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-600 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <span className="group-hover:mr-1.5 transition-all duration-300">
                        {lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                    </span>
                    <i className={`fas ${lang === 'ar' ? 'fa-arrow-left mr-1.5' : 'fa-arrow-right ml-1.5'} text-[9px] transition-transform duration-300 group-hover:translate-x-1`}></i>
                </div>
            </div>
        </Link>
    );
}
