'use client'

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminBlogs, deleteBlog, Blog } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminBlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const loadBlogs = async () => {
        setLoading(true);
        const data = await getAdminBlogs({ page, limit: 10, search });
        setBlogs(data.blogs);
        setTotal(data.total);
        setLoading(false);
    };

    useEffect(() => {
        loadBlogs();
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadBlogs();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            const res = await deleteBlog(id);
            if (res.success) {
                loadBlogs();
            } else {
                alert(res.message || 'Error deleting blog');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Blog Posts</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Manage your website's articles and news.</p>
                    </div>
                    <Link
                        href="/admin/blogs/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-plus" />
                        <span>Create New Post</span>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by title, excerpt..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                        <button type="submit" className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-bold px-10 py-4 rounded-2xl transition-all hover:opacity-90">
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Image</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Title</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={4} className="px-8 py-10 h-24 bg-zinc-50/50 dark:bg-zinc-800/20"></td>
                                        </tr>
                                    ))
                                ) : blogs.length > 0 ? (
                                    blogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="h-16 w-16 relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                                    <Image
                                                        src={blog.featuredImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${blog.featuredImage}` : '/img/placeholder-blog.jpg'}
                                                        alt={blog.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-lg group-hover:text-blue-600 transition-colors">{blog.title}</span>
                                                    <span className="text-zinc-400 text-xs font-medium tracking-tight">/{blog.slug}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${blog.isPublished
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}>
                                                    {blog.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={`/admin/blogs/${blog.id}`}
                                                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="fas fa-edit" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(blog.id)}
                                                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-zinc-500 font-bold">
                                            No blog posts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {total > 10 && (
                        <div className="px-8 py-6 bg-zinc-50/50 dark:bg-zinc-800/10 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <p className="text-sm font-bold text-zinc-500">
                                Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * 10 + 1}</span> to <span className="text-zinc-900 dark:text-white">{Math.min(page * 10, total)}</span> of <span className="text-zinc-900 dark:text-white">{total}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-11 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-sm hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-30"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * 10 >= total}
                                    className="h-11 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-sm hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
