'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createProduct,
    updateProduct,
    getProductCategories,
    Product,
    ProductCategory,
    HowItWorkItem,
    VisionItem,
    ProductFeatureItem,
    BenefitItem,
    FAQItem
} from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface ProductFormProps {
    product?: Product;
    isEdit?: boolean;
}

export default function ProductForm({ product, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<ProductCategory[]>([]);

    const [formData, setFormData] = useState({
        title: product?.title || '',
        titleAr: product?.titleAr || '',
        slug: product?.slug || '',
        categoryId: product?.categoryId || '',
        order: product?.order || 0,
        isPublished: product?.isPublished || false,
        cardIcon: product?.cardIcon || '',

        // Hero
        heroTitle: product?.heroTitle || '',
        heroTitleAr: product?.heroTitleAr || '',
        heroSubtitle: product?.heroSubtitle || '',
        heroSubtitleAr: product?.heroSubtitleAr || '',
        heroDescription: product?.heroDescription || '',
        heroDescriptionAr: product?.heroDescriptionAr || '',
        heroIcon: product?.heroIcon || '',
        heroPrimaryCtaText: product?.heroPrimaryCtaText || '',
        heroPrimaryCtaTextAr: product?.heroPrimaryCtaTextAr || '',
        heroPrimaryCtaLink: product?.heroPrimaryCtaLink || '',
        heroSecondaryCtaText: product?.heroSecondaryCtaText || '',
        heroSecondaryCtaTextAr: product?.heroSecondaryCtaTextAr || '',
        heroSecondaryCtaLink: product?.heroSecondaryCtaLink || '',
        heroImageAlt: product?.heroImageAlt || '',
        heroImageAltAr: product?.heroImageAltAr || '',

        // About
        aboutTitle: product?.aboutTitle || '',
        aboutTitleAr: product?.aboutTitleAr || '',
        aboutContent: product?.aboutContent || '',
        aboutContentAr: product?.aboutContentAr || '',
        aboutImageAlt: product?.aboutImageAlt || '',
        aboutImageAltAr: product?.aboutImageAltAr || '',

        // Features Section
        keyFeaturesTitle: product?.keyFeaturesTitle || '',
        keyFeaturesTitleAr: product?.keyFeaturesTitleAr || '',
        keyFeaturesImageAlt: product?.keyFeaturesImageAlt || '',
        keyFeaturesImageAltAr: product?.keyFeaturesImageAltAr || '',

        // Vision & Why Sharp
        visionTitle: product?.visionTitle || '',
        visionTitleAr: product?.visionTitleAr || '',
        visionSubtitle: product?.visionSubtitle || '',
        visionSubtitleAr: product?.visionSubtitleAr || '',
        whySharpTitle: product?.whySharpTitle || '',
        whySharpTitleAr: product?.whySharpTitleAr || '',
        whySharpContent: product?.whySharpContent || '',
        whySharpContentAr: product?.whySharpContentAr || '',
        whySharpImageAlt: product?.whySharpImageAlt || '',
        whySharpImageAltAr: product?.whySharpImageAltAr || '',

        // CTA
        ctaTitle: product?.ctaTitle || '',
        ctaTitleAr: product?.ctaTitleAr || '',
        ctaDescription: product?.ctaDescription || '',
        ctaDescriptionAr: product?.ctaDescriptionAr || '',
        ctaButton1Text: product?.ctaButton1Text || '',
        ctaButton1TextAr: product?.ctaButton1TextAr || '',
        ctaButton1Link: product?.ctaButton1Link || '',
        ctaButton2Text: product?.ctaButton2Text || '',
        ctaButton2TextAr: product?.ctaButton2TextAr || '',
        ctaButton2Link: product?.ctaButton2Link || '',

        // SEO
        metaTitle: product?.metaTitle || '',
        metaTitleAr: product?.metaTitleAr || '',
        metaDescription: product?.metaDescription || '',
        metaDescriptionAr: product?.metaDescriptionAr || '',
        metaKeywords: product?.metaKeywords || '',
        metaKeywordsAr: product?.metaKeywordsAr || '',
        brochure: product?.brochure || '',
    });

    // Dynamic Arrays
    const [howItWorks, setHowItWorks] = useState<HowItWorkItem[]>(product?.howItWorks || []);
    const [keyFeaturesList, setKeyFeaturesList] = useState<ProductFeatureItem[]>(product?.keyFeaturesList || []);
    const [keyFeaturesListAr, setKeyFeaturesListAr] = useState<ProductFeatureItem[]>(product?.keyFeaturesListAr || []);
    const [benefits, setBenefits] = useState<BenefitItem[]>(product?.benefits || []);
    const [visionItems, setVisionItems] = useState<VisionItem[]>(product?.visionItems || []);
    const [faqs, setFaqs] = useState<FAQItem[]>(product?.faqs || []);

    // Images
    const [images, setImages] = useState<{ [key: string]: File | null }>({
        heroImage: null,
        aboutImage: null,
        whySharpImage: null,
        brochure: null,
    });
    const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
        heroImage: product?.gallery?.[0] ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${product.gallery[0]}` : null,
        aboutImage: product?.aboutImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${product.aboutImage}` : null,
        whySharpImage: product?.whySharpImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${product.whySharpImage}` : null,
        brochure: product?.brochure ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${product.brochure}` : null,
    });

    useEffect(() => {
        getProductCategories().then(setCategories);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        if (name === 'title' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImages(prev => ({ ...prev, [name]: file }));
            setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value.toString());
            }
        });

        // Append Arrays
        data.append('howItWorks', JSON.stringify(howItWorks));
        data.append('keyFeaturesList', JSON.stringify(keyFeaturesList));
        data.append('keyFeaturesListAr', JSON.stringify(keyFeaturesListAr));
        data.append('benefits', JSON.stringify(benefits));
        data.append('visionItems', JSON.stringify(visionItems));
        data.append('faqs', JSON.stringify(faqs));

        // Append Images
        Object.entries(images).forEach(([key, file]) => {
            if (file) data.append(key, file);
        });

        const res = isEdit && product ? await updateProduct(product.id, data) : await createProduct(data);

        if (res.success) {
            router.push('/admin/products');
        } else {
            setError(res.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'General' },
        { id: 'hero', label: 'Hero content' },
        { id: 'about', label: 'About & How' },
        { id: 'features', label: 'Features & Benefits' },
        { id: 'vision', label: 'Vision & Why' },
        { id: 'extra', label: 'CTA & SEO' },
    ];

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">{isEdit ? 'Edit Product' : 'New Product'}</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Configure every section of your product page.</p>
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
                            <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-400/10 border border-red-400/20 rounded-[32px] text-red-400 font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[28px] w-full overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-8 py-4 rounded-[22px] font-black text-sm transition-all ${activeTab === tab.id ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-500'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-900 p-12 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">Common Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Product Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">URL Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Category</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="">None</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Card Icon (FA class)</label>
                                    <input
                                        type="text"
                                        name="cardIcon"
                                        value={formData.cardIcon}
                                        onChange={handleInputChange}
                                        placeholder="fas fa-box"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Display Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Product Brochure (PDF/Doc)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold cursor-pointer overflow-hidden transition-all hover:border-blue-500/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <i className="fas fa-file-pdf text-red-500 text-lg" />
                                                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                                                    {images.brochure ? images.brochure.name : (formData.brochure ? 'Brochure Uploaded' : 'Upload Brochure')}
                                                </span>
                                            </div>
                                            <input 
                                                type="file" 
                                                onChange={e => handleFileChange(e, 'brochure')} 
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                                accept=".pdf,.doc,.docx"
                                            />
                                        </div>
                                        {(formData.brochure || previews.brochure) && (
                                            <div className="flex items-center gap-2">
                                                {previews.brochure && (
                                                    <a
                                                        href={previews.brochure}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-2xl transition-all shadow-md flex items-center justify-center text-sm"
                                                        title="View brochure"
                                                    >
                                                        <i className="fas fa-external-link-alt" />
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImages(prev => ({ ...prev, brochure: null }));
                                                        setPreviews(prev => ({ ...prev, brochure: null }));
                                                        setFormData(prev => ({ ...prev, brochure: '' }));
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded-2xl transition-all shadow-md flex items-center justify-center text-sm"
                                                    title="Delete brochure"
                                                >
                                                    <i className="fas fa-trash-alt" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-end pb-4">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isPublished"
                                                checked={formData.isPublished}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-14 h-8 rounded-full transition-colors ${formData.isPublished ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}></div>
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.isPublished ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                                            {formData.isPublished ? 'Published' : 'Draft Mode'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Section Tab */}
                    {activeTab === 'hero' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">Hero Section Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Hero Title (EN)</label>
                                        <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Hero Subtitle (EN)</label>
                                        <input type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Description (EN)</label>
                                        <textarea name="heroDescription" value={formData.heroDescription} onChange={handleInputChange} rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none resize-none" />
                                    </div>
                                </div>
                                <div className="space-y-8 text-right" dir="rtl">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">العنوان (AR)</label>
                                        <input type="text" name="heroTitleAr" value={formData.heroTitleAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">العنوان الفرعي (AR)</label>
                                        <input type="text" name="heroSubtitleAr" value={formData.heroSubtitleAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">الوصف (AR)</label>
                                        <textarea name="heroDescriptionAr" value={formData.heroDescriptionAr} onChange={handleInputChange} rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none resize-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                                <div className="space-y-8">
                                    <h3 className="font-black text-lg">Buttons (EN)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="heroPrimaryCtaText" value={formData.heroPrimaryCtaText} onChange={handleInputChange} placeholder="Primary Text" className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-bold rounded-2xl border" />
                                        <input name="heroPrimaryCtaLink" value={formData.heroPrimaryCtaLink} onChange={handleInputChange} placeholder="Primary Link" className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-bold rounded-2xl border" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="heroSecondaryCtaText" value={formData.heroSecondaryCtaText} onChange={handleInputChange} placeholder="Secondary Text" className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-bold rounded-2xl border" />
                                        <input name="heroSecondaryCtaLink" value={formData.heroSecondaryCtaLink} onChange={handleInputChange} placeholder="Secondary Link" className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-bold rounded-2xl border" />
                                    </div>
                                </div>
                                <div className="space-y-8 text-right" dir="rtl">
                                    <h3 className="font-black text-lg">الأزرار (AR)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="heroPrimaryCtaTextAr" value={formData.heroPrimaryCtaTextAr} onChange={handleInputChange} placeholder="نص الزر الأول" className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-bold rounded-2xl border" />
                                        <div />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="heroSecondaryCtaTextAr" value={formData.heroSecondaryCtaTextAr} onChange={handleInputChange} placeholder="نص الزر الثاني" className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-bold rounded-2xl border" />
                                        <div />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Main Product Image (Hero)</label>
                                <div className="mt-4 relative aspect-[21/9] bg-zinc-50 dark:bg-zinc-800 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-blue-500/50">
                                    {previews.heroImage ? (
                                        <Image src={previews.heroImage} alt="Hero" fill className="object-cover" />
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <i className="fas fa-image text-5xl text-zinc-300" />
                                            <p className="font-black text-zinc-400">Upload Premium Image</p>
                                        </div>
                                    )}
                                    <input type="file" onChange={e => handleFileChange(e, 'heroImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About & How It Works Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-black">About Section</h2>
                                    <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleInputChange} placeholder="Heading (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                    <textarea name="aboutContent" value={formData.aboutContent} onChange={handleInputChange} rows={6} placeholder="Content (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-medium outline-none border resize-none" />
                                </div>
                                <div className="space-y-8 text-right" dir="rtl">
                                    <h2 className="text-2xl font-black">قسم عن المنتج</h2>
                                    <input type="text" name="aboutTitleAr" value={formData.aboutTitleAr} onChange={handleInputChange} placeholder="العنوان (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                    <textarea name="aboutContentAr" value={formData.aboutContentAr} onChange={handleInputChange} rows={6} placeholder="المحتوى (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-medium outline-none border resize-none" />
                                </div>
                            </div>

                            <div className="space-y-8 pt-8 border-t border-zinc-50 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black">How It Works Steps</h2>
                                    <button type="button" onClick={() => setHowItWorks([...howItWorks, { title: '', description: '', icon: '' }])} className="bg-zinc-100 dark:bg-zinc-800 px-6 py-2 rounded-xl font-bold text-sm tracking-tight">+ Add Step</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {howItWorks.map((step, i) => (
                                        <div key={i} className="p-8 bg-zinc-50/50 dark:bg-zinc-800/20 rounded-[32px] border border-zinc-100 dark:border-zinc-700 relative space-y-4">
                                            <button type="button" onClick={() => setHowItWorks(howItWorks.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500"><i className="fas fa-times" /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input value={step.title} onChange={e => { const n = [...howItWorks]; n[i].title = e.target.value; setHowItWorks(n); }} placeholder="Title (EN)" className="bg-transparent border-b py-1 font-bold outline-none" />
                                                <input value={step.titleAr || ''} dir="rtl" onChange={e => { const n = [...howItWorks]; n[i].titleAr = e.target.value; setHowItWorks(n); }} placeholder="العنوان (AR)" className="bg-transparent border-b py-1 font-bold outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <textarea value={step.description} onChange={e => { const n = [...howItWorks]; n[i].description = e.target.value; setHowItWorks(n); }} placeholder="Description (EN)" className="bg-transparent border-b py-1 text-sm outline-none resize-none" rows={2} />
                                                <textarea value={step.descriptionAr || ''} dir="rtl" onChange={e => { const n = [...howItWorks]; n[i].descriptionAr = e.target.value; setHowItWorks(n); }} placeholder="الوصف (AR)" className="bg-transparent border-b py-1 text-sm outline-none resize-none" rows={2} />
                                            </div>
                                            <input value={step.icon} onChange={e => { const n = [...howItWorks]; n[i].icon = e.target.value; setHowItWorks(n); }} placeholder="Icon Class (e.g. fas fa-cogs)" className="bg-transparent border-b py-1 text-xs outline-none w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features & Benefits Tab */}
                    {activeTab === 'features' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-8">
                                <h2 className="text-2xl font-black">Key Features Content</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <input type="text" name="keyFeaturesTitle" value={formData.keyFeaturesTitle} onChange={handleInputChange} placeholder="Section Heading (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                    <input type="text" name="keyFeaturesTitleAr" value={formData.keyFeaturesTitleAr} onChange={handleInputChange} dir="rtl" placeholder="العنوان (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold uppercase tracking-widest text-xs text-zinc-400">Features List (EN)</h3>
                                            <button type="button" onClick={() => setKeyFeaturesList([...keyFeaturesList, { text: '', icon: '' }])} className="text-blue-600 font-bold text-xs uppercase">+ Add</button>
                                        </div>
                                        {keyFeaturesList.map((item, i) => (
                                            <div key={i} className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl">
                                                <input value={item.text} onChange={e => { const n = [...keyFeaturesList]; n[i].text = e.target.value; setKeyFeaturesList(n); }} placeholder="Feature text" className="bg-transparent flex-grow font-bold outline-none border-b" />
                                                <button type="button" onClick={() => setKeyFeaturesList(keyFeaturesList.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-red-500">×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-6 text-right" dir="rtl">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold uppercase tracking-widest text-xs text-zinc-400">قائمة المميزات (AR)</h3>
                                            <button type="button" onClick={() => setKeyFeaturesListAr([...keyFeaturesListAr, { text: '', icon: '' }])} className="text-blue-600 font-bold text-xs uppercase">+ إضافة</button>
                                        </div>
                                        {keyFeaturesListAr.map((item, i) => (
                                            <div key={i} className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl">
                                                <input value={item.text} onChange={e => { const n = [...keyFeaturesListAr]; n[i].text = e.target.value; setKeyFeaturesListAr(n); }} placeholder="نص الميزة" className="bg-transparent flex-grow font-bold outline-none border-b" />
                                                <button type="button" onClick={() => setKeyFeaturesListAr(keyFeaturesListAr.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-red-500">×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 pt-8 border-t border-zinc-50 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black">Core Benefits</h2>
                                    <button type="button" onClick={() => setBenefits([...benefits, { title: '', description: '', icon: '' }])} className="bg-zinc-100 dark:bg-zinc-800 px-6 py-2 rounded-xl font-bold text-sm tracking-tight">+ Add Benefit</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {benefits.map((item, i) => (
                                        <div key={i} className="p-6 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 rounded-[32px] relative space-y-4">
                                            <button type="button" onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500">×</button>
                                            <input value={item.title} onChange={e => { const n = [...benefits]; n[i].title = e.target.value; setBenefits(n); }} placeholder="Title (EN)" className="w-full font-black border-b py-1 outline-none" />
                                            <input value={item.titleAr || ''} dir="rtl" onChange={e => { const n = [...benefits]; n[i].titleAr = e.target.value; setBenefits(n); }} placeholder="العنوان (AR)" className="w-full font-black border-b py-1 outline-none text-right" />
                                            <textarea value={item.description} onChange={e => { const n = [...benefits]; n[i].description = e.target.value; setBenefits(n); }} rows={2} placeholder="Brief description" className="w-full text-sm py-1 outline-none bg-zinc-50 dark:bg-zinc-800 rounded-lg px-2 border" />
                                            <input value={item.icon || ''} onChange={e => { const n = [...benefits]; n[i].icon = e.target.value; setBenefits(n); }} placeholder="Icon (fas fa-...)" className="w-full text-[10px] text-zinc-400 outline-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vision & Why Sharp Tab */}
                    {activeTab === 'vision' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-10">
                                <h2 className="text-2xl font-black">Our Vision for this Product</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <input type="text" name="visionTitle" value={formData.visionTitle} onChange={handleInputChange} placeholder="Vision Main Title (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                        <textarea name="visionSubtitle" value={formData.visionSubtitle} onChange={handleInputChange} rows={3} placeholder="Vision Statement (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-medium outline-none border resize-none" />
                                    </div>
                                    <div className="space-y-4 text-right" dir="rtl">
                                        <input type="text" name="visionTitleAr" value={formData.visionTitleAr} onChange={handleInputChange} placeholder="الرؤية (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                        <textarea name="visionSubtitleAr" value={formData.visionSubtitleAr} onChange={handleInputChange} rows={3} placeholder="بيان الرؤية (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-medium outline-none border resize-none" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg">Vision Points</h3>
                                        <button type="button" onClick={() => setVisionItems([...visionItems, { icon: '', text: '', textAr: '' }])} className="text-blue-600 font-bold text-sm tracking-tight">+ Add Point</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {visionItems.map((v, i) => (
                                            <div key={i} className="p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl relative border flex flex-col gap-4">
                                                <button type="button" onClick={() => setVisionItems(visionItems.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-zinc-300">×</button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input value={v.text} onChange={e => { const n = [...visionItems]; n[i].text = e.target.value; setVisionItems(n); }} placeholder="Point text (EN)" className="bg-transparent border-b font-bold py-1 outline-none" />
                                                    <input value={v.textAr || ''} dir="rtl" onChange={e => { const n = [...visionItems]; n[i].textAr = e.target.value; setVisionItems(n); }} placeholder="نص النقطة (AR)" className="bg-transparent border-b font-bold py-1 outline-none" />
                                                </div>
                                                <input value={v.icon} onChange={e => { const n = [...visionItems]; n[i].icon = e.target.value; setVisionItems(n); }} placeholder="FA Icon class" className="text-xs bg-white dark:bg-zinc-900 p-2 rounded-lg outline-none" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10 pt-10 border-t border-zinc-50 dark:border-zinc-800">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <h2 className="text-2xl font-black">Why Sharp? Section</h2>
                                        <input type="text" name="whySharpTitle" value={formData.whySharpTitle} onChange={handleInputChange} placeholder="Sharp Title (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                        <textarea name="whySharpContent" value={formData.whySharpContent} onChange={handleInputChange} rows={6} placeholder="Description (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-medium outline-none border resize-none" />
                                    </div>
                                    <div className="space-y-8 text-right" dir="rtl">
                                        <h2 className="text-2xl font-black">لماذا شارب؟</h2>
                                        <input type="text" name="whySharpTitleAr" value={formData.whySharpTitleAr} onChange={handleInputChange} placeholder="العنوان (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-bold outline-none border" />
                                        <textarea name="whySharpContentAr" value={formData.whySharpContentAr} onChange={handleInputChange} rows={6} placeholder="المحتوى (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl font-medium outline-none border resize-none" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-zinc-400 tracking-widest uppercase">Section Image</label>
                                    <div className="relative aspect-video max-w-2xl bg-zinc-50 dark:bg-zinc-800 rounded-[32px] overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center transition-all hover:border-blue-500/50">
                                        {previews.whySharpImage ? (
                                            <Image src={previews.whySharpImage} alt="Why Sharp" fill className="object-cover" />
                                        ) : (
                                            <div className="text-zinc-300"><i className="fas fa-image text-4xl" /></div>
                                        )}
                                        <input type="file" onChange={e => handleFileChange(e, 'whySharpImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Tab: CTA, FAQs & SEO */}
                    {activeTab === 'extra' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4">
                            <div className="p-10 bg-zinc-950 text-white rounded-[40px] space-y-10">
                                <h2 className="text-3xl font-black tracking-tight underline decoration-blue-500 underline-offset-8">Final CTA Banner</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <input name="ctaTitle" value={formData.ctaTitle} onChange={handleInputChange} placeholder="CTA Heading (EN)" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl font-bold outline-none text-2xl focus:border-blue-500" />
                                        <textarea name="ctaDescription" value={formData.ctaDescription} onChange={handleInputChange} rows={3} placeholder="CTA Description (EN)" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl font-medium outline-none text-white/60 resize-none focus:border-blue-500" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <input name="ctaButton1Text" value={formData.ctaButton1Text} onChange={handleInputChange} placeholder="Button 1 text" className="w-full bg-white/5 p-4 rounded-xl border border-zinc-800 font-bold" />
                                                <input name="ctaButton1Link" value={formData.ctaButton1Link} onChange={handleInputChange} placeholder="Button 1 link" className="w-full bg-white/5 p-4 rounded-xl border border-zinc-800 text-sm font-mono" />
                                            </div>
                                            <div className="space-y-2">
                                                <input name="ctaButton2Text" value={formData.ctaButton2Text} onChange={handleInputChange} placeholder="Button 2 text" className="w-full bg-white/5 p-4 rounded-xl border border-zinc-800 font-bold" />
                                                <input name="ctaButton2Link" value={formData.ctaButton2Link} onChange={handleInputChange} placeholder="Button 2 link" className="w-full bg-white/5 p-4 rounded-xl border border-zinc-800 text-sm font-mono" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 text-right" dir="rtl">
                                        <input name="ctaTitleAr" value={formData.ctaTitleAr} onChange={handleInputChange} placeholder="عنوان الـ CTA (AR)" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl font-bold outline-none text-2xl focus:border-blue-500" />
                                        <textarea name="ctaDescriptionAr" value={formData.ctaDescriptionAr} onChange={handleInputChange} rows={3} placeholder="الوصف (AR)" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl font-medium outline-none text-white/60 resize-none focus:border-blue-500" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input name="ctaButton1TextAr" value={formData.ctaButton1TextAr} onChange={handleInputChange} placeholder="نص الزر الأول" className="w-full bg-white/5 p-4 rounded-xl border border-zinc-800 font-bold" />
                                            <input name="ctaButton2TextAr" value={formData.ctaButton2TextAr} onChange={handleInputChange} placeholder="نص الزر الثاني" className="w-full bg-white/5 p-4 rounded-xl border border-zinc-800 font-bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10 pt-10 border-t border-zinc-50 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black">FAQs</h2>
                                    <button type="button" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])} className="text-blue-600 font-bold hover:underline">+ New FAQ</button>
                                </div>
                                <div className="space-y-6">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="bg-zinc-50 dark:bg-zinc-800/10 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-700 relative grid grid-cols-1 md:grid-cols-2 gap-10 group">
                                            <button type="button" onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt" /></button>
                                            <div className="space-y-4">
                                                <input value={faq.question} onChange={e => { const n = [...faqs]; n[i].question = e.target.value; setFaqs(n); }} placeholder="Question (EN)" className="w-full font-black text-lg bg-transparent border-b outline-none py-1" />
                                                <textarea value={faq.answer} onChange={e => { const n = [...faqs]; n[i].answer = e.target.value; setFaqs(n); }} placeholder="Answer (EN)" className="w-full text-zinc-500 py-1 outline-none bg-transparent text-sm resize-none" rows={3} />
                                            </div>
                                            <div className="space-y-4 text-right" dir="rtl">
                                                <input value={faq.questionAr || ''} onChange={e => { const n = [...faqs]; n[i].questionAr = e.target.value; setFaqs(n); }} placeholder="السؤال (AR)" className="w-full font-black text-lg bg-transparent border-b outline-none py-1" />
                                                <textarea value={faq.answerAr || ''} onChange={e => { const n = [...faqs]; n[i].answerAr = e.target.value; setFaqs(n); }} placeholder="الإجابة (AR)" className="w-full text-zinc-500 py-1 outline-none bg-transparent text-sm resize-none" rows={3} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-10 pt-10 border-t border-zinc-50 dark:border-zinc-800">
                                <h2 className="text-2xl font-black">Search Engine Optimization (SEO)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-400 tracking-widest uppercase px-2">Meta Title (EN)</label>
                                            <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border p-4 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-400 tracking-widest uppercase px-2">Meta Description (EN)</label>
                                            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border p-4 rounded-xl font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-6 text-right" dir="rtl">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-400 tracking-widest uppercase px-2">عنوان الميتا (AR)</label>
                                            <input name="metaTitleAr" value={formData.metaTitleAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border p-4 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-400 tracking-widest uppercase px-2">وصف الميتا (AR)</label>
                                            <textarea name="metaDescriptionAr" value={formData.metaDescriptionAr} onChange={handleInputChange} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border p-4 rounded-xl font-medium" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}
