'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createService,
    updateService,
    getServiceCategories,
    ServicePage,
    ServiceCategory,
    ProcessItem,
    CapabilityItem,
    BenefitItem,
    WhyChooseUsItem,
    FAQItem,
    AboutPillarItem,
    IndustryItem,
    CriticalCardItem
} from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface ServiceFormProps {
    service?: ServicePage;
    isEdit?: boolean;
}

export default function ServiceForm({ service, isEdit }: ServiceFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<ServiceCategory[]>([]);

    const [formData, setFormData] = useState({
        slug: service?.slug || '',
        categoryId: service?.categoryId || '',
        order: service?.order || 0,
        isPublished: service?.isPublished || false,

        // Hero
        heroTitle: service?.heroTitle || '',
        heroTitleAr: service?.heroTitleAr || '',
        heroTagline: service?.heroTagline || '',
        heroTaglineAr: service?.heroTaglineAr || '',
        heroIntroduction: service?.heroIntroduction || '',
        heroIntroductionAr: service?.heroIntroductionAr || '',
        primaryCtaText: service?.primaryCtaText || '',
        primaryCtaTextAr: service?.primaryCtaTextAr || '',
        primaryCtaLink: service?.primaryCtaLink || '',
        secondaryCtaText: service?.secondaryCtaText || '',
        secondaryCtaTextAr: service?.secondaryCtaTextAr || '',
        secondaryCtaLink: service?.secondaryCtaLink || '',

        // About
        aboutSectionTitle: service?.aboutSectionTitle || '',
        aboutSectionTitleAr: service?.aboutSectionTitleAr || '',
        aboutSectionDescription: service?.aboutSectionDescription || '',
        aboutSectionDescriptionAr: service?.aboutSectionDescriptionAr || '',
        aboutSectionImageAlt: service?.aboutSectionImageAlt || '',
        aboutSectionImageAltAr: service?.aboutSectionImageAltAr || '',
        aboutSectionBottomNote: service?.aboutSectionBottomNote || '',
        aboutSectionBottomNoteAr: service?.aboutSectionBottomNoteAr || '',

        // Solutions (Capabilities)
        capabilitiesSectionTitle: service?.capabilitiesSectionTitle || '',
        capabilitiesSectionTitleAr: service?.capabilitiesSectionTitleAr || '',

        // Industries
        industriesSectionTitle: service?.industriesSectionTitle || '',
        industriesSectionTitleAr: service?.industriesSectionTitleAr || '',
        industriesSectionDescription: service?.industriesSectionDescription || '',
        industriesSectionDescriptionAr: service?.industriesSectionDescriptionAr || '',
        industriesImageAlt: service?.industriesImageAlt || '',
        industriesImageAltAr: service?.industriesImageAltAr || '',
        industriesSectionBottomNote: service?.industriesSectionBottomNote || '',
        industriesSectionBottomNoteAr: service?.industriesSectionBottomNoteAr || '',

        // Critical Why
        criticalSectionTitle: service?.criticalSectionTitle || '',
        criticalSectionTitleAr: service?.criticalSectionTitleAr || '',
        criticalSectionDescription: service?.criticalSectionDescription || '',
        criticalSectionDescriptionAr: service?.criticalSectionDescriptionAr || '',
        criticalSectionButtonText: service?.criticalSectionButtonText || '',
        criticalSectionButtonTextAr: service?.criticalSectionButtonTextAr || '',
        criticalSectionButtonLink: service?.criticalSectionButtonLink || '',
        criticalRightTitle: service?.criticalRightTitle || '',
        criticalRightTitleAr: service?.criticalRightTitleAr || '',

        // Why Choose Us
        whyChooseUsSectionTitle: service?.whyChooseUsSectionTitle || '',
        whyChooseUsSectionTitleAr: service?.whyChooseUsSectionTitleAr || '',
        whyChooseUsDescription: service?.whyChooseUsDescription || '',
        whyChooseUsDescriptionAr: service?.whyChooseUsDescriptionAr || '',
        whyChooseUsBottomNote: service?.whyChooseUsBottomNote || '',
        whyChooseUsBottomNoteAr: service?.whyChooseUsBottomNoteAr || '',

        // SEO & Extra
        metaTitle: service?.metaTitle || '',
        metaTitleAr: service?.metaTitleAr || '',
        metaDescription: service?.metaDescription || '',
        metaDescriptionAr: service?.metaDescriptionAr || '',
        metaKeywords: service?.metaKeywords || '',
        metaKeywordsAr: service?.metaKeywordsAr || '',
        ctaMessage: service?.ctaMessage || '',
        ctaMessageAr: service?.ctaMessageAr || '',
        ctaPrimaryText: service?.ctaPrimaryText || '',
        ctaPrimaryTextAr: service?.ctaPrimaryTextAr || '',
        ctaPrimaryLink: service?.ctaPrimaryLink || '',
        ctaSecondaryText: service?.ctaSecondaryText || '',
        ctaSecondaryTextAr: service?.ctaSecondaryTextAr || '',
        ctaSecondaryLink: service?.ctaSecondaryLink || '',
        cardIcon: service?.cardIcon || '',
    });

    // Dynamic Arrays
    const [aboutPillars, setAboutPillars] = useState<AboutPillarItem[]>(service?.aboutPillars || []);
    const [capabilities, setCapabilities] = useState<CapabilityItem[]>(service?.capabilities || []);
    const [industries, setIndustries] = useState<IndustryItem[]>(service?.industries || []);
    const [criticalCards, setCriticalCards] = useState<CriticalCardItem[]>(service?.criticalCards || []);
    const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>(service?.whyChooseUs || []);
    const [faqs, setFaqs] = useState<FAQItem[]>(service?.faqs || []);

    // Images
    const [images, setImages] = useState<{ [key: string]: File | null }>({
        heroImage: null,
        heroIcon: null,
        aboutSectionImage: null,
        industriesImage: null,
    });
    const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
        heroImage: service?.heroImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${service.heroImage}` : null,
        heroIcon: service?.heroIcon ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${service.heroIcon}` : null,
        aboutSectionImage: service?.aboutSectionImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${service.aboutSectionImage}` : null,
        industriesImage: service?.industriesImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${service.industriesImage}` : null,
    });

    useEffect(() => {
        getServiceCategories().then(setCategories);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        if (name === 'heroTitle' && !isEdit) {
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
        data.append('aboutPillars', JSON.stringify(aboutPillars));
        data.append('capabilities', JSON.stringify(capabilities));
        data.append('industries', JSON.stringify(industries));
        data.append('criticalCards', JSON.stringify(criticalCards));
        data.append('whyChooseUs', JSON.stringify(whyChooseUs));
        data.append('faqs', JSON.stringify(faqs));

        // Append Images
        Object.entries(images).forEach(([key, file]) => {
            if (file) data.append(key, file);
        });

        const res = isEdit && service ? await updateService(service.id, data) : await createService(data);

        if (res.success) {
            router.push('/admin/services');
        } else {
            setError(res.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'General' },
        { id: 'hero', label: 'Hero Section' },
        { id: 'about', label: 'About' },
        { id: 'solutions', label: 'Solutions' },
        { id: 'industries', label: 'Industries' },
        { id: 'critical', label: 'Critical Why' },
        { id: 'why-choose', label: 'Why Us' },
        { id: 'extra', label: 'FAQ & SEO' },
    ];

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">{isEdit ? 'Edit Service' : 'New Service'}</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Configure every section of your service page.</p>
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
                            <span>{isEdit ? 'Update Service' : 'Create Service'}</span>
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
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Display Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                                <div className="space-y-3 col-md-2">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Card Icon (FontAwesome)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            name="cardIcon"
                                            value={formData.cardIcon}
                                            onChange={handleInputChange}
                                            placeholder="e.g. fas fa-shield-alt"
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 text-2xl">
                                            <i className={formData.cardIcon || 'fas fa-cog'}></i>
                                        </div>
                                    </div>
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
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Page Title (EN)</label>
                                        <input
                                            type="text"
                                            name="heroTitle"
                                            value={formData.heroTitle}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Tagline (EN)</label>
                                        <input
                                            type="text"
                                            name="heroTagline"
                                            value={formData.heroTagline}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Introduction (EN)</label>
                                        <textarea
                                            name="heroIntroduction"
                                            value={formData.heroIntroduction}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-8" dir="rtl">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Page Title (AR)</label>
                                        <input
                                            type="text"
                                            name="heroTitleAr"
                                            value={formData.heroTitleAr}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Tagline (AR)</label>
                                        <input
                                            type="text"
                                            name="heroTaglineAr"
                                            value={formData.heroTaglineAr}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Introduction (AR)</label>
                                        <textarea
                                            name="heroIntroductionAr"
                                            value={formData.heroIntroductionAr}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Main Header Image</label>
                                    <div className="relative aspect-[21/9] bg-zinc-50 dark:bg-zinc-800 rounded-[32px] overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500/50 transition-all">
                                        {previews.heroImage ? (
                                            <Image src={previews.heroImage} alt="Hero" fill className="object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-zinc-400">
                                                <i className="fas fa-image text-4xl" />
                                                <span className="text-sm font-black">Upload Header Image</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'heroImage')}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Hero Icon (Overlay)</label>
                                    <div className="relative h-full aspect-square max-h-[160px] bg-zinc-50 dark:bg-zinc-800 rounded-[32px] overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500/50 transition-all mx-auto md:ml-0">
                                        {previews.heroIcon ? (
                                            <Image src={previews.heroIcon} alt="Icon" fill className="object-contain p-4" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-zinc-400">
                                                <i className="fas fa-plus text-2xl" />
                                                <span className="text-xs font-black text-center px-4">Upload Hero Icon</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'heroIcon')}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About Section Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">About Section</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Section Title (EN)</label>
                                        <input type="text" name="aboutSectionTitle" value={formData.aboutSectionTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Description (EN)</label>
                                        <textarea name="aboutSectionDescription" value={formData.aboutSectionDescription} onChange={handleInputChange} rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Bottom Note (EN)</label>
                                        <textarea name="aboutSectionBottomNote" value={formData.aboutSectionBottomNote} onChange={handleInputChange} rows={2} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium" />
                                    </div>
                                </div>
                                <div className="space-y-8" dir="rtl">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2 text-right">عنوان القسم (AR)</label>
                                        <input type="text" name="aboutSectionTitleAr" value={formData.aboutSectionTitleAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2 text-right">الوصف (AR)</label>
                                        <textarea name="aboutSectionDescriptionAr" value={formData.aboutSectionDescriptionAr} onChange={handleInputChange} rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2 text-right">ملاحظة ختامية (AR)</label>
                                        <textarea name="aboutSectionBottomNoteAr" value={formData.aboutSectionBottomNoteAr} onChange={handleInputChange} rows={2} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black">About Section Pillars</h3>
                                    <button type="button" onClick={() => setAboutPillars([...aboutPillars, { title: '', titleAr: '', iconFA: '' }])} className="text-blue-600 font-bold hover:underline">+ Add Pillar</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {aboutPillars.map((pillar, i) => (
                                        <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700 relative group">
                                            <button type="button" onClick={() => setAboutPillars(aboutPillars.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500"><i className="fas fa-times" /></button>
                                            <div className="space-y-4">
                                                <input value={pillar.title} onChange={e => { const n = [...aboutPillars]; n[i].title = e.target.value; setAboutPillars(n); }} placeholder="Pillar Title" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 font-bold py-2 focus:border-blue-500 outline-none" />
                                                <input value={pillar.titleAr || ''} dir="rtl" onChange={e => { const n = [...aboutPillars]; n[i].titleAr = e.target.value; setAboutPillars(n); }} placeholder="العنوان بالعربية" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 font-bold py-2 focus:border-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Solutions Content Tab */}
                    {activeTab === 'solutions' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">Solutions / Capabilities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Section Title (EN)</label>
                                    <input type="text" name="capabilitiesSectionTitle" value={formData.capabilitiesSectionTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold" />
                                </div>
                                <div className="space-y-3" dir="rtl">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">العنوان (AR)</label>
                                    <input type="text" name="capabilitiesSectionTitleAr" value={formData.capabilitiesSectionTitleAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black">Solution Cards</h3>
                                    <button type="button" onClick={() => setCapabilities([...capabilities, { title: '', description: '', icon: '' }])} className="text-blue-600 font-bold hover:underline">+ Add Solution</button>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {capabilities.map((cap, i) => (
                                        <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700 relative grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <button type="button" onClick={() => setCapabilities(capabilities.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500"><i className="fas fa-times" /></button>
                                            <div className="space-y-4">
                                                <input value={cap.title} onChange={e => { const n = [...capabilities]; n[i].title = e.target.value; setCapabilities(n); }} placeholder="Card Title (EN)" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 font-bold py-2 focus:border-blue-500 outline-none" />
                                                <textarea value={cap.description || ''} onChange={e => { const n = [...capabilities]; n[i].description = e.target.value; setCapabilities(n); }} placeholder="Description (EN)" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-2 focus:border-blue-500 outline-none resize-none" rows={2} />
                                                <input value={cap.icon || ''} onChange={e => { const n = [...capabilities]; n[i].icon = e.target.value; setCapabilities(n); }} placeholder="FA Icon (e.g. fas fa-check)" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-2 focus:border-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-4 text-right" dir="rtl">
                                                <input value={cap.titleAr || ''} onChange={e => { const n = [...capabilities]; n[i].titleAr = e.target.value; setCapabilities(n); }} placeholder="العنوان (AR)" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 font-bold py-2 focus:border-blue-500 outline-none" />
                                                <textarea value={cap.descriptionAr || ''} onChange={e => { const n = [...capabilities]; n[i].descriptionAr = e.target.value; setCapabilities(n); }} placeholder="الوصف (AR)" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-2 focus:border-blue-500 outline-none resize-none" rows={2} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Industries Tab */}
                    {activeTab === 'industries' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">Industries Section</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <input type="text" name="industriesSectionTitle" value={formData.industriesSectionTitle} onChange={handleInputChange} placeholder="Section Heading (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    <textarea name="industriesSectionDescription" value={formData.industriesSectionDescription} onChange={handleInputChange} placeholder="Description (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none" rows={3} />
                                </div>
                                <div className="space-y-4 text-right" dir="rtl">
                                    <input type="text" name="industriesSectionTitleAr" value={formData.industriesSectionTitleAr} onChange={handleInputChange} placeholder="العنوان (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    <textarea name="industriesSectionDescriptionAr" value={formData.industriesSectionDescriptionAr} onChange={handleInputChange} placeholder="الوصف (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none" rows={3} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black">Industry Items</h3>
                                    <button type="button" onClick={() => setIndustries([...industries, { title: '', iconFA: '' }])} className="text-blue-600 font-bold hover:underline">+ Add Industry</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {industries.map((ind, i) => (
                                        <div key={i} className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 relative">
                                            <button type="button" onClick={() => setIndustries(industries.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-zinc-400"><i className="fas fa-times" /></button>
                                            <div className="space-y-3">
                                                <input value={ind.title} onChange={e => { const n = [...industries]; n[i].title = e.target.value; setIndustries(n); }} placeholder="Industry Title" className="w-full border-b border-zinc-100 py-1 outline-none font-bold" />
                                                <input value={ind.titleAr || ''} dir="rtl" onChange={e => { const n = [...industries]; n[i].titleAr = e.target.value; setIndustries(n); }} placeholder="الاسم (AR)" className="w-full border-b border-zinc-100 py-1 outline-none font-bold" />
                                                <input value={ind.iconFA || ''} onChange={e => { const n = [...industries]; n[i].iconFA = e.target.value; setIndustries(n); }} placeholder="FA Icon" className="w-full border-b border-zinc-100 py-1 outline-none text-xs" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Critical Why Tab */}
                    {activeTab === 'critical' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">Critical Why Section</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <input type="text" name="criticalSectionTitle" value={formData.criticalSectionTitle} onChange={handleInputChange} placeholder="Section Heading (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    <textarea name="criticalSectionDescription" value={formData.criticalSectionDescription} onChange={handleInputChange} placeholder="Description (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none" rows={3} />
                                </div>
                                <div className="space-y-4 text-right" dir="rtl">
                                    <input type="text" name="criticalSectionTitleAr" value={formData.criticalSectionTitleAr} onChange={handleInputChange} placeholder="العنوان (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    <textarea name="criticalSectionDescriptionAr" value={formData.criticalSectionDescriptionAr} onChange={handleInputChange} placeholder="الوصف (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none" rows={3} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                <div className="p-8 bg-zinc-900 text-white rounded-[40px] space-y-6">
                                    <h3 className="text-xl font-black">Right Side Cards</h3>
                                    <div className="space-y-4">
                                        {criticalCards.map((card, i) => (
                                            <div key={i} className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/10">
                                                <input value={card.title} onChange={e => { const n = [...criticalCards]; n[i].title = e.target.value; setCriticalCards(n); }} placeholder="Card Title" className="bg-transparent text-sm font-bold flex-grow outline-none border-b border-white/20" />
                                                <input value={card.titleAr || ''} dir="rtl" onChange={e => { const n = [...criticalCards]; n[i].titleAr = e.target.value; setCriticalCards(n); }} placeholder="العنوان (AR)" className="bg-transparent text-sm font-bold flex-grow outline-none border-b border-white/20" />
                                                <button type="button" onClick={() => setCriticalCards(criticalCards.filter((_, idx) => idx !== i))} className="text-white/40 hover:text-red-400">×</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setCriticalCards([...criticalCards, { title: '', iconFA: '' }])} className="w-full border-2 border-dashed border-white/20 p-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-white/40 transition-all">+ Add Card</button>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Button Link</label>
                                        <input type="text" name="criticalSectionButtonLink" value={formData.criticalSectionButtonLink} onChange={handleInputChange} placeholder="/contact" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-6 py-4 font-bold outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Button Text (EN)</label>
                                            <input type="text" name="criticalSectionButtonText" value={formData.criticalSectionButtonText} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-6 py-4 font-bold outline-none" />
                                        </div>
                                        <div className="space-y-3 text-right" dir="rtl">
                                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">نص الزر (AR)</label>
                                            <input type="text" name="criticalSectionButtonTextAr" value={formData.criticalSectionButtonTextAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-6 py-4 font-bold outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Why Choose Us Tab */}
                    {activeTab === 'why-choose' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-black">Why Choose Us</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <input type="text" name="whyChooseUsSectionTitle" value={formData.whyChooseUsSectionTitle} onChange={handleInputChange} placeholder="Section Heading (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    <textarea name="whyChooseUsDescription" value={formData.whyChooseUsDescription} onChange={handleInputChange} placeholder="Description (EN)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none" rows={3} />
                                </div>
                                <div className="space-y-4 text-right" dir="rtl">
                                    <input type="text" name="whyChooseUsSectionTitleAr" value={formData.whyChooseUsSectionTitleAr} onChange={handleInputChange} placeholder="العنوان (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold outline-none" />
                                    <textarea name="whyChooseUsDescriptionAr" value={formData.whyChooseUsDescriptionAr} onChange={handleInputChange} placeholder="الوصف (AR)" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium outline-none" rows={3} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black">Reason Cards</h3>
                                    <button type="button" onClick={() => setWhyChooseUs([...whyChooseUs, { title: '', description: '', iconFA: '' }])} className="text-blue-600 font-bold hover:underline">+ Add Reason</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {whyChooseUs.map((item, i) => (
                                        <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700 relative">
                                            <button type="button" onClick={() => setWhyChooseUs(whyChooseUs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500"><i className="fas fa-times" /></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <input value={item.title} onChange={e => { const n = [...whyChooseUs]; n[i].title = e.target.value; setWhyChooseUs(n); }} placeholder="Card Title (EN)" className="w-full border-b border-zinc-200 dark:border-zinc-700 font-bold py-1 outline-none" />
                                                    <textarea value={item.description || ''} onChange={e => { const n = [...whyChooseUs]; n[i].description = e.target.value; setWhyChooseUs(n); }} placeholder="Description (EN)" className="w-full text-sm py-1 outline-none bg-transparent" rows={2} />
                                                </div>
                                                <div className="space-y-4 text-right" dir="rtl">
                                                    <input value={item.titleAr || ''} onChange={e => { const n = [...whyChooseUs]; n[i].titleAr = e.target.value; setWhyChooseUs(n); }} placeholder="العنوان (AR)" className="w-full border-b border-zinc-200 dark:border-zinc-700 font-bold py-1 outline-none" />
                                                    <textarea value={item.descriptionAr || ''} onChange={e => { const n = [...whyChooseUs]; n[i].descriptionAr = e.target.value; setWhyChooseUs(n); }} placeholder="الوصف (AR)" className="w-full text-sm py-1 outline-none bg-transparent" rows={2} />
                                                </div>
                                            </div>
                                            <input value={item.iconFA || ''} onChange={e => { const n = [...whyChooseUs]; n[i].iconFA = e.target.value; setWhyChooseUs(n); }} placeholder="FA Icon" className="w-full mt-4 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 outline-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FAQ & SEO Tab */}
                    {activeTab === 'extra' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-8">
                                <h2 className="text-2xl font-black">Frequently Asked Questions</h2>
                                <div className="space-y-6">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-800/30 rounded-[32px] border border-zinc-100 dark:border-zinc-700 relative grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <button type="button" onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500"><i className="fas fa-times" /></button>
                                            <div className="space-y-4">
                                                <input value={faq.question} onChange={e => { const n = [...faqs]; n[i].question = e.target.value; setFaqs(n); }} placeholder="Question (EN)" className="w-full font-black border-b border-zinc-200 dark:border-zinc-700 py-1 outline-none" />
                                                <textarea value={faq.answer} onChange={e => { const n = [...faqs]; n[i].answer = e.target.value; setFaqs(n); }} placeholder="Answer (EN)" className="w-full text-sm py-1 outline-none bg-transparent" rows={3} />
                                            </div>
                                            <div className="space-y-4 text-right" dir="rtl">
                                                <input value={faq.questionAr || ''} onChange={e => { const n = [...faqs]; n[i].questionAr = e.target.value; setFaqs(n); }} placeholder="السؤال (AR)" className="w-full font-black border-b border-zinc-200 dark:border-zinc-700 py-1 outline-none" />
                                                <textarea value={faq.answerAr || ''} onChange={e => { const n = [...faqs]; n[i].answerAr = e.target.value; setFaqs(n); }} placeholder="الإجابة (AR)" className="w-full text-sm py-1 outline-none bg-transparent" rows={3} />
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])} className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-6 rounded-[32px] text-zinc-400 font-black uppercase tracking-widest hover:border-blue-500/50 hover:text-blue-500 transition-all">+ Add Question</button>
                                </div>
                            </div>

                            <div className="space-y-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                                <h2 className="text-2xl font-black">Final CTA & SEO</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Meta Title (EN)</label>
                                        <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold" />
                                    </div>
                                    <div className="space-y-3 text-right" dir="rtl">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Meta Title (AR)</label>
                                        <input type="text" name="metaTitleAr" value={formData.metaTitleAr} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Meta Description (EN)</label>
                                        <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium" />
                                    </div>
                                    <div className="space-y-3 text-right" dir="rtl">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Meta Description (AR)</label>
                                        <textarea name="metaDescriptionAr" value={formData.metaDescriptionAr} onChange={handleInputChange} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-medium" />
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
