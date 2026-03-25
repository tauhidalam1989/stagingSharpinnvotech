import React, { Suspense } from 'react';
import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getPublishedBlogs, getBlogFiltersMetadata } from "@/lib/api";
import BlogHero from "@/components/blogs/BlogHero";
import BlogListingClient from "@/components/blogs/BlogListingClient";
import BlogSectors from "@/components/blogs/BlogSectors";
import BlogCTA from "@/components/blogs/BlogCTA";

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
    const pageSize = 9;

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

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Premium Hero Section with Quick Filter Grid */}
            <BlogHero 
                lang={lang} 
                dict={dict} 
                categories={filtersMetadata.categories}
                categoriesAr={filtersMetadata.categoriesAr}
            />

            {/* Client-side Listing & Filtering with Sticky Bar */}
            <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>}>
                <BlogListingClient 
                    lang={lang}
                    dict={dict}
                    blogs={blogs}
                    total={total}
                    {...filtersMetadata}
                    initialFilters={{
                        search,
                        category,
                        tag,
                        page: currentPage
                    }}
                />
            </Suspense>

            {/* Target Segments / Who we write for */}
            <BlogSectors lang={lang} dict={dict} />

            {/* Final CTA Section */}
            <BlogCTA lang={lang} dict={dict} />
        </main>
    );
}
