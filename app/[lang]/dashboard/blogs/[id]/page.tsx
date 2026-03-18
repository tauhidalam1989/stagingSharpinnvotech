'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Blog, getBlogBySlug, updateBlog, deleteBlog } from '@/lib/api';

export default function BlogDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
    const { lang, id } = React.use(params);
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // getBlogBySlug handles both slug and ID
                const data = await getBlogBySlug(id);
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleTogglePublish = async () => {
        if (!blog) return;
        const newStatus = !blog.isPublished;
        const res = await updateBlog(blog.id, { isPublished: newStatus });
        if (res.success) {
            setBlog(prev => prev ? { ...prev, isPublished: newStatus } : null);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!blog || !confirm('Are you sure you want to delete this blog?')) return;
        const res = await deleteBlog(blog.id);
        if (res.success) {
            router.push(`/${lang}/dashboard/blogs`);
        } else {
            alert(res.message);
        }
    };

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = API_URL.replace('/v1', '');
        return `${baseUrl}/${path.startsWith('/') ? path.substring(1) : path}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="p-8 text-center text-zinc-500 font-medium">
                Blog post not found.
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
                <div className="flex items-center gap-2.5">
                    <button 
                        onClick={() => router.back()}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <i className="fas fa-arrow-left text-xs"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                blog.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                <span className={`w-1 h-1 rounded-full ${blog.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-2 border-l border-zinc-200 dark:border-zinc-800">
                                Blog #{blog.id}
                            </span>
                        </div>
                        <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none line-clamp-1">{blog.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleTogglePublish}
                        className={`px-3.5 py-2 rounded-lg text-[11px] font-bold transition-all shadow-sm border ${
                            blog.isPublished 
                                ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100/80' 
                                : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/80'
                        }`}
                    >
                        <i className={`fas ${blog.isPublished ? 'fa-eye-slash' : 'fa-eye'} mr-1.5 text-[9px]`}></i>
                        {blog.isPublished ? 'Switch to Draft' : 'Publish Post'}
                    </button>
                    <Link 
                        href={`/${lang}/dashboard/blogs/edit/${blog.id}`}
                        className="px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold hover:opacity-90 transition-all shadow-lg"
                    >
                        <i className="fas fa-edit mr-1.5 text-[9px]"></i>
                        Edit Post
                    </Link>
                    <button 
                        onClick={handleDelete}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-100"
                    >
                        <i className="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Featured Image Banner */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        {blog.featuredImage ? (
                            <div className="aspect-[21/9] w-full bg-zinc-100 dark:bg-zinc-800">
                                <img src={getImageUrl(blog.featuredImage)} alt={blog.featuredImageAlt || blog.title} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="aspect-[21/9] w-full bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center text-blue-200 dark:text-blue-900/50">
                                <i className="fas fa-newspaper text-5xl"></i>
                                <p className="mt-2 font-black uppercase tracking-widest text-[10px]">No Featured Image</p>
                            </div>
                        )}

                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-1.5">
                                    {(blog.categories || []).map((cat, i) => (
                                        <span key={i} className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full text-[9px] font-black uppercase tracking-widest">{cat}</span>
                                    ))}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">{blog.title}</h2>
                                    {blog.titleAr && <h2 className="text-xl font-black text-zinc-500 leading-tight" dir="rtl">{blog.titleAr}</h2>}
                                </div>
                                <div className="flex items-center gap-4 py-3 border-y border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase leading-none">{blog.creator?.name || 'SHARP INNOVATION'}</p>
                                            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Author</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                                            <i className="fas fa-calendar"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase leading-none">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Posted on</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 italic">
                                    <p className="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{blog.excerpt || 'No excerpt provided.'}</p>
                                    {blog.excerptAr && <p className="text-[13px] text-zinc-400 font-medium leading-relaxed text-right mt-3" dir="rtl">{blog.excerptAr}</p>}
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                                    {blog.contentAr && (
                                        <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-right" dir="rtl">
                                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Arabic Version</p>
                                            <div className="text-[13px] text-zinc-400 font-medium leading-relaxed blog-content" dangerouslySetInnerHTML={{ __html: blog.contentAr }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Post Insight</h3>
                        </div>
                        <div className="p-3 space-y-2">
                            <div className="flex flex-col gap-0.5 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Permalink</span>
                                <span className="text-[10px] font-bold text-blue-600 truncate font-mono">/blog/{blog.slug}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Status</span>
                                <span className={`text-[10px] font-black uppercase ${blog.isPublished ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {blog.isPublished ? 'Live on site' : 'Draft / Hidden'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">SEO metadata</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">Meta Title</p>
                                <p className="text-[11px] font-bold text-zinc-900 dark:text-white leading-tight">{blog.metaTitle || 'Not set'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">Meta Description</p>
                                <p className="text-[11px] font-medium text-zinc-500 leading-normal line-clamp-2">{blog.metaDescription || 'No description for search engines.'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">Keywords</p>
                                <div className="flex flex-wrap gap-1">
                                    {(blog.metaKeywords || '').split(',').map((k: string, i: number) => k && (
                                        <span key={i} className="px-1.5 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-[9px] text-zinc-500 rounded border border-zinc-100 dark:border-zinc-700 font-medium">{k.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {blog.gallery && blog.gallery.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="p-3 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Gallery Items</h3>
                            </div>
                            <div className="p-3 grid grid-cols-3 gap-1.5">
                                {blog.gallery.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                                        <img src={getImageUrl(img)} alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .blog-content :global(h1), .blog-content :global(h2), .blog-content :global(h3) {
                    font-weight: 900;
                    color: var(--zinc-900);
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .blog-content :global(p) {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                .blog-content :global(img) {
                    border-radius: 1.5rem;
                    margin: 2rem 0;
                }
            `}</style>
        </div>
    );
}
