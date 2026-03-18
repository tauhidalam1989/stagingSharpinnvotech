import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getPublishedBlogs, getBlogFiltersMetadata } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogFilters from "@/components/BlogFilters";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

export default async function BlogsPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ page?: string; search?: string; category?: string; tag?: string }>;
}) {
    const { lang } = await params;
    const { page, search, category, tag } = await searchParams;
    const dict = await getDictionary(lang);

    const currentPage = parseInt(page || '1');
    const pageSize = 12;

    const [blogsData, filtersMetadata] = await Promise.all([
        getPublishedBlogs({
            page: currentPage,
            limit: pageSize,
            search,
            category,
            tag
        }),
        getBlogFiltersMetadata()
    ]);

    const { blogs, total } = blogsData;
    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#ebf1fa] dark:bg-zinc-950">
            <Breadcrumbs lang={lang} dict={dict} items={[{ label: lang === 'ar' ? 'المدونات' : 'Blogs' }]} />

            <div className="relative flex-1">

                {/* Hero section - more compact */}
                <section className="relative pt-6 pb-2 overflow-hidden">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center">
                        <div className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[8px] font-black text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mb-1.5 uppercase tracking-[0.2em]">
                            {lang === 'ar' ? 'المدونات' : 'OUR BLOGS'}
                        </div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-black mb-2 tracking-tight text-[#1a6bf5]">
                            {lang === 'ar' ? 'تحليلاتنا وأخبارنا' : 'Our Insights & News'}
                        </h1>
                        <p className="text-[12px] md:text-[13px] text-zinc-500 font-medium max-w-xl mx-auto italic mb-4 leading-tight">
                            {lang === 'ar'
                                ? 'ابقَ على اطلاع دائم بأحدث التطورات في مجال التكنولوجيا والتصميم والأمن السيبراني.'
                                : 'Stay updated with the latest in technology, design, and cybersecurity.'}
                        </p>

                        <BlogFilters
                            lang={lang}
                            dict={dict}
                            {...filtersMetadata}
                            initialFilters={{ search, category, tag }}
                        />
                    </div>
                </section>

                {/* Blogs Grid - Compact gaps */}
                <section className="pb-16 relative">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                        {blogs.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogs.map((blog, index) => (
                                        <div key={blog.id}>
                                            <BlogCard
                                                blog={blog}
                                                lang={lang}
                                                dict={dict}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination - Reduced top margin */}
                                    <div className="flex justify-center mt-12 gap-2.5">
                                        <div className="flex gap-2.5">
                                            {currentPage > 1 && (
                                                <Link
                                                    href={`/${lang}/blogs?page=${currentPage - 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`}
                                                    className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-600 hover:text-blue-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                                >
                                                    {lang === 'ar' ? 'السابق' : 'Previous'}
                                                </Link>
                                            )}
                                            <div className="flex items-center px-6 rounded-2xl bg-blue-600 text-white text-sm font-black shadow-xl shadow-blue-500/20">
                                                {currentPage} / {totalPages}
                                            </div>
                                            {currentPage < totalPages && (
                                                <Link
                                                    href={`/${lang}/blogs?page=${currentPage + 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`}
                                                    className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-600 hover:text-blue-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                                >
                                                    {lang === 'ar' ? 'التالي' : 'Next'}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                            </>
                        ) : (
                            <div className="text-center py-24 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[48px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="mb-8 h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-500">
                                    <i className="fas fa-search text-3xl"></i>
                                </div>
                                <h3 className="text-2xl font-black mb-3 tracking-tight">
                                    {lang === 'ar' ? 'لم يتم العثور على مقالات' : 'No articles found'}
                                </h3>
                                <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed italic">
                                    {lang === 'ar' ? 'حاول تعديل الفلاتر للعثور على ما تبحث عنه.' : 'Try adjusting your filters or search terms to find what you\'re looking for.'}
                                </p>
                                {(search || category || tag) && (
                                    <Link
                                        href={`/${lang}/blogs`}
                                        className="inline-flex mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        {lang === 'ar' ? 'مسح كل الفلاتر' : 'Clear All Filters'}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
