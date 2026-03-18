'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ServicePage, 
    ServiceCategory, 
    getServiceCategories, 
    createService, 
    updateService,
    ProcessItem,
    CapabilityItem,
    BenefitItem,
    WhyChooseUsItem,
    FAQItem,
    AboutPillarItem,
    IndustryItem,
    CriticalCardItem,
    ApiResponse
} from '@/lib/api';

interface ServiceFormProps {
    lang: string;
    service?: ServicePage;
    isEdit?: boolean;
}

type TabType = 'basic' | 'hero' | 'about' | 'capabilities' | 'industries' | 'critical' | 'wcu' | 'process' | 'faq' | 'seo';

export default function ServiceForm({ lang, service, isEdit }: ServiceFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('basic');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [previews, setPreviews] = useState<{ [key: string]: string | string[] }>({});
    const [files, setFiles] = useState<{ [key: string]: File | File[] }>({});

    const DEFAULT_FORM_DATA: Partial<ServicePage> = {
        heroTitle: '',
        heroTitleAr: '',
        slug: '',
        categoryId: undefined,
        heroTagline: '',
        heroTaglineAr: '',
        heroIntroduction: '',
        heroIntroductionAr: '',
        cardIcon: 'fas fa-cog',
        heroIcon: 'fas fa-rocket',
        order: 0,
        isPublished: false,
        primaryCtaText: '',
        primaryCtaTextAr: '',
        primaryCtaLink: '',
        secondaryCtaText: '',
        secondaryCtaTextAr: '',
        secondaryCtaLink: '',
        overviewSectionTitle: '',
        overviewSectionTitleAr: '',
        processSectionTitle: '',
        processSectionTitleAr: '',
        capabilitiesSectionTitle: '',
        capabilitiesSectionTitleAr: '',
        benefitsSectionTitle: '',
        benefitsSectionTitleAr: '',
        whyChooseUsSectionTitle: '',
        whyChooseUsSectionTitleAr: '',
        whyChooseUsDescription: '',
        whyChooseUsDescriptionAr: '',
        whyChooseUsBottomNote: '',
        whyChooseUsBottomNoteAr: '',
        aboutSectionTitle: '',
        aboutSectionTitleAr: '',
        aboutSectionDescription: '',
        aboutSectionDescriptionAr: '',
        aboutSectionBottomNote: '',
        aboutSectionBottomNoteAr: '',
        industriesSectionTitle: '',
        industriesSectionTitleAr: '',
        industriesSectionDescription: '',
        industriesSectionDescriptionAr: '',
        industriesSectionBottomNote: '',
        industriesSectionBottomNoteAr: '',
        criticalSectionTitle: '',
        criticalSectionTitleAr: '',
        criticalSectionDescription: '',
        criticalSectionDescriptionAr: '',
        criticalSectionButtonText: '',
        criticalSectionButtonTextAr: '',
        criticalSectionButtonLink: '',
        criticalRightTitle: '',
        criticalRightTitleAr: '',
        metaKeywordsAr: '',
        process: [],
        capabilities: [],
        benefits: [],
        whyChooseUs: [],
        faqs: [],
        aboutPillars: [],
        industries: [],
        criticalCards: []
    };

    const [formData, setFormData] = useState<Partial<ServicePage>>(() => {
        return service ? { ...DEFAULT_FORM_DATA, ...service } : DEFAULT_FORM_DATA;
    });

    useEffect(() => {
        const fetchCats = async () => {
            const cats = await getServiceCategories();
            setCategories(cats);
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (service) {
            setFormData({ ...DEFAULT_FORM_DATA, ...service });
            
            // Initialize previews
            const initialPreviews: { [key: string]: string | string[] } = {};
            if (service.heroImage) initialPreviews.heroImage = getImageUrl(service.heroImage);
            if (service.aboutSectionImage) initialPreviews.aboutSectionImage = getImageUrl(service.aboutSectionImage);
            if (service.industriesImage) initialPreviews.industriesImage = getImageUrl(service.industriesImage);
            setPreviews(initialPreviews);
        }
    }, [service]);

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

        if (name === 'heroTitle' && !isEdit) {
            const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const addArrayItem = (field: keyof ServicePage, defaultItem: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...((prev[field] as any[]) || []), defaultItem]
        }));
    };

    const removeArrayItem = (field: keyof ServicePage, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (field: keyof ServicePage, index: number, itemField: string, value: any) => {
        setFormData(prev => {
            const arr = [...((prev[field] as any[]) || [])];
            arr[index] = { ...arr[index], [itemField]: value };
            return { ...prev, [field]: arr };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, [field]: file }));
            setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            
            // Append all fields except restricted ones
            const restrictedFields = ['id', 'createdAt', 'updatedAt', 'category', 'views', 'createdBy', 'updatedBy', 'deletedAt', 'deletedBy', 'creator', 'updater'];
            Object.keys(formData).forEach(key => {
                if (restrictedFields.includes(key)) return;
                
                const value = formData[key as keyof ServicePage];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        const sanitizedValue = value.map(item => {
                            if (typeof item === 'object' && item !== null) {
                                const { iconType, ...rest } = item as any;
                                return rest;
                            }
                            return item;
                        });
                        data.append(key, JSON.stringify(sanitizedValue));
                    } else {
                        data.append(key, value.toString());
                    }
                }
            });

            // Append files
            Object.keys(files).forEach(key => {
                const file = files[key];
                if (file) {
                    data.append(key, file as File);
                }
            });

            let res: ApiResponse<ServicePage>;
            if (isEdit && service) {
                // For update, we might need to handle it differently if the API expects JSON
                // But following the ProductForm model which uses FormData for creation
                // Let's check updateService implementation in lib/api.ts
                res = await updateService(service.id, data);
            } else {
                res = await createService(data);
            }

            if (res.success) {
                router.push(`/${lang}/dashboard/services`);
                router.refresh();
            } else {
                alert(res.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving service:', error);
            alert('An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label: string, name: string, type = 'text', placeholder = '', required = false) => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">{label}</label>
            <input
                type={type}
                name={name}
                value={(formData[name as keyof ServicePage] as any) || ''}
                onChange={handleInputChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
        </div>
    );

    const renderTextarea = (label: string, name: string, placeholder = '') => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">{label}</label>
            <textarea
                name={name}
                value={(formData[name as keyof ServicePage] as any) || ''}
                onChange={handleInputChange}
                placeholder={placeholder}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
            />
        </div>
    );

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button 
                    type="button"
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-blue-600 transition-all shadow-sm"
                >
                    <i className="fas fa-arrow-left text-sm"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{isEdit ? 'Edit Service' : 'Add New Service'}</h1>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Services Module Dashboard</p>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save shadow-sm"></i>}
                {isEdit ? 'Update Service' : 'Save Service'}
            </button>
        </div>
    );

    const renderTabs = () => (
        <div className="flex flex-wrap gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-[20px] mb-8 border border-zinc-200 dark:border-zinc-800 w-fit">
            {Object.keys(tabIcons).map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`px-4 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeTab === tab 
                            ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm border border-zinc-200/50 dark:border-zinc-700' 
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                    <i className={`fas ${tabIcons[tab as TabType]} text-xs`}></i>
                    {tab}
                </button>
            ))}
        </div>
    );

    const tabIcons: { [key in TabType]: string } = {
        basic: 'fa-info-circle',
        hero: 'fa-clapperboard',
        about: 'fa-heart',
        capabilities: 'fa-bolt',
        industries: 'fa-building',
        critical: 'fa-shield-halved',
        wcu: 'fa-award',
        process: 'fa-diagram-project',
        faq: 'fa-circle-question',
        seo: 'fa-globe'
    };

    return (
        <form onSubmit={handleSubmit} className="pb-24">
            {renderHeader()}
            {renderTabs()}

            <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-8 min-h-[600px]">
                {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-6">
                            {renderInput('Service Title (EN)', 'heroTitle', 'text', 'Enter service title', true)}
                            {renderInput('Service Title (AR)', 'heroTitleAr', 'text', 'عنوان الخدمة', false)}
                            {renderInput('Slug Path', 'slug', 'text', 'service-slug', true)}
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Category</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {renderInput('Display Order', 'order', 'number')}
                            {renderInput('Card Icon (FA Class)', 'cardIcon', 'text', 'fas fa-cog')}
                            
                            <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="isPublished"
                                            checked={formData.isPublished || false}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">Published Status</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                         <div className="space-y-6">
                            {renderInput('Hero Tagline (EN)', 'heroTagline')}
                            {renderInput('Hero Tagline (AR)', 'heroTaglineAr')}
                            {renderTextarea('Hero Introduction (EN)', 'heroIntroduction')}
                            {renderTextarea('Hero Introduction (AR)', 'heroIntroductionAr')}
                            {renderInput('Hero Icon (FA Class)', 'heroIcon')}
                         </div>
                         <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Hero Image</label>
                                <div className="relative group aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
                                    {previews.heroImage ? (
                                        <>
                                            <img src={previews.heroImage as string} className="w-full h-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <label className="p-3 bg-white text-zinc-900 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                                                    <i className="fas fa-camera text-sm"></i>
                                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'heroImage')} accept="image/*" />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center gap-2 cursor-pointer text-zinc-400 group-hover:text-blue-500 transition-colors">
                                            <i className="fas fa-cloud-arrow-up text-3xl"></i>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Image</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'heroImage')} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>
                         </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {renderInput('About Title (EN)', 'aboutSectionTitle')}
                                {renderInput('About Title (AR)', 'aboutSectionTitleAr')}
                                {renderTextarea('About Description (EN)', 'aboutSectionDescription')}
                                {renderTextarea('About Description (AR)', 'aboutSectionDescriptionAr')}
                                {renderTextarea('Bottom Note (EN)', 'aboutSectionBottomNote')}
                                {renderTextarea('Bottom Note (AR)', 'aboutSectionBottomNoteAr')}
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">About Section Image</label>
                                    <div className="aspect-[4/3] rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-800">
                                        {previews.aboutSectionImage ? (
                                            <div className="relative h-full group">
                                                <img src={previews.aboutSectionImage as string} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                    <i className="fas fa-camera text-white"></i>
                                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'aboutSectionImage')} />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className="h-full flex flex-col items-center justify-center gap-2 cursor-pointer text-zinc-300">
                                                <i className="fas fa-file-image text-3xl"></i>
                                                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'aboutSectionImage')} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Pillars / Values</h3>
                                <button type="button" onClick={() => addArrayItem('aboutPillars', { title: '', iconFA: 'fas fa-shield-halved' })} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:bg-emerald-100">+ Add Pillar</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(formData.aboutPillars || []).map((pillar, i) => (
                                    <div key={i} className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative space-y-4">
                                        <button type="button" onClick={() => removeArrayItem('aboutPillars', i)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors"><i className="fas fa-times-circle"></i></button>
                                        <div className="grid grid-cols-1 gap-4 mt-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Title (EN)</label>
                                                <input value={pillar.title || ''} onChange={e => updateArrayItem('aboutPillars', i, 'title', e.target.value)} placeholder="Title (EN)" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Title (AR)</label>
                                                <input value={pillar.titleAr || ''} onChange={e => updateArrayItem('aboutPillars', i, 'titleAr', e.target.value)} placeholder="Title (AR)" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none text-right focus:ring-2 focus:ring-emerald-500/20" dir="rtl" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Icon Class (FA)</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"><i className={pillar.iconFA || 'fas fa-shield-halved'}></i></span>
                                                    <input value={pillar.iconFA || ''} onChange={e => updateArrayItem('aboutPillars', i, 'iconFA', e.target.value)} placeholder="Icon class" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'capabilities' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderInput('Section Title (EN)', 'capabilitiesSectionTitle')}
                            {renderInput('Section Title (AR)', 'capabilitiesSectionTitleAr')}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Service Capabilities</h3>
                                <button type="button" onClick={() => addArrayItem('capabilities', { title: '', description: '', icon: 'fas fa-rocket' })} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">+ Add Capability</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(formData.capabilities || []).map((cap, i) => (
                                    <div key={i} className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative">
                                        <button type="button" onClick={() => removeArrayItem('capabilities', i)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500"><i className="fas fa-times-circle"></i></button>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input value={cap.title || ''} onChange={e => updateArrayItem('capabilities', i, 'title', e.target.value)} placeholder="Title (EN)" className="px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
                                                <input value={cap.icon || ''} onChange={e => updateArrayItem('capabilities', i, 'icon', e.target.value)} placeholder="Icon class" className="px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
                                            </div>
                                            <input value={cap.titleAr || ''} onChange={e => updateArrayItem('capabilities', i, 'titleAr', e.target.value)} placeholder="Title (AR)" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none text-right" dir="rtl" />
                                            <textarea value={cap.description || ''} onChange={e => updateArrayItem('capabilities', i, 'description', e.target.value)} placeholder="Description (EN)" rows={2} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none resize-none" />
                                            <textarea value={cap.descriptionAr || ''} onChange={e => updateArrayItem('capabilities', i, 'descriptionAr', e.target.value)} placeholder="Description (AR)" rows={2} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none resize-none text-right" dir="rtl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'industries' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderInput('Section Title (EN)', 'industriesSectionTitle')}
                            {renderInput('Section Title (AR)', 'industriesSectionTitleAr')}
                            {renderTextarea('Description (EN)', 'industriesSectionDescription')}
                            {renderTextarea('Description (AR)', 'industriesSectionDescriptionAr')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Target Industries</h3>
                                    <button type="button" onClick={() => addArrayItem('industries', { title: '', iconFA: 'fas fa-building' })} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">+ Add Industry</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(formData.industries || []).map((industry, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative">
                                            <button type="button" onClick={() => removeArrayItem('industries', i)} className="absolute top-4 right-4 text-red-500"><i className="fas fa-trash text-xs"></i></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input value={industry.title || ''} onChange={e => updateArrayItem('industries', i, 'title', e.target.value)} placeholder="Title (EN)" className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none" />
                                                <input value={industry.titleAr || ''} onChange={e => updateArrayItem('industries', i, 'titleAr', e.target.value)} placeholder="Title (AR)" className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-right" dir="rtl" />
                                                <input value={industry.iconFA || ''} onChange={e => updateArrayItem('industries', i, 'iconFA', e.target.value)} placeholder="Icon class" className="col-span-2 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Industry Image</label>
                                    <div className="aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-2">
                                        {previews.industriesImage ? (
                                            <div className="relative h-full group">
                                                <img src={previews.industriesImage as string} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                    <i className="fas fa-camera text-white"></i>
                                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'industriesImage')} />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className="h-full flex flex-col items-center justify-center gap-2 cursor-pointer text-zinc-300">
                                                <i className="fas fa-image text-3xl"></i>
                                                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'industriesImage')} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                {renderTextarea('Bottom Note (EN)', 'industriesSectionBottomNote')}
                                {renderTextarea('Bottom Note (AR)', 'industriesSectionBottomNoteAr')}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'critical' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderInput('Impact Section Title (EN)', 'criticalSectionTitle')}
                            {renderInput('Impact Section Title (AR)', 'criticalSectionTitleAr')}
                            {renderTextarea('Description (EN)', 'criticalSectionDescription')}
                            {renderTextarea('Description (AR)', 'criticalSectionDescriptionAr')}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Impact Metrics / Cards</h3>
                                <button type="button" onClick={() => addArrayItem('criticalCards', { title: '', iconFA: 'fas fa-chart-line' })} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">+ Add Metric</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(formData.criticalCards || []).map((card, i) => (
                                    <div key={i} className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative space-y-4">
                                        <button type="button" onClick={() => removeArrayItem('criticalCards', i)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500"><i className="fas fa-times"></i></button>
                                        <input value={card.title || ''} onChange={e => updateArrayItem('criticalCards', i, 'title', e.target.value)} placeholder="Metric Label (EN)" className="w-full px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
                                        <input value={card.titleAr || ''} onChange={e => updateArrayItem('criticalCards', i, 'titleAr', e.target.value)} placeholder="Metric Label (AR)" className="w-full px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none text-right" dir="rtl" />
                                        <input value={card.iconFA || ''} onChange={e => updateArrayItem('criticalCards', i, 'iconFA', e.target.value)} placeholder="Icon class" className="w-full px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'wcu' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderInput('Section Title (EN)', 'whyChooseUsSectionTitle')}
                            {renderInput('Section Title (AR)', 'whyChooseUsSectionTitleAr')}
                            {renderTextarea('Description (EN)', 'whyChooseUsDescription')}
                            {renderTextarea('Description (AR)', 'whyChooseUsDescriptionAr')}
                            {renderTextarea('Bottom Note (EN)', 'whyChooseUsBottomNote')}
                            {renderTextarea('Bottom Note (AR)', 'whyChooseUsBottomNoteAr')}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Value Points</h3>
                                <button type="button" onClick={() => addArrayItem('whyChooseUs', { title: '', iconFA: 'fas fa-check-circle' })} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">+ Add Point</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(formData.whyChooseUs || []).map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative">
                                        <button type="button" onClick={() => removeArrayItem('whyChooseUs', i)} className="absolute -top-2 -right-2 text-red-500 bg-white dark:bg-zinc-900 rounded-full w-5 h-5 flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800"><i className="fas fa-times text-[10px]"></i></button>
                                        <div className="space-y-3">
                                            <input value={item.title || ''} onChange={e => updateArrayItem('whyChooseUs', i, 'title', e.target.value)} placeholder="Point (EN)" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none" />
                                            <input value={item.titleAr || ''} onChange={e => updateArrayItem('whyChooseUs', i, 'titleAr', e.target.value)} placeholder="القطة" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-right" dir="rtl" />
                                            <input value={item.iconFA || ''} onChange={e => updateArrayItem('whyChooseUs', i, 'iconFA', e.target.value)} placeholder="Icon class" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'process' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderInput('Section Title (EN)', 'processSectionTitle')}
                            {renderInput('Section Title (AR)', 'processSectionTitleAr')}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Process Steps</h3>
                                <button type="button" onClick={() => addArrayItem('process', { title: '', description: '', icon: 'fas fa-arrow-right' })} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">+ Add Step</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {(formData.process || []).map((step, i) => (
                                    <div key={i} className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative group">
                                        <button type="button" onClick={() => removeArrayItem('process', i)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors"><i className="fas fa-times-circle"></i></button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <input value={step.title || ''} onChange={e => updateArrayItem('process', i, 'title', e.target.value)} placeholder="Step Title (EN)" className="px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
                                            <input value={step.titleAr || ''} onChange={e => updateArrayItem('process', i, 'titleAr', e.target.value)} placeholder="Step Title (AR)" className="px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none text-right" dir="rtl" />
                                            <input value={step.icon || ''} onChange={e => updateArrayItem('process', i, 'icon', e.target.value)} placeholder="Icon (FA Class)" className="px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
                                            <div className="md:col-span-3">
                                                <textarea value={step.description || ''} onChange={e => updateArrayItem('process', i, 'description', e.target.value)} placeholder="Description (EN)" rows={2} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none resize-none" />
                                            </div>
                                            <div className="md:col-span-3">
                                                <textarea value={step.descriptionAr || ''} onChange={e => updateArrayItem('process', i, 'descriptionAr', e.target.value)} placeholder="Description (AR)" rows={2} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none resize-none text-right" dir="rtl" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'faq' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2">FAQ Management</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-400 italic">Add common questions and answers for this service.</p>
                                <button type="button" onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="px-6 py-2.5 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest transition-all">+ New FAQ</button>
                            </div>
                            <div className="space-y-6">
                                {(formData.faqs || []).map((faq, i) => (
                                    <div key={i} className="p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative">
                                        <button type="button" onClick={() => removeArrayItem('faqs', i)} className="absolute top-6 right-6 text-zinc-300 hover:text-red-500"><i className="fas fa-trash"></i></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <input value={faq.question || ''} onChange={e => updateArrayItem('faqs', i, 'question', e.target.value)} placeholder="Question (EN)" className="w-full px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none" />
                                                <textarea value={faq.answer || ''} onChange={e => updateArrayItem('faqs', i, 'answer', e.target.value)} placeholder="Answer (EN)" rows={3} className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none resize-none" />
                                            </div>
                                            <div className="space-y-4">
                                                <input value={faq.questionAr || ''} onChange={e => updateArrayItem('faqs', i, 'questionAr', e.target.value)} placeholder="السؤال" className="w-full px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none text-right" dir="rtl" />
                                                <textarea value={faq.answerAr || ''} onChange={e => updateArrayItem('faqs', i, 'answerAr', e.target.value)} placeholder="الإجابة" rows={3} className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none resize-none text-right" dir="rtl" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}


                {activeTab === 'seo' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-6">
                            {renderInput('Meta Title (EN)', 'metaTitle')}
                            {renderTextarea('Meta Description (EN)', 'metaDescription')}
                            {renderInput('Keywords (EN)', 'metaKeywords', 'text', 'keyword1, keyword2...')}
                        </div>
                        <div className="space-y-6">
                            {renderInput('Meta Title (AR)', 'metaTitleAr')}
                            {renderTextarea('Meta Description (AR)', 'metaDescriptionAr')}
                            {renderInput('Keywords (AR)', 'metaKeywordsAr', 'text', 'كلمة 1, كلمة 2...')}
                        </div>
                    </div>
                )}

            </div>
        </form>
    );
}
