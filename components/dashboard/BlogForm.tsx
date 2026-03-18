'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog, updateBlog, ApiResponse, Blog } from '@/lib/api';
import RichTextEditor from './RichTextEditor';

interface BlogFormProps {
    lang: string;
    id?: number;
    initialData?: any;
}

export default function BlogForm({ lang, id, initialData }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(id ? true : false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Form state corresponding to Angular blog-form.component.ts
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        slug: '',
        excerpt: '',
        excerptAr: '',
        content: '',
        contentAr: '',
        isPublished: true,
        categories: [''],
        categoriesAr: [''],
        tags: [''],
        tagsAr: [''],
        featuredImageAlt: '',
        featuredImageAltAr: '',
        galleryAlt: '',
        galleryAltAr: '',
        metaTitle: '',
        metaTitleAr: '',
        metaDescription: '',
        metaDescriptionAr: '',
        metaKeywords: '',
        metaKeywordsAr: '',
    });

    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    
    const featuredInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                categories: initialData.categories?.length ? initialData.categories : [''],
                categoriesAr: initialData.categoriesAr?.length ? initialData.categoriesAr : [''],
                tags: initialData.tags?.length ? initialData.tags : [''],
                tagsAr: initialData.tagsAr?.length ? initialData.tagsAr : [''],
            });
            if (initialData.featuredImage) {
                // Determine if featuredImage is a path or base64
                setFeaturedImagePreview(getImageUrl(initialData.featuredImage));
            }
            if (initialData.gallery) {
                setGalleryPreviews(initialData.gallery.map((img: string) => getImageUrl(img)));
            }
            setLoading(false);
        }
    }, [initialData]);

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        const separator = path.startsWith('/') ? '' : '/';
        return `${baseUrl}${separator}${path}`;
    };

    const generateSlug = () => {
        if (!formData.slug && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleArrayChange = (name: string, index: number, value: string) => {
        const newArray = [...(formData as any)[name]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [name]: newArray }));
    };

    const addArrayItem = (name: string) => {
        setFormData(prev => ({ ...prev, [name]: [...(formData as any)[name], ''] }));
    };

    const removeArrayItem = (name: string, index: number) => {
        const newArray = [...(formData as any)[name]].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [name]: newArray.length ? newArray : [''] }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'gallery') => {
        if (e.target.files && e.target.files.length > 0) {
            if (type === 'featured') {
                const file = e.target.files[0];
                setFeaturedImage(file);
                const reader = new FileReader();
                reader.onloadend = () => setFeaturedImagePreview(reader.result as string);
                reader.readAsDataURL(file);
            } else {
                const files = Array.from(e.target.files);
                // We add new files to the upload queue
                setGalleryImages(prev => [...prev, ...files]);
                // And generate previews for them
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => setGalleryPreviews(prev => [...prev, reader.result as string]);
                    reader.readAsDataURL(file);
                });
            }
        }
    };

    const removeGalleryPreview = (index: number) => {
        // Find if this preview belongs to an existing image or a newly uploaded one
        // This is tricky without tracking which is which, but for simplicity:
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        // We might also need to remove it from galleryImages if it was newly uploaded
        // but since we append to FormData, it's safer to just handle it in state.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const data = new FormData();
        
        // Append all fields from formData, excluding forbidden metadata
        const forbiddenFields = ['id', 'createdAt', 'updatedAt', 'views', 'likes', 'shares', 'creator', 'updater', 'readingTime', 'createdBy', 'updatedBy', 'userId', 'gallery', 'featuredImage'];
        Object.entries(formData).forEach(([key, value]) => {
            if (forbiddenFields.includes(key)) return;
            
            if (Array.isArray(value)) {
                // Filter out empty strings from arrays
                const filtered = value.filter(v => typeof v === 'string' ? v.trim() !== '' : true);
                filtered.forEach(v => data.append(`${key}[]`, String(v)));
            } else if (value !== null && value !== undefined) {
                data.append(key, String(value));
            }
        });

        if (featuredImage) {
            data.append('featuredImage', featuredImage);
        }
        
        galleryImages.forEach(file => {
            data.append('gallery', file);
        });

        try {
            let res;
            if (id) {
                res = await updateBlog(id, data);
            } else {
                res = await createBlog(data);
            }

            if (res.success) {
                router.push(`/${lang}/dashboard/blogs`);
            } else {
                setError(res.message || 'Error saving blog');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-32">
            {/* Header Actions */}
            <div className="flex items-center justify-between sticky top-0 z-40 bg-[#f8fbff]/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 transition-all">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        {id ? 'Edit Blog Post' : 'Create New Post'}
                    </h1>
                    <p className="text-zinc-500 font-medium text-sm">Fill in the details for your blog post.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-50 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 text-sm flex items-center gap-2"
                    >
                        {submitting && <i className="fas fa-spinner fa-spin"></i>}
                        {submitting ? 'Saving...' : (id ? 'Update Post' : 'Create Post')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-bold flex items-center gap-3 animate-shake">
                    <i className="fas fa-exclamation-circle text-lg"></i>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <i className="fas fa-file-alt text-xs"></i>
                             </div>
                             <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Basic Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Title (English) *</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    onBlur={generateSlug}
                                    required
                                    placeholder="Enter blog post title"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Title (Arabic)</label>
                                <input
                                    name="titleAr"
                                    value={formData.titleAr}
                                    onChange={handleFormChange}
                                    dir="rtl"
                                    placeholder="أدخل عنوان مقال المدونة"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Slug *</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="url-slug-here"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                />
                                <p className="mt-2 text-[10px] text-zinc-400 font-medium">Lowercase letters, numbers, and hyphens only.</p>
                            </div>
                        </div>
                    </div>

                    {/* Excerpts Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <i className="fas fa-align-left text-xs"></i>
                             </div>
                             <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Excerpt / Summary</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Excerpt (English)</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleFormChange}
                                    rows={3}
                                    placeholder="Brief summary of the post"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Excerpt (Arabic)</label>
                                <textarea
                                    name="excerptAr"
                                    value={formData.excerptAr}
                                    onChange={handleFormChange}
                                    rows={3}
                                    dir="rtl"
                                    placeholder="ملخص موجز للمقالة"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-right"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <i className="fas fa-pen-nib text-xs"></i>
                             </div>
                             <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Blog Content</h2>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Content (English) *</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                    placeholder="Write your blog content here..."
                                    galleryImages={galleryPreviews}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Content (Arabic)</label>
                                <RichTextEditor
                                    value={formData.contentAr}
                                    onChange={(val) => setFormData(prev => ({ ...prev, contentAr: val }))}
                                    placeholder="اكتب محتوى مدونتك هنا..."
                                    galleryImages={galleryPreviews}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <i className="fas fa-search text-xs"></i>
                             </div>
                             <h2 className="text-lg font-bold text-zinc-900 dark:text-white">SEO Optimizations</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* English SEO */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">English Metadata</h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Meta Title</label>
                                    <input name="metaTitle" value={formData.metaTitle} onChange={handleFormChange} placeholder="Main SEO Title" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Meta Description</label>
                                    <textarea name="metaDescription" value={formData.metaDescription} onChange={handleFormChange} rows={3} placeholder="Meta description for search results" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Meta Keywords</label>
                                    <input name="metaKeywords" value={formData.metaKeywords} onChange={handleFormChange} placeholder="keyword1, keyword2..." className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                                </div>
                            </div>
                            
                            {/* Arabic SEO */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest text-right">إعدادات محركات البحث</h3>
                                <div dir="rtl">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 mr-1 text-right">عنوان SEO</label>
                                    <input name="metaTitleAr" value={formData.metaTitleAr} onChange={handleFormChange} placeholder="عنوان محرك البحث" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-right" />
                                </div>
                                <div dir="rtl">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 mr-1 text-right">وصف SEO</label>
                                    <textarea name="metaDescriptionAr" value={formData.metaDescriptionAr} onChange={handleFormChange} rows={3} placeholder="وصف محرك البحث" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none text-right" />
                                </div>
                                <div dir="rtl">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 mr-1 text-right">الكلمات المفتاحية</label>
                                    <input name="metaKeywordsAr" value={formData.metaKeywordsAr} onChange={handleFormChange} placeholder="كلمة1, كلمة2..." className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-md font-bold text-zinc-900 dark:text-white">Publish Status</h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleFormChange}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <div className={`w-2 h-2 rounded-full ${formData.isPublished ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`}></div>
                                <span className={formData.isPublished ? 'text-green-600' : 'text-amber-600'}>
                                    {formData.isPublished ? 'Published' : 'Draft Mode'}
                                </span>
                             </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium italic">
                            {formData.isPublished ? 'Live on the website immediately.' : 'Saved internally, not visible to public.'}
                        </p>
                    </div>

                    {/* Featured Image Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-md font-bold text-zinc-900 dark:text-white">Featured Image</h2>
                            <button type="button" onClick={() => featuredInputRef.current?.click()} className="text-blue-600 text-xs font-bold hover:underline">
                                {featuredImagePreview ? 'Change' : 'Upload'}
                            </button>
                        </div>
                        
                        <div className="relative aspect-[4/3] bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
                            {featuredImagePreview ? (
                                <img src={featuredImagePreview} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-center p-4">
                                    <i className="fas fa-image text-2xl text-zinc-300 mb-2"></i>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Thumbnail Image</p>
                                </div>
                            )}
                            <input type="file" ref={featuredInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'featured')} />
                        </div>

                        {/* Alt Tags for Featured Image */}
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 ml-1">Alt Text (EN)</label>
                                <input name="featuredImageAlt" value={formData.featuredImageAlt} onChange={handleFormChange} placeholder="e.g. Modern UI design" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none" />
                            </div>
                            <div dir="rtl">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 mr-1 text-right">الاسم البديل للصورة</label>
                                <input name="featuredImageAltAr" value={formData.featuredImageAltAr} onChange={handleFormChange} placeholder="مثال: تصميم واجهة حديث" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none text-right" />
                            </div>
                        </div>
                    </div>

                    {/* Gallery Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-md font-bold text-zinc-900 dark:text-white">Image Gallery</h2>
                            <button type="button" onClick={() => galleryInputRef.current?.click()} className="text-blue-600 text-xs font-bold hover:underline">
                                <i className="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            {galleryPreviews.map((pre, i) => (
                                <div key={i} className="relative aspect-square bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
                                    <img src={pre} className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeGalleryPreview(i)} 
                                        className="absolute inset-0 bg-red-600/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <i className="fas fa-trash-alt text-xs"></i>
                                    </button>
                                </div>
                            ))}
                            {galleryPreviews.length === 0 && (
                                <div className="col-span-3 py-6 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">No images added</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={galleryInputRef} className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'gallery')} />

                        <div className="space-y-4 pt-2 border-t border-zinc-50 dark:border-zinc-800">
                            <div>
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 ml-1">Gallery Alt (EN)</label>
                                <input name="galleryAlt" value={formData.galleryAlt} onChange={handleFormChange} placeholder="Desktop app screenshots" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none" />
                            </div>
                            <div dir="rtl">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 mr-1 text-right">الاسم البديل للمعرض</label>
                                <input name="galleryAltAr" value={formData.galleryAltAr} onChange={handleFormChange} placeholder="لقطات شاشة للتطبيق" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none text-right" />
                            </div>
                        </div>
                    </div>

                    {/* Categories Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Categories (EN)</h2>
                                <button type="button" onClick={() => addArrayItem('categories')} className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <i className="fas fa-plus text-[8px]"></i>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.categories.map((cat, i) => (
                                    <div key={i} className="flex gap-2 group">
                                        <input 
                                            value={cat} 
                                            onChange={(e) => handleArrayChange('categories', i, e.target.value)} 
                                            placeholder="e.g. Technology"
                                            className="flex-grow bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs focus:outline-none" 
                                        />
                                        <button type="button" onClick={() => removeArrayItem('categories', i)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i className="fas fa-times-circle text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                            <div className="flex items-center justify-between" dir="rtl">
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">الفئات (Arabic)</h2>
                                <button type="button" onClick={() => addArrayItem('categoriesAr')} className="w-5 h-5 rounded-md bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                                    <i className="fas fa-plus text-[8px]"></i>
                                </button>
                            </div>
                            <div className="space-y-2" dir="rtl">
                                {formData.categoriesAr.map((cat, i) => (
                                    <div key={i} className="flex gap-2 group">
                                        <input 
                                            value={cat} 
                                            onChange={(e) => handleArrayChange('categoriesAr', i, e.target.value)} 
                                            placeholder="مثل: تكنولوجيا"
                                            className="flex-grow bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs focus:outline-none text-right" 
                                        />
                                        <button type="button" onClick={() => removeArrayItem('categoriesAr', i)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i className="fas fa-times-circle text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tags Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Tags (EN)</h2>
                                <button type="button" onClick={() => addArrayItem('tags')} className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <i className="fas fa-plus text-[8px]"></i>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, i) => (
                                    <div key={i} className="flex items-center bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 group">
                                        <input 
                                            value={tag} 
                                            onChange={(e) => handleArrayChange('tags', i, e.target.value)} 
                                            placeholder="tag"
                                            className="bg-transparent text-[10px] font-bold text-zinc-600 focus:outline-none w-16" 
                                        />
                                        <button type="button" onClick={() => removeArrayItem('tags', i)} className="ml-1 text-zinc-300 hover:text-red-500">
                                            <i className="fas fa-times text-[8px]"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                            <div className="flex items-center justify-between" dir="rtl">
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">الوسوم (Arabic)</h2>
                                <button type="button" onClick={() => addArrayItem('tagsAr')} className="w-5 h-5 rounded-md bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                                    <i className="fas fa-plus text-[8px]"></i>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2" dir="rtl">
                                {formData.tagsAr.map((tag, i) => (
                                    <div key={i} className="flex items-center bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 group">
                                        <input 
                                            value={tag} 
                                            onChange={(e) => handleArrayChange('tagsAr', i, e.target.value)} 
                                            placeholder="وسم"
                                            className="bg-transparent text-[10px] font-bold text-zinc-600 focus:outline-none w-16 text-right" 
                                        />
                                        <button type="button" onClick={() => removeArrayItem('tagsAr', i)} className="mr-1 text-zinc-300 hover:text-red-500">
                                            <i className="fas fa-times text-[8px]"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </form>
    );
}
