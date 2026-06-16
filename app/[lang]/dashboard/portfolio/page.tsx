'use client';

import React, { useState, useEffect } from 'react';
import {
    getAdminPortfolioProfile,
    updatePortfolioProfile,
    getPortfolioItems,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    PortfolioProfile,
    PortfolioItem,
    getMediaUrl
} from '@/lib/api';

export default function PortfolioManagementPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [activeTab, setActiveTab] = useState<'profile' | 'items'>('profile');
    
    // Profile settings states
    const [profile, setProfile] = useState<PortfolioProfile | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Items list states
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    
    // Item form states
    const [itemTitle, setItemTitle] = useState('');
    const [itemLink, setItemLink] = useState('');
    const [itemOrder, setItemOrder] = useState('0');
    const [itemIsActive, setItemIsActive] = useState(true);
    const [itemImageFile, setItemImageFile] = useState<File | null>(null);
    const [itemImagePreview, setItemImagePreview] = useState('');
    const [itemAttachFile, setItemAttachFile] = useState<File | null>(null);
    const [itemAttachName, setItemAttachName] = useState('');
    const [savingItem, setSavingItem] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchItems();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getAdminPortfolioProfile();
            if (data) {
                setProfile(data);
                if (data.logo) {
                    setLogoPreview(getMediaUrl(data.logo));
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchItems = async () => {
        setLoadingItems(true);
        try {
            const data = await getPortfolioItems();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSavingProfile(true);
        setProfileMessage(null);

        try {
            const formData = new FormData();
            formData.append('companyName', profile.companyName || '');
            formData.append('title', profile.title || '');
            formData.append('instagram', profile.instagram || '');
            formData.append('facebook', profile.facebook || '');
            formData.append('twitter', profile.twitter || '');
            formData.append('linkedin', profile.linkedin || '');
            formData.append('email', profile.email || '');
            formData.append('phone', profile.phone || '');
            formData.append('bottomCtaText', profile.bottomCtaText || '');
            formData.append('bottomCtaLink', profile.bottomCtaLink || '');
            
            if (logoFile) {
                formData.append('portfolioLogo', logoFile);
            }

            const res = await updatePortfolioProfile(formData);
            if (res.success) {
                setProfileMessage({ type: 'success', text: 'Portfolio settings updated successfully!' });
                fetchProfile();
                setLogoFile(null);
            } else {
                setProfileMessage({ type: 'error', text: res.message || 'Error updating settings' });
            }
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setItemTitle('');
        setItemLink('');
        setItemOrder('0');
        setItemIsActive(true);
        setItemImageFile(null);
        setItemImagePreview('');
        setItemAttachFile(null);
        setItemAttachName('');
        setItemModalOpen(true);
    };

    const handleOpenEditModal = (item: PortfolioItem) => {
        setEditingItem(item);
        setItemTitle(item.title);
        setItemLink(item.link || '');
        setItemOrder(String(item.order));
        setItemIsActive(item.isActive);
        setItemImageFile(null);
        setItemImagePreview(item.image ? getMediaUrl(item.image) : '');
        setItemAttachFile(null);
        setItemAttachName(item.attachment ? item.attachment.split('/').pop() || 'Attachment' : '');
        setItemModalOpen(true);
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingItem(true);

        try {
            const formData = new FormData();
            formData.append('title', itemTitle);
            formData.append('link', itemLink);
            formData.append('order', itemOrder);
            formData.append('isActive', String(itemIsActive));

            if (itemImageFile) {
                formData.append('image', itemImageFile);
            }
            if (itemAttachFile) {
                formData.append('attachment', itemAttachFile);
            }

            let res;
            if (editingItem) {
                res = await updatePortfolioItem(editingItem.id, formData);
            } else {
                res = await createPortfolioItem(formData);
            }

            if (res.success) {
                setItemModalOpen(false);
                fetchItems();
            } else {
                alert(res.message || 'Error saving portfolio item');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('An unexpected error occurred.');
        } finally {
            setSavingItem(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
        try {
            const res = await deletePortfolioItem(id);
            if (res.success) {
                fetchItems();
            } else {
                alert(res.message || 'Error deleting item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('An unexpected error occurred.');
        }
    };

    const handleToggleItemStatus = async (item: PortfolioItem) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!item.isActive));
            const res = await updatePortfolioItem(item.id, formData);
            if (res.success) {
                fetchItems();
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Portfolio Management</h1>
                    <p className="text-zinc-500 font-medium italic mt-1.5">Manage your Linktree-style profile and quick-access menu items.</p>
                </div>
                {activeTab === 'items' && (
                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-95"
                    >
                        <i className="fas fa-plus"></i>
                        Add Portfolio Link
                    </button>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === 'profile'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                >
                    <i className="fas fa-id-card mr-2"></i>
                    Profile Settings
                </button>
                <button
                    onClick={() => setActiveTab('items')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === 'items'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                >
                    <i className="fas fa-link mr-2"></i>
                    Menu Links
                </button>
            </div>

            {/* TAB 1: PROFILE SETTINGS */}
            {activeTab === 'profile' && profile && (
                <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Logo upload & preview */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center shadow-sm">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-6">Profile Logo</h3>
                        
                        <div className="relative group w-32 h-32 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shadow-inner mb-6">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                            ) : (
                                <i className="fas fa-building text-4xl text-zinc-300"></i>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold cursor-pointer">
                                <i className="fas fa-camera text-lg mb-1"></i>
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setLogoFile(file);
                                            setLogoPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-zinc-400">Square dimensions recommended. Max size 5MB.</p>
                    </div>

                    {/* Right: Input fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {profileMessage && (
                            <div className={`p-4 rounded-2xl border text-sm font-bold ${
                                profileMessage.type === 'success'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400'
                            }`}>
                                {profileMessage.text}
                            </div>
                        )}

                        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6 shadow-sm">
                            <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">General Info</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profile.companyName || ''}
                                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title / Subtitle</label>
                                    <input
                                        type="text"
                                        value={profile.title || ''}
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6 shadow-sm">
                            <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Social Links</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"><i className="fab fa-instagram mr-1.5 text-pink-500"></i> Instagram Link</label>
                                    <input
                                        type="url"
                                        value={profile.instagram || ''}
                                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"><i className="fab fa-facebook mr-1.5 text-blue-600"></i> Facebook Link</label>
                                    <input
                                        type="url"
                                        value={profile.facebook || ''}
                                        onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                                        placeholder="https://facebook.com/..."
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"><i className="fab fa-x-twitter mr-1.5 text-zinc-900 dark:text-white"></i> X (Twitter) Link</label>
                                    <input
                                        type="url"
                                        value={profile.twitter || ''}
                                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                                        placeholder="https://x.com/..."
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"><i className="fab fa-linkedin mr-1.5 text-blue-700"></i> LinkedIn Link</label>
                                    <input
                                        type="url"
                                        value={profile.linkedin || ''}
                                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"><i className="fas fa-envelope mr-1.5 text-red-500"></i> Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email || ''}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        placeholder="contact@company.com"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"><i className="fas fa-phone mr-1.5 text-green-500"></i> Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone || ''}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="+966 ..."
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6 shadow-sm">
                            <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Bottom CTA Button</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">CTA Button Text</label>
                                    <input
                                        type="text"
                                        value={profile.bottomCtaText || ''}
                                        onChange={(e) => setProfile({ ...profile, bottomCtaText: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">CTA Button Link</label>
                                    <input
                                        type="url"
                                        value={profile.bottomCtaLink || ''}
                                        onChange={(e) => setProfile({ ...profile, bottomCtaLink: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm"
                            >
                                {savingProfile ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-1"></i>
                                        Saving Settings...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-1"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* TAB 2: MENU ITEMS */}
            {activeTab === 'items' && (
                <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Thumbnail</th>
                                    <th className="px-8 py-4">Title</th>
                                    <th className="px-8 py-4">Link URL</th>
                                    <th className="px-8 py-4">Attachment</th>
                                    <th className="px-8 py-4">Order</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {loadingItems ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={7} className="px-8 py-6">
                                                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-10 text-center">
                                            <p className="text-zinc-400 font-medium italic">No links added to your portfolio yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => handleToggleItemStatus(item)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                                                        item.isActive
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800'
                                                            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800'
                                                    }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-600' : 'bg-zinc-400'}`}></span>
                                                    {item.isActive ? 'Active' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center p-1 overflow-hidden">
                                                    {item.image ? (
                                                        <img src={getMediaUrl(item.image)} alt="" className="w-full h-full object-cover rounded-md" />
                                                    ) : (
                                                        <i className="fas fa-link text-zinc-300 text-sm"></i>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline font-bold truncate max-w-[200px] block">
                                                        {item.link}
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic">None</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                {item.attachment ? (
                                                    <a href={getMediaUrl(item.attachment)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-blue-500 font-semibold">
                                                        <i className="fas fa-file-download"></i>
                                                        File
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic">None</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-black text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">#{item.order}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit text-sm"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash text-sm"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ITEM CREATE/EDIT MODAL OVERLAY */}
            {itemModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                {editingItem ? 'Edit Portfolio Link' : 'Add Portfolio Link'}
                            </h2>
                            <button
                                onClick={() => setItemModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:scale-105 active:scale-95 transition-all"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleItemSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Button Title</label>
                                <input
                                    type="text"
                                    required
                                    value={itemTitle}
                                    onChange={(e) => setItemTitle(e.target.value)}
                                    placeholder="e.g. Website Brochure, Company Profile"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            </div>

                            {/* URL Link */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Target URL (Optional)</label>
                                <input
                                    type="url"
                                    value={itemLink}
                                    onChange={(e) => setItemLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            </div>

                            {/* Thumbnail Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Thumbnail Image (Optional)</label>
                                <div className="flex gap-4 items-center">
                                    {itemImagePreview && (
                                        <div className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center p-1 shrink-0 bg-zinc-50 dark:bg-zinc-800">
                                            <img src={itemImagePreview} alt="" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/5 transition-all text-center">
                                        <i className="fas fa-image text-lg text-zinc-400 mb-1"></i>
                                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Choose Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setItemImageFile(file);
                                                    setItemImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Attachment File */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Attachment File (Optional)</label>
                                <div className="flex gap-4 items-center">
                                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/5 transition-all text-center">
                                        <i className="fas fa-file-upload text-lg text-zinc-400 mb-1"></i>
                                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                            {itemAttachName || 'Upload PDF/Doc'}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setItemAttachFile(file);
                                                    setItemAttachName(file.name);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Order & Active Status */}
                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Sorting Order</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={itemOrder}
                                        onChange={(e) => setItemOrder(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <div className="flex items-center gap-2.5 h-full pt-6">
                                    <input
                                        type="checkbox"
                                        id="isActiveCheck"
                                        checked={itemIsActive}
                                        onChange={(e) => setItemIsActive(e.target.checked)}
                                        className="w-5 h-5 rounded-md border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActiveCheck" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 select-none cursor-pointer">
                                        Active / Visible
                                    </label>
                                </div>
                            </div>

                            {/* Modal Footer Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setItemModalOpen(false)}
                                    className="flex-1 py-3 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingItem}
                                    className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold transition-all active:scale-95 text-sm"
                                >
                                    {savingItem ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-1"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Link'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
