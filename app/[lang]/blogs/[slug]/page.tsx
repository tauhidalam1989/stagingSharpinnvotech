import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/api";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogSidebar from "@/components/BlogSidebar";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    const relatedBlogs = await getRelatedBlogs(blog.id, 3);

    const title = lang === 'ar' && blog.titleAr ? blog.titleAr : blog.title;
    const excerpt = lang === 'ar' && blog.excerptAr ? blog.excerptAr : blog.excerpt;
    const content = lang === 'ar' && blog.contentAr ? blog.contentAr : blog.content;
    const category = lang === 'ar' 
        ? (blog.categoriesAr?.[0] || 'مقال') 
        : (blog.categories?.[0] || 'Article');

    // Helper to color last two words
    const renderTitle = (text: string) => {
        const words = text.split(' ');
        if (words.length <= 2) return <span className="text-[#1a6bf5]">{text}</span>;
        
        const mainPart = words.slice(0, words.length - 2).join(' ');
        const lastTwo = words.slice(words.length - 2).join(' ');
        
        return (
            <>
                {mainPart} <span className="text-[#1a6bf5]">{lastTwo}</span>
            </>
        );
    };
    const tags = lang === 'ar' ? blog.tagsAr : blog.tags;
    const parsedTags = Array.isArray(tags) 
        ? tags 
        : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    return (
        <main className="flex flex-col w-full min-h-screen bg-[#f8fbff] dark:bg-zinc-950">


            {/* Blog Hero section - More Compact */}
            <section className="relative pt-32 pb-10 overflow-hidden">
                {/* <Breadcrumbs 
                    lang={lang as Locale} 
                    dict={dict} 
                    items={[
                        { label: lang === 'ar' ? 'المدونات' : 'Blogs', href: `/${lang}/blogs` },
                        { label: title || (lang === 'ar' ? 'مقال' : 'Blog Article') }
                    ]} 
                    isLight={true}
                /> */}
                <div className="container mx-auto px-6 relative z-10">
                    <div className="w-full">
                        <Link 
                            href={`/${lang}/blogs`} 
                            className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:-translate-x-1 transition-transform group"
                        >
                            <i className={`fas fa-arrow-${lang === 'ar' ? 'right' : 'left'} text-[10px]`}></i>
                            <span className="text-[10px] uppercase tracking-widest">{lang === 'ar' ? 'العودة للمدونات' : 'Back to Blogs'}</span>
                        </Link>

                        <div className="flex items-center gap-3 mb-5">
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                {category}
                            </span>
                            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                                <i className="far fa-calendar-alt"></i>
                                <span suppressHydrationWarning>{new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'long' })}</span>
                            </div>
                        </div>

                        <h1 className="text-xl md:text-3xl lg:text-4xl font-black mb-5 leading-[1.2] tracking-tighter text-zinc-900 dark:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            {renderTitle(title || '')}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                <div className="h-10 w-10 rounded-lg bg-white dark:bg-zinc-900 shadow-lg flex items-center justify-center text-blue-600 text-base font-black border border-zinc-100 dark:border-zinc-800">
                                    S
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">SHARP INNOVATION</div>
                                    <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{lang === 'ar' ? 'مؤسسة الابتكار الحاد' : 'Official Publisher'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area - Compacted */}
            <div className="container mx-auto px-6 pb-16 relative z-10">
                <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                        
                        {/* Blog Column */}
                        <div className="lg:col-span-2">
                            <article className="bg-white dark:bg-zinc-900/40 rounded-[24px] p-6 md:p-8 border border-zinc-100 dark:border-zinc-800/50 shadow-2xl shadow-blue-500/5">
                                {excerpt && (
                                    <div className="relative mb-8 p-6 md:p-7 bg-blue-50/50 dark:bg-blue-900/10 rounded-[16px] border-l-4 border-blue-600" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                        <i className="fas fa-quote-left absolute -top-2 -left-2 text-2xl text-blue-600/20"></i>
                                        <p className="text-base md:text-lg font-medium text-zinc-900 dark:text-zinc-200 italic leading-relaxed relative z-10">
                                            {excerpt}
                                        </p>
                                    </div>
                                )}

                                <div 
                                    className="prose prose-sm md:prose-base dark:prose-invert prose-blue max-w-none text-zinc-800 dark:text-zinc-300 leading-[1.6] tracking-tight blog-content-body"
                                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />

                                {/* Tags & Sharing Section - Tightened */}
                                <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        {parsedTags.length > 0 ? (
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">{lang === 'ar' ? 'الوسوم' : 'Related Tags'}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {parsedTags.map((tag, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700/50 hover:border-blue-500/30 transition-colors cursor-default">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : <div></div>}

                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 sm:text-right">{lang === 'ar' ? 'شارك المقال' : 'Share Article'}</h3>
                                            <div className="flex gap-2 sm:justify-end text-zinc-400">
                                                <button className="w-9 h-9 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                                    <i className="fab fa-facebook-f text-xs"></i>
                                                </button>
                                                <button className="w-9 h-9 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-400 hover:text-white hover:border-blue-400 transition-all">
                                                    <i className="fab fa-twitter text-xs"></i>
                                                </button>
                                                <button className="w-9 h-9 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all">
                                                    <i className="fab fa-linkedin-in text-xs"></i>
                                                </button>
                                                <button className="w-9 h-9 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                                                    <i className="fas fa-link text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar Column */}
                        <BlogSidebar blog={blog} lang={lang} dict={dict} />
                    </div>
                </div>
            </div>

            {/* Related Posts Section - Compact */}
            {relatedBlogs.length > 0 && (
                <section className="py-16 bg-zinc-50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                            <div>
                                <div className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mb-1.5 uppercase tracking-[0.15em]">
                                    {lang === 'ar' ? 'اكتشف المزيد' : 'KEEP READING'}
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                                    {lang === 'ar' ? 'قد يعجبك أيضاً' : 'You Might Also Like'}
                                </h2>
                            </div>
                            <Link 
                                href={`/${lang}/blogs`} 
                                className="text-blue-600 font-black uppercase tracking-widest text-[9px] hover:translate-x-1 transition-transform flex items-center gap-1.5"
                            >
                                {lang === 'ar' ? 'مشاهدة الكل' : 'Explore All'}
                                <i className={`fas fa-arrow-${lang === 'ar' ? 'left' : 'right'}`}></i>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((item) => (
                                <BlogCard key={item.id} blog={item} lang={lang} dict={dict} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
