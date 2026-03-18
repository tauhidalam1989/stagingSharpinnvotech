'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminBlogs, deleteBlog, updateBlog } from '@/lib/api';
import { Blog } from '@/lib/api';

export default function BlogListPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const result = await getAdminBlogs({
                page: pagination.page,
                limit: pagination.limit,
                search: search || undefined,
                status: status === 'all' ? undefined : status
            });
            setBlogs(result.blogs);
            setPagination(prev => ({ ...prev, total: result.total }));
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [pagination.page, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchBlogs();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        
        try {
            const res = await deleteBlog(id);
            if (res.success) {
                fetchBlogs();
            } else {
                alert(res.message || 'Error deleting blog');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const togglePublish = async (blog: Blog) => {
        try {
            const res = await updateBlog(blog.id, { isPublished: !blog.isPublished });
            if (res.success) {
                fetchBlogs();
            }
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    const checkBilingual = (blog: Blog) => {
        const hasArTitle = !!blog.titleAr;
        const hasArContent = !!blog.contentAr;
        return hasArTitle && hasArContent;
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Blog Management</h1>
                    <p className="text-xs text-zinc-500 font-medium">Create, edit, and manage your blog posts here.</p>
                </div>
                <Link 
                    href={`/${lang}/dashboard/blogs/new`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all group text-sm"
                >
                    <i className="fas fa-plus text-xs"></i>
                    Add New Post
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div className="flex flex-col md:flex-row gap-3">
                        <form onSubmit={handleSearch} className="relative flex-grow">
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
                            <input 
                                type="text" 
                                placeholder="Search by title..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </form>
                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Title</th>
                                <th className="px-5 py-3 text-center">Language</th>
                                <th className="px-5 py-3">Created At</th>
                                <th className="px-5 py-3">Author</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-5 py-4">
                                            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fas fa-newspaper text-2xl text-zinc-200 dark:text-zinc-800"></i>
                                            <p className="text-xs text-zinc-500 font-medium">No blog posts found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                blog.isPublished 
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${blog.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                                {blog.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{blog.title}</p>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${blog.title ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-zinc-200 dark:bg-zinc-700'}`} title="English Support"></span>
                                                <span className={`w-2 h-2 rounded-full ${checkBilingual(blog) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-200 dark:bg-zinc-700'}`} title="Arabic Support"></span>
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1.5">{checkBilingual(blog) ? 'Bilingual' : 'English Only'}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="text-xs text-zinc-500 font-medium truncate max-w-[120px]">{blog.creator?.name || 'SHARP INNOVATION'}</p>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link 
                                                    href={`/${lang}/dashboard/blogs/${blog.id}`}
                                                    className="p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors"
                                                    title="View"
                                                >
                                                    <i className="fas fa-eye text-xs"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => togglePublish(blog)}
                                                    className={`p-1.5 rounded-lg transition-colors ${blog.isPublished ? 'text-zinc-400 hover:text-amber-500' : 'text-zinc-400 hover:text-emerald-500'}`}
                                                    title={blog.isPublished ? 'Unpublish' : 'Publish'}
                                                >
                                                    <i className={`fas ${blog.isPublished ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                                </button>
                                                <Link 
                                                    href={`/${lang}/dashboard/blogs/edit/${blog.id}`}
                                                    className="p-1.5 text-zinc-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit text-xs"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        Showing {blogs.length} of {pagination.total} entries
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button 
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-50 hover:border-blue-500 transition-all font-bold"
                        >
                            <i className="fas fa-chevron-left text-[10px]"></i>
                        </button>
                        <span className="text-[11px] font-bold text-zinc-900 dark:text-white px-1">Page {pagination.page}</span>
                        <button 
                            disabled={pagination.page * pagination.limit >= pagination.total}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-50 hover:border-blue-500 transition-all font-bold"
                        >
                            <i className="fas fa-chevron-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
