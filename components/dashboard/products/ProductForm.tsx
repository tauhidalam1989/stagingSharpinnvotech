'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Product, 
    ProductCategory, 
    getProductCategories, 
    createProduct, 
    updateProduct,
    HowItWorkItem,
    VisionItem,
    BenefitItem,
    FAQItem,
    ProductFeatureItem
} from '@/lib/api';

interface ProductFormProps {
    lang: string;
    product?: Product;
    isEdit?: boolean;
}

type TabType = 'basic' | 'hero' | 'about' | 'howItWorks' | 'features' | 'benefits' | 'vision' | 'whySharp' | 'cta' | 'faq' | 'seo' | 'gallery';

export default function ProductForm({ lang, product, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('basic');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [previews, setPreviews] = useState<{ [key: string]: string | string[] }>({});
    const [files, setFiles] = useState<{ [key: string]: File | File[] }>({});

    const DEFAULT_FORM_DATA: Partial<Product> = {
        title: '',
        titleAr: '',
        slug: '',
        categoryId: undefined,
        cardIcon: 'fas fa-cog',
        shortDescription: '',
        shortDescriptionAr: '',
        order: 0,
        isPublished: false,
        heroTitle: '',
        heroTitleAr: '',
        heroSubtitle: '',
        heroSubtitleAr: '',
        heroDescription: '',
        heroDescriptionAr: '',
        heroIcon: '',
        heroImageAlt: '',
        heroImageAltAr: '',
        heroPrimaryCtaText: '',
        heroPrimaryCtaTextAr: '',
        heroPrimaryCtaLink: '',
        heroSecondaryCtaText: '',
        heroSecondaryCtaTextAr: '',
        heroSecondaryCtaLink: '',
        aboutTitle: '',
        aboutTitleAr: '',
        aboutContent: '',
        aboutContentAr: '',
        aboutImage: '',
        aboutImageAlt: '',
        aboutImageAltAr: '',
        keyFeaturesTitle: '',
        keyFeaturesTitleAr: '',
        keyFeaturesImageAlt: '',
        keyFeaturesImageAltAr: '',
        visionTitle: '',
        visionTitleAr: '',
        visionSubtitle: '',
        visionSubtitleAr: '',
        visionItems: [],
        whySharpTitle: '',
        whySharpTitleAr: '',
        whySharpContent: '',
        whySharpContentAr: '',
        whySharpImage: '',
        whySharpImageAlt: '',
        whySharpImageAltAr: '',
        ctaTitle: '',
        ctaTitleAr: '',
        ctaDescription: '',
        ctaDescriptionAr: '',
        ctaButton1Text: '',
        ctaButton1TextAr: '',
        ctaButton1Link: '',
        ctaButton2Text: '',
        ctaButton2TextAr: '',
        ctaButton2Link: '',
        metaTitle: '',
        metaTitleAr: '',
        metaDescription: '',
        metaDescriptionAr: '',
        metaKeywords: '',
        metaKeywordsAr: '',
        howItWorks: [],
        keyFeaturesList: [],
        keyFeaturesListAr: [],
        benefits: [],
        faqs: [],
        keyFeaturesImages: [],
        gallery: [],
        galleryAlt: '',
        galleryAltAr: ''
    };

    const sanitizeData = (data: any) => {
        const sanitized = { ...DEFAULT_FORM_DATA, ...data };
        Object.keys(sanitized).forEach(key => {
            if (sanitized[key] === null || sanitized[key] === undefined) {
                if (Array.isArray(DEFAULT_FORM_DATA[key as keyof Product])) {
                    sanitized[key] = [];
                } else if (typeof DEFAULT_FORM_DATA[key as keyof Product] === 'string') {
                    sanitized[key] = '';
                }
            }
        });
        return sanitized;
    };

    const [formData, setFormData] = useState<Partial<Product>>(() => {
        return product ? sanitizeData(product) : DEFAULT_FORM_DATA;
    });

    useEffect(() => {
        const fetchCats = async () => {
            const cats = await getProductCategories();
            setCategories(cats);
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData(sanitizeData(product));
            
            // Initialize previews for existing images
            const initialPreviews: { [key: string]: string | string[] } = {};
            if (product.heroIcon && (product.heroIcon.includes('/') || product.heroIcon.includes('.'))) {
                initialPreviews.heroIcon = getImageUrl(product.heroIcon);
            }
            if (product.aboutImage) initialPreviews.aboutImage = getImageUrl(product.aboutImage);
            if (product.whySharpImage) initialPreviews.whySharpImage = getImageUrl(product.whySharpImage);
            if (product.keyFeaturesImages) initialPreviews.keyFeaturesImages = product.keyFeaturesImages.map(img => getImageUrl(img));
            if (product.gallery) initialPreviews.gallery = product.gallery.map(img => getImageUrl(img));
            setPreviews(initialPreviews);
        }
    }, [product]);

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = API_URL.replace('/v1', '');
        return `${baseUrl}/${path.startsWith('/') ? path.substring(1) : path}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, multiple = false) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        if (multiple) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prev => ({ ...prev, [field]: [...((prev[field] as File[]) || []), ...newFiles] }));
            
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => ({ ...prev, [field]: [...((prev[field] as string[]) || []), ...newPreviews] }));
        } else {
            const file = selectedFiles[0];
            setFiles(prev => ({ ...prev, [field]: file }));
            setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        }
    };

    const removeFile = (field: string, index?: number) => {
        if (index !== undefined) { // Multiple files (e.g., gallery, keyFeaturesImages)
            const currentPreviews = (previews[field] as string[]) || [];
            const previewToRemove = currentPreviews[index];

            // 1. Update previews state first
            setPreviews(prev => {
                const updatedPreviews = [...((prev[field] as string[]) || [])];
                const item = updatedPreviews[index];
                if (item && item.startsWith('blob:')) {
                    URL.revokeObjectURL(item);
                }
                updatedPreviews.splice(index, 1);
                return { ...prev, [field]: updatedPreviews };
            });

            // 2. Update files state (only for newly added files)
            setFiles(prev => {
                const currentFiles = (prev[field] as File[]) || [];
                const currentPreviewsForCheck = (previews[field] as string[]) || [];
                const item = currentPreviewsForCheck[index];

                if (item && item.startsWith('blob:')) {
                    // Find the index of this blob in the list of all blobs for this field
                    // Because `files[field]` only stores the File objects for blob previews
                    let blobIndex = 0;
                    for (let i = 0; i < index; i++) {
                        if (currentPreviewsForCheck[i]?.startsWith('blob:')) {
                            blobIndex++;
                        }
                    }
                    const updatedFiles = [...currentFiles];
                    updatedFiles.splice(blobIndex, 1);
                    return { ...prev, [field]: updatedFiles };
                }
                return prev;
            });

            // 3. Update formData state (for existing image paths)
            setFormData(prev => {
                const currentPreviewsForCheck = (previews[field] as string[]) || [];
                const item = currentPreviewsForCheck[index];
                
                if (item && !item.startsWith('blob:')) {
                    const currentPaths = (prev[field as keyof Product] as string[]) || [];
                    // We need to find the original path that matches this preview URL
                    const updatedPaths = currentPaths.filter(path => getImageUrl(path) !== item);
                    return { ...prev, [field]: updatedPaths };
                }
                return prev;
            });

        } else { // Single file (e.g., heroIcon, aboutImage)
            const previewToRemove = previews[field];
            if (previewToRemove && typeof previewToRemove === 'string' && previewToRemove.startsWith('blob:')) {
                URL.revokeObjectURL(previewToRemove);
            }

            setFiles(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
            setPreviews(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
            // Clear the field from formData to indicate it should be removed/unset on backend
            setFormData(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleArrayChange = (index: number, field: string, subfield: string, value: string) => {
        setFormData(prev => {
            const arr = [...(prev[field as keyof Product] as any[])];
            arr[index] = { ...arr[index], [subfield]: value };
            return { ...prev, [field]: arr };
        });
    };

    const addArrayItem = (field: string, defaultObj: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field as keyof Product] as any[] || []), defaultObj]
        }));
    };

    const removeArrayItem = (index: number, field: string) => {
        setFormData(prev => {
            const arr = [...(prev[field as keyof Product] as any[])];
            arr.splice(index, 1);
            return { ...prev, [field]: arr };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            
            // Fields that are arrays of objects and need JSON.stringify
            const jsonFields = ['howItWorks', 'keyFeaturesList', 'keyFeaturesListAr', 'benefits', 'visionItems', 'faqs'];
            
            // File fields (single and multiple)
            const singleFileFields = ['heroIcon', 'aboutImage', 'whySharpImage'];
            const multipleFileFields = ['keyFeaturesImages', 'gallery'];

            // Fields to skip (internal or non-updatable)
            const skipFields = ['id', 'category', 'views', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'creator', 'updater', 'updator', 'deletedAt', 'publishedAt'];

            Object.keys(formData).forEach(key => {
                const value = formData[key as keyof Product];
                if (value === undefined || value === null || skipFields.includes(key)) return;

                // Handle JSON fields
                if (jsonFields.includes(key) && Array.isArray(value)) {
                    const validItems = value.filter((item: any) => {
                        return item && Object.values(item).some(val => val?.toString().trim());
                    });
                    submitData.append(key, JSON.stringify(validItems));
                }
                // Handle single file fields
                else if (singleFileFields.includes(key)) {
                    // If a new file is uploaded for this field, it will be in `files` state.
                    // Otherwise, if it's an existing path (string), append it.
                    if (!files[key] && typeof value === 'string') {
                        submitData.append(key, value);
                    }
                    // New file will be appended later from `files` state
                }
                // Handle multiple file fields (existing paths)
                else if (multipleFileFields.includes(key)) {
                    if (isEdit && Array.isArray(value)) {
                        // For existing images, send them as a separate field (e.g., existingGallery)
                        // This allows the backend to know which files to keep. 
                        // Empty array indicates all existing images were removed.
                        submitData.append(`existing${key.charAt(0).toUpperCase() + key.slice(1)}`, JSON.stringify(value));
                    }
                    // New files for these fields will be appended later from `files` state
                }
                // Handle all other basic fields
                else {
                    const stringVal = value.toString();
                    submitData.append(key, stringVal);
                }
            });

            // Append new files from the `files` state
            Object.keys(files).forEach(key => {
                const value = files[key];
                if (Array.isArray(value)) {
                    value.forEach(file => submitData.append(key, file));
                } else if (value instanceof File) {
                    submitData.append(key, value);
                }
            });

            let res;
            if (isEdit && product) {
                res = await updateProduct(product.id, submitData);
            } else {
                res = await createProduct(submitData);
            }

            if (res.success) {
                router.push(`/${lang}/dashboard/products`);
            } else {
                alert(res.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Internal server error');
        } finally {
            setLoading(false);
        }
    };

    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'basic', label: 'Basic Info', icon: 'fa-info-circle' },
        { id: 'hero', label: 'Hero Section', icon: 'fa-star' },
        { id: 'about', label: 'About', icon: 'fa-file-alt' },
        { id: 'howItWorks', label: 'How It Works', icon: 'fa-cogs' },
        { id: 'features', label: 'Key Features', icon: 'fa-list' },
        { id: 'benefits', label: 'Benefits', icon: 'fa-gift' },
        { id: 'vision', label: 'Vision', icon: 'fa-eye' },
        { id: 'whySharp', label: 'Why Sharp', icon: 'fa-building' },
        { id: 'cta', label: 'CTA', icon: 'fa-bullhorn' },
        { id: 'faq', label: 'FAQ', icon: 'fa-question-circle' },
        { id: 'seo', label: 'SEO', icon: 'fa-search' },
        { id: 'gallery', label: 'Gallery', icon: 'fa-images' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        {isEdit ? 'Edit Product' : 'Create New Product'}
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-tight">
                        {isEdit ? `Editing: ${product?.title}` : 'Fill in the details to add a new product.'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 text-sm"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                        {isEdit ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Horizontal Tabs Navigation */}
                <div className="w-full">
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-3 flex flex-wrap gap-2 shadow-sm sticky top-20 z-20 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                    activeTab === tab.id 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                        : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                <i className={`fas ${tab.icon} text-base`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content - Full Width */}
                <div className="w-full">
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm min-h-[500px]">
                        {activeTab === 'basic' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Title (English) *</label>
                                        <input 
                                            type="text" 
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="e.g., Smart Surveillance"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Title (Arabic)</label>
                                        <input 
                                            type="text" 
                                            name="titleAr"
                                            value={formData.titleAr}
                                            onChange={handleInputChange}
                                            dir="rtl"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="المراقبة الذكية"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Slug *</label>
                                        <input 
                                            type="text" 
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="smart-surveillance"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Card Icon</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                name="cardIcon"
                                                value={formData.cardIcon}
                                                onChange={handleInputChange}
                                                className="flex-grow bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="fas fa-cog"
                                            />
                                            <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xl text-zinc-400">
                                                <i className={formData.cardIcon || 'fas fa-question'}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Category</label>
                                        <select 
                                            name="categoryId"
                                            value={formData.categoryId || ''}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Order</label>
                                        <input 
                                            type="number" 
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Short Description (EN)</label>
                                        <textarea 
                                            name="shortDescription"
                                            value={formData.shortDescription}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Short Description (AR)</label>
                                        <textarea 
                                            name="shortDescriptionAr"
                                            value={formData.shortDescriptionAr}
                                            onChange={handleInputChange}
                                            rows={2}
                                            dir="rtl"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                    <input 
                                        type="checkbox"
                                        id="isPublished"
                                        name="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleInputChange as any}
                                        className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isPublished" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                        Publish immediately (Visible on website)
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'hero' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Hero Title (EN)</label>
                                        <input 
                                            type="text" 
                                            name="heroTitle"
                                            value={formData.heroTitle}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Hero Title (AR)</label>
                                        <input 
                                            type="text" 
                                            name="heroTitleAr"
                                            value={formData.heroTitleAr}
                                            onChange={handleInputChange}
                                            dir="rtl"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Hero Subtitle (EN)</label>
                                        <input 
                                            type="text" 
                                            name="heroSubtitle"
                                            value={formData.heroSubtitle}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Hero Subtitle (AR)</label>
                                        <input 
                                            type="text" 
                                            name="heroSubtitleAr"
                                            value={formData.heroSubtitleAr}
                                            onChange={handleInputChange}
                                            dir="rtl"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Hero Description (EN)</label>
                                        <textarea 
                                            name="heroDescription"
                                            value={formData.heroDescription}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Hero Description (AR)</label>
                                        <textarea 
                                            name="heroDescriptionAr"
                                            value={formData.heroDescriptionAr}
                                            onChange={handleInputChange}
                                            rows={2}
                                            dir="rtl"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 mt-2">
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                            <i className="fas fa-link"></i> Primary Button
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" name="heroPrimaryCtaText" value={formData.heroPrimaryCtaText} onChange={handleInputChange} placeholder="Text (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                            <input type="text" name="heroPrimaryCtaTextAr" value={formData.heroPrimaryCtaTextAr} onChange={handleInputChange} dir="rtl" placeholder="نص (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                        </div>
                                        <input type="text" name="heroPrimaryCtaLink" value={formData.heroPrimaryCtaLink} onChange={handleInputChange} placeholder="Link / URL" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <i className="fas fa-external-link-alt"></i> Secondary Button
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" name="heroSecondaryCtaText" value={formData.heroSecondaryCtaText} onChange={handleInputChange} placeholder="Text (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                            <input type="text" name="heroSecondaryCtaTextAr" value={formData.heroSecondaryCtaTextAr} onChange={handleInputChange} dir="rtl" placeholder="نص (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                        </div>
                                        <input type="text" name="heroSecondaryCtaLink" value={formData.heroSecondaryCtaLink} onChange={handleInputChange} placeholder="Link / URL" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">Hero Banner Media</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">FA Icon (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    name="heroIcon"
                                                    value={formData.heroIcon}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold"
                                                    placeholder="fas fa-rocket"
                                                />
                                            </div>
                                            <div className="relative h-28">
                                                <input type="file" onChange={(e) => handleFileChange(e, 'heroIcon')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                <div className="w-full h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-500 transition-all">
                                                    <i className="fas fa-cloud-upload-alt text-xl text-zinc-400"></i>
                                                    <p className="text-xs font-black text-zinc-500 uppercase mt-1">Upload Image</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" name="heroImageAlt" value={formData.heroImageAlt} onChange={handleInputChange} placeholder="Alt Text (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                                <input type="text" name="heroImageAltAr" value={formData.heroImageAltAr} onChange={handleInputChange} dir="rtl" placeholder="نص وصفي (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold" />
                                            </div>
                                        </div>
                                        <div className="h-44 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group">
                                            {previews.heroIcon ? (
                                                <>
                                                    <img src={previews.heroIcon as string} alt="Hero Preview" className="w-full h-full object-contain" />
                                                    <button type="button" onClick={() => removeFile('heroIcon')} className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center">
                                                        <i className="fas fa-trash-alt text-xs"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-200 dark:text-zinc-700">
                                                    <i className={formData.heroIcon || 'fas fa-image'}></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">About Title (EN)</label>
                                        <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">About Title (AR)</label>
                                        <input type="text" name="aboutTitleAr" value={formData.aboutTitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">About Content (EN)</label>
                                        <textarea name="aboutContent" value={formData.aboutContent} onChange={handleInputChange} rows={6} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">About Content (AR)</label>
                                        <textarea name="aboutContentAr" value={formData.aboutContentAr} onChange={handleInputChange} rows={6} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">About Media</h4>
                                        <div className="relative h-28">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'aboutImage')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                            <div className="w-full h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-500 transition-all">
                                                <i className="fas fa-image text-xl text-zinc-400"></i>
                                                <p className="text-[10px] font-black text-zinc-500 uppercase mt-1">Upload Section Image</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" name="aboutImageAlt" value={formData.aboutImageAlt} onChange={handleInputChange} placeholder="Alt (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold" />
                                            <input type="text" name="aboutImageAltAr" value={formData.aboutImageAltAr} onChange={handleInputChange} dir="rtl" placeholder="نص وصفي (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold" />
                                        </div>
                                    </div>
                                    <div className="h-44 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group">
                                        {previews.aboutImage ? (
                                            <>
                                                <img src={previews.aboutImage as string} alt="About Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeFile('aboutImage')} className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center">
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </>
                                        ) : <i className="fas fa-image text-3xl text-zinc-200 dark:text-zinc-700"></i>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'howItWorks' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Process Steps</h4>
                                    <button 
                                        type="button"
                                        onClick={() => addArrayItem('howItWorks', { icon: 'fas fa-cogs', title: '', titleAr: '', description: '', descriptionAr: '' })}
                                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                                    >+ Add Step</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(formData.howItWorks || []).map((step, index) => (
                                        <div key={index} className="px-5 py-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 relative group">
                                            <button 
                                                type="button"
                                                onClick={() => removeArrayItem(index, 'howItWorks')}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                            ><i className="fas fa-times text-xs"></i></button>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="md:col-span-1 space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Step Media</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" value={step.icon} onChange={(e) => handleArrayChange(index, 'howItWorks', 'icon', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" placeholder="fas fa-icon" />
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                                                            <i className={step.icon || 'fas fa-cog'}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-3 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input type="text" value={step.title} onChange={(e) => handleArrayChange(index, 'howItWorks', 'title', e.target.value)} placeholder="Title (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                        <input type="text" value={step.titleAr || ''} onChange={(e) => handleArrayChange(index, 'howItWorks', 'titleAr', e.target.value)} dir="rtl" placeholder="العنوان (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <textarea value={step.description} onChange={(e) => handleArrayChange(index, 'howItWorks', 'description', e.target.value)} rows={2} placeholder="Description (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                        <textarea value={step.descriptionAr || ''} onChange={(e) => handleArrayChange(index, 'howItWorks', 'descriptionAr', e.target.value)} rows={2} dir="rtl" placeholder="الوصف (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Section Title (EN)</label>
                                        <input type="text" name="keyFeaturesTitle" value={formData.keyFeaturesTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Section Title (AR)</label>
                                        <input type="text" name="keyFeaturesTitleAr" value={formData.keyFeaturesTitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Feature Images & Alts</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="relative h-24">
                                                <input type="file" onChange={(e) => handleFileChange(e, 'keyFeaturesImages', true)} className="absolute inset-0 opacity-0 cursor-pointer" multiple accept="image/*" />
                                                <div className="w-full h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-500 transition-all">
                                                    <i className="fas fa-cloud-upload-alt text-lg text-zinc-400"></i>
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase">Add Images</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" name="keyFeaturesImageAlt" value={formData.keyFeaturesImageAlt} onChange={handleInputChange} placeholder="Alt (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold" />
                                                <input type="text" name="keyFeaturesImageAltAr" value={formData.keyFeaturesImageAltAr} onChange={handleInputChange} dir="rtl" placeholder="نص (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 min-h-24 content-start">
                                            {((previews.keyFeaturesImages as string[]) || []).map((img, idx) => (
                                                <div key={idx} className="aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group">
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeFile('keyFeaturesImages', idx)} className="absolute top-1 right-1 w-5 h-5 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                        <i className="fas fa-times text-[8px]"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pb-2">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Iconic Features (EN)</h5>
                                            <button type="button" onClick={() => addArrayItem('keyFeaturesList', { icon: 'fas fa-check', text: '' })} className="text-blue-600 font-black text-[9px] uppercase tracking-widest hover:underline">+ Add</button>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {(formData.keyFeaturesList || []).map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <div className="w-9 h-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs shrink-0">
                                                        <i className={item.icon || 'fas fa-check'}></i>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={item.icon || ''} 
                                                        onChange={(e) => handleArrayChange(idx, 'keyFeaturesList', 'icon', e.target.value)} 
                                                        placeholder="Icon" 
                                                        className="w-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-sm font-bold" 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={item.text} 
                                                        onChange={(e) => handleArrayChange(idx, 'keyFeaturesList', 'text', e.target.value)} 
                                                        placeholder="Feature text" 
                                                        className="flex-grow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-sm font-bold" 
                                                    />
                                                    <button type="button" onClick={() => removeArrayItem(idx, 'keyFeaturesList')} className="text-red-400 hover:text-red-600 p-1"><i className="fas fa-trash-alt text-sm"></i></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Iconic Features (AR)</h5>
                                            <button type="button" onClick={() => addArrayItem('keyFeaturesListAr', { icon: 'fas fa-check', text: '' })} className="text-blue-600 font-black text-[9px] uppercase tracking-widest hover:underline">+ Add</button>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {(formData.keyFeaturesListAr || []).map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <button type="button" onClick={() => removeArrayItem(idx, 'keyFeaturesListAr')} className="text-red-400 hover:text-red-600 p-1"><i className="fas fa-trash-alt text-sm"></i></button>
                                                    <input 
                                                        type="text" 
                                                        value={item.text} 
                                                        onChange={(e) => handleArrayChange(idx, 'keyFeaturesListAr', 'text', e.target.value)} 
                                                        dir="rtl" 
                                                        placeholder="الميزة" 
                                                        className="flex-grow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-sm font-bold" 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={item.icon || ''} 
                                                        onChange={(e) => handleArrayChange(idx, 'keyFeaturesListAr', 'icon', e.target.value)} 
                                                        dir="rtl" 
                                                        placeholder="أيقونة" 
                                                        className="w-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-sm font-bold" 
                                                    />
                                                    <div className="w-9 h-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs shrink-0">
                                                        <i className={item.icon || 'fas fa-check'}></i>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'benefits' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Benefits</h4>
                                    <button 
                                        type="button"
                                        onClick={() => addArrayItem('benefits', { icon: 'fas fa-star', title: '', titleAr: '', description: '', descriptionAr: '' })}
                                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                                    >+ Add Benefit</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(formData.benefits || []).map((benefit, index) => (
                                        <div key={index} className="px-5 py-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 relative group">
                                            <button 
                                                type="button"
                                                onClick={() => removeArrayItem(index, 'benefits')}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                            ><i className="fas fa-times text-xs"></i></button>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="md:col-span-1 space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Media</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" value={benefit.icon} onChange={(e) => handleArrayChange(index, 'benefits', 'icon', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" placeholder="fas fa-star" />
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                                                            <i className={benefit.icon || 'fas fa-star'}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-3 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input type="text" value={benefit.title} onChange={(e) => handleArrayChange(index, 'benefits', 'title', e.target.value)} placeholder="Title (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                        <input type="text" value={benefit.titleAr || ''} onChange={(e) => handleArrayChange(index, 'benefits', 'titleAr', e.target.value)} dir="rtl" placeholder="العنوان (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <textarea value={benefit.description} onChange={(e) => handleArrayChange(index, 'benefits', 'description', e.target.value)} rows={2} placeholder="Description (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                        <textarea value={benefit.descriptionAr || ''} onChange={(e) => handleArrayChange(index, 'benefits', 'descriptionAr', e.target.value)} rows={2} dir="rtl" placeholder="الوصف (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-sm font-bold" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'vision' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vision Title (EN)</label>
                                        <input type="text" name="visionTitle" value={formData.visionTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vision Title (AR)</label>
                                        <input type="text" name="visionTitleAr" value={formData.visionTitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vision Subtitle (EN)</label>
                                        <input type="text" name="visionSubtitle" value={formData.visionSubtitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vision Subtitle (AR)</label>
                                        <input type="text" name="visionSubtitleAr" value={formData.visionSubtitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Vision Highlights</h4>
                                        <button type="button" onClick={() => addArrayItem('visionItems', { icon: 'fas fa-eye', text: '', textAr: '' })} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">+ Add</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(formData.visionItems || []).map((item, idx) => (
                                            <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-800 relative group space-y-3">
                                                <button type="button" onClick={() => removeArrayItem(idx, 'visionItems')} className="absolute -top-1 -right-1 w-6 h-6 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg z-10"><i className="fas fa-times text-[10px]"></i></button>
                                                <div className="flex gap-2">
                                                    <div className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 shrink-0">
                                                        <i className={item.icon || 'fas fa-eye'}></i>
                                                    </div>
                                                    <input type="text" value={item.icon} onChange={(e) => handleArrayChange(idx, 'visionItems', 'icon', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold" placeholder="Icon (e.g. fas fa-eye)" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <input type="text" value={item.text} onChange={(e) => handleArrayChange(idx, 'visionItems', 'text', e.target.value)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold" placeholder="Highlight text (EN)" />
                                                    <input type="text" value={item.textAr || ''} onChange={(e) => handleArrayChange(idx, 'visionItems', 'textAr', e.target.value)} dir="rtl" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold" placeholder="النص (AR)" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'whySharp' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Why Sharp Title (EN)</label>
                                        <input type="text" name="whySharpTitle" value={formData.whySharpTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Why Sharp Title (AR)</label>
                                        <input type="text" name="whySharpTitleAr" value={formData.whySharpTitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Content (EN)</label>
                                        <textarea name="whySharpContent" value={formData.whySharpContent} onChange={handleInputChange} rows={6} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Content (AR)</label>
                                        <textarea name="whySharpContentAr" value={formData.whySharpContentAr} onChange={handleInputChange} rows={6} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Section Media</h4>
                                        <div className="relative h-32">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'whySharpImage')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                            <div className="w-full h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-500 transition-all">
                                                <i className="fas fa-image text-2xl text-zinc-400"></i>
                                                <p className="text-xs font-black text-zinc-500 uppercase mt-1">Upload Image</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" name="whySharpImageAlt" value={formData.whySharpImageAlt} onChange={handleInputChange} placeholder="Alt (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                            <input type="text" name="whySharpImageAltAr" value={formData.whySharpImageAltAr} onChange={handleInputChange} dir="rtl" placeholder="نص وصفي (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                        </div>
                                    </div>
                                    <div className="h-48 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group">
                                        {previews.whySharpImage ? (
                                            <>
                                                <img src={previews.whySharpImage as string} alt="Why Sharp Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeFile('whySharpImage')} className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center">
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </>
                                        ) : <i className="fas fa-image text-4xl text-zinc-200 dark:text-zinc-700"></i>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'cta' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">CTA Title (EN)</label>
                                        <input type="text" name="ctaTitle" value={formData.ctaTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">CTA Title (AR)</label>
                                        <input type="text" name="ctaTitleAr" value={formData.ctaTitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Description (EN)</label>
                                        <textarea name="ctaDescription" value={formData.ctaDescription} onChange={handleInputChange} rows={2} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Description (AR)</label>
                                        <textarea name="ctaDescriptionAr" value={formData.ctaDescriptionAr} onChange={handleInputChange} rows={2} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="p-5 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                                        <h5 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">Primary Action</h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" name="ctaButton1Text" value={formData.ctaButton1Text} onChange={handleInputChange} placeholder="Label (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-bold" />
                                            <input type="text" name="ctaButton1TextAr" value={formData.ctaButton1TextAr} onChange={handleInputChange} dir="rtl" placeholder="تسمية (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-bold" />
                                        </div>
                                        <input type="text" name="ctaButton1Link" value={formData.ctaButton1Link} onChange={handleInputChange} placeholder="Redirect Link (e.g. /contact)" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-bold" />
                                    </div>
                                    <div className="p-5 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                                        <h5 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">Secondary Action</h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" name="ctaButton2Text" value={formData.ctaButton2Text} onChange={handleInputChange} placeholder="Label (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-bold" />
                                            <input type="text" name="ctaButton2TextAr" value={formData.ctaButton2TextAr} onChange={handleInputChange} dir="rtl" placeholder="تسمية (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-bold" />
                                        </div>
                                        <input type="text" name="ctaButton2Link" value={formData.ctaButton2Link} onChange={handleInputChange} placeholder="Redirect Link" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-bold" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'faq' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Questions & Answers</h4>
                                    <button 
                                        type="button"
                                        onClick={() => addArrayItem('faqs', { question: '', questionAr: '', answer: '', answerAr: '' })}
                                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                                    >+ Add FAQ</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(formData.faqs || []).map((faq, index) => (
                                        <div key={index} className="px-5 py-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 relative group">
                                            <button 
                                                type="button"
                                                onClick={() => removeArrayItem(index, 'faqs')}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                            ><i className="fas fa-times text-xs"></i></button>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Question (EN)</label>
                                                        <input type="text" value={faq.question} onChange={(e) => handleArrayChange(index, 'faqs', 'question', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-bold" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 text-right">السؤال (AR)</label>
                                                        <input type="text" value={faq.questionAr || ''} onChange={(e) => handleArrayChange(index, 'faqs', 'questionAr', e.target.value)} dir="rtl" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-bold" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Answer (EN)</label>
                                                        <textarea value={faq.answer} onChange={(e) => handleArrayChange(index, 'faqs', 'answer', e.target.value)} rows={2} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-bold" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 text-right">الإجابة (AR)</label>
                                                        <textarea value={faq.answerAr || ''} onChange={(e) => handleArrayChange(index, 'faqs', 'answerAr', e.target.value)} rows={2} dir="rtl" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-bold" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Meta Title (EN)</label>
                                        <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Meta Title (AR)</label>
                                        <input type="text" name="metaTitleAr" value={formData.metaTitleAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Keywords (EN)</label>
                                        <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="keyword1, keyword2..." />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Keywords (AR)</label>
                                        <input type="text" name="metaKeywordsAr" value={formData.metaKeywordsAr} onChange={handleInputChange} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="كلمات دلالية..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Description (EN)</label>
                                        <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Description (AR)</label>
                                        <textarea name="metaDescriptionAr" value={formData.metaDescriptionAr} onChange={handleInputChange} rows={3} dir="rtl" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Image Upload</h4>
                                        <div className="relative h-32">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'gallery', true)} className="absolute inset-0 opacity-0 cursor-pointer" multiple accept="image/*" />
                                            <div className="w-full h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-500 transition-all">
                                                <i className="fas fa-images text-2xl text-zinc-400"></i>
                                                <p className="text-xs font-black text-zinc-500 uppercase mt-1">Add Images</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" name="galleryAlt" value={formData.galleryAlt} onChange={handleInputChange} placeholder="Shared Alt (EN)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                            <input type="text" name="galleryAltAr" value={formData.galleryAltAr} onChange={handleInputChange} dir="rtl" placeholder="نص وصفي (AR)" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 min-h-32 content-start max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {((previews.gallery as string[]) || []).map((img, idx) => (
                                            <div key={idx} className="aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group shadow-sm">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeFile('gallery', idx)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg">
                                                    <i className="fas fa-times text-[10px]"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
