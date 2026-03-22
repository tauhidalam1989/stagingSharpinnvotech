'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog, updateBlog, Blog } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface BlogFormProps {
    blog?: Blog;
    isEdit?: boolean;
}

export default function BlogForm({ blog, isEdit }: BlogFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const ensureArray = (val: string[] | string | undefined): string[] => {
        if (Array.isArray(val)) return val.length > 0 ? val : [''];
        if (typeof val === 'string' && val.trim()) return val.split(',').map(v => v.trim()).filter(Boolean);
        return [''];
    };

    interface FormDataState {
        title: string;
        titleAr: string;
        slug: string;
        excerpt: string;
        excerptAr: string;
        content: string;
        contentAr: string;
        isPublished: boolean;
        categories: string[];
        categoriesAr: string[];
        tags: string[];
        tagsAr: string[];
    }

    const [formData, setFormData] = useState<FormDataState>({
        title: blog?.title || '',
        titleAr: blog?.titleAr || '',
        slug: blog?.slug || '',
        excerpt: blog?.excerpt || '',
        excerptAr: blog?.excerptAr || '',
        content: blog?.content || '',
        contentAr: blog?.contentAr || '',
        isPublished: blog?.isPublished || false,
        categories: ensureArray(blog?.categories),
        categoriesAr: ensureArray(blog?.categoriesAr),
        tags: ensureArray(blog?.tags),
        tagsAr: ensureArray(blog?.tagsAr),
    });

    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        blog?.featuredImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${blog.featuredImage}` : null
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleArrayChange = (type: 'categories' | 'categoriesAr' | 'tags' | 'tagsAr', index: number, value: string) => {
        setFormData(prev => {
            const next = [...prev[type]];
            next[index] = value;
            return { ...prev, [type]: next };
        });
    };

    const addArrayItem = (type: 'categories' | 'categoriesAr' | 'tags' | 'tagsAr') => {
        setFormData(prev => ({ ...prev, [type]: [...prev[type], ''] }));
    };

    const removeArrayItem = (type: 'categories' | 'categoriesAr' | 'tags' | 'tagsAr', index: number) => {
        setFormData(prev => ({ ...prev, [type]: prev[type].filter((_: string, i: number) => i !== index) }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFeaturedImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.filter(v => v.trim()).forEach((v, i) => data.append(`${key}[${i}]`, v));
            } else {
                data.append(key, value.toString());
            }
        });

        if (featuredImage) {
            data.append('featuredImage', featuredImage);
        }

        const res = isEdit && blog ? await updateBlog(blog.id, data) : await createBlog(data);

        if (res.success) {
            router.push('/admin/blogs');
        } else {
            setError(res.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">{isEdit ? 'Edit Post' : 'New Blog Post'}</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Draft and publish your latest articles.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-save" />}
                            <span>{isEdit ? 'Update Post' : 'Publish Post'}</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-400/10 border border-red-400/20 rounded-[32px] text-red-400 font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Language Tabs */}
                        <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'en' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-500'}`}
                            >
                                English Content
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ar')}
                                className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'ar' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-500'}`}
                            >
                                Arabic Content
                            </button>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8">
                            {activeTab === 'en' ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Post Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter interesting title..."
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Excerpt (Brief Summary)</label>
                                        <textarea
                                            name="excerpt"
                                            value={formData.excerpt}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="A short summary of the post..."
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Article Content</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            required
                                            rows={15}
                                            placeholder="Write your article here..."
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2" dir="rtl">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">عنوان المقال</label>
                                        <input
                                            type="text"
                                            name="titleAr"
                                            value={formData.titleAr}
                                            onChange={handleInputChange}
                                            placeholder="أدخل عنواناً جذاباً..."
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">ملخص موجز</label>
                                        <textarea
                                            name="excerptAr"
                                            value={formData.excerptAr}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="ملخص قصير للمقال..."
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">محتوى المقال</label>
                                        <textarea
                                            name="contentAr"
                                            value={formData.contentAr}
                                            onChange={handleInputChange}
                                            rows={15}
                                            placeholder="اكتب مقالك هنا..."
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Settings */}
                    <div className="space-y-8">
                        {/* URL Slug */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">URL Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-3 px-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="h-5 w-5 rounded-lg border-zinc-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isPublished" className="text-sm font-bold">Publish Post</label>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Featured Image</label>
                            <div className="relative aspect-video bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center group cursor-pointer">
                                {preview ? (
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                                        <i className="fas fa-image text-3xl" />
                                        <span className="text-xs font-bold">Click to Upload</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Categories & Tags */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2 flex justify-between">
                                    Categories
                                    <button type="button" onClick={() => addArrayItem('categories')} className="text-blue-600 hover:underline">Add</button>
                                </label>
                                {formData.categories.map((cat, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={cat}
                                            onChange={(e) => handleArrayChange('categories', i, e.target.value)}
                                            className="flex-grow bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2 font-medium text-sm"
                                        />
                                        <button type="button" onClick={() => removeArrayItem('categories', i)} className="text-red-400 p-2"><i className="fas fa-times" /></button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2 flex justify-between">
                                    Tags
                                    <button type="button" onClick={() => addArrayItem('tags')} className="text-blue-600 hover:underline">Add</button>
                                </label>
                                {formData.tags.map((tag, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={tag}
                                            onChange={(e) => handleArrayChange('tags', i, e.target.value)}
                                            className="flex-grow bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2 font-medium text-sm"
                                        />
                                        <button type="button" onClick={() => removeArrayItem('tags', i)} className="text-red-400 p-2"><i className="fas fa-times" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
