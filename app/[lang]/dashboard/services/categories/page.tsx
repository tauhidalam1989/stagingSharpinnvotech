'use client';

import React, { useState, useEffect } from 'react';
import { 
    ServiceCategory, 
    getServiceCategories, 
    createServiceCategory, 
    updateServiceCategory, 
    deleteServiceCategory 
} from '@/lib/api';

export default function ServiceCategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        nameAr: '',
        slug: '',
        icon: '',
        order: 0,
        isActive: true
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getServiceCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            nameAr: '',
            slug: '',
            icon: '',
            order: 0,
            isActive: true
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (cat: ServiceCategory) => {
        setEditingId(cat.id);
        setFormData({
            name: cat.name,
            nameAr: cat.nameAr || '',
            slug: cat.slug,
            icon: cat.icon || '',
            order: cat.order,
            isActive: cat.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            const res = await deleteServiceCategory(id);
            if (res.success) {
                loadData();
            } else {
                alert(res.message || 'Error deleting category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = editingId 
                ? await updateServiceCategory(editingId, formData)
                : await createServiceCategory(formData);

            if (res.success) {
                resetForm();
                loadData();
            } else {
                alert(res.message || 'Error saving category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Service Categories</h1>
                    <p className="text-xs text-zinc-500 font-medium">Manage how your services are grouped.</p>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all group"
                    >
                        <i className="fas fa-plus text-xs"></i>
                        Add Category
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                        <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                            {editingId ? 'Edit Category' : 'Create New Category'}
                        </h3>
                        <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Name (English) *</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                                    placeholder="e.g., Digital Transformation"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Name (Arabic)</label>
                                <input 
                                    type="text" 
                                    name="nameAr"
                                    value={formData.nameAr}
                                    onChange={handleInputChange}
                                    dir="rtl"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="التحول الرقمي"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Icon Class (FontAwesome)</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 text-xl shrink-0">
                                        {formData.icon 
                                            ? <i className={formData.icon}></i>
                                            : <i className="fas fa-tag opacity-30"></i>
                                        }
                                    </div>
                                    <input 
                                        type="text" 
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                        placeholder="fas fa-shield-alt"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium">Enter a FontAwesome class, e.g. <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">fas fa-shield-alt</code>. Preview updates live.</p>
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
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                    placeholder="digital-transformation"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Display Order</label>
                                <input 
                                    type="number" 
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <input 
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange as any}
                                className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                Active (Categories must be active to be selectable)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-xs"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 text-xs"
                            >
                                {submitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                                {editingId ? 'Update Category' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Order</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Icon</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Name (EN)</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Name (AR)</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Slug</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Status</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-10 text-center">
                                        <i className="fas fa-spinner fa-spin text-blue-600 text-xl"></i>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-10 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-zinc-900 dark:text-white">{cat.order}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {cat.icon
                                                ? <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 text-base border border-blue-100 dark:border-blue-500/20"><i className={cat.icon}></i></div>
                                                : <span className="text-zinc-300 dark:text-zinc-600 text-xs font-mono">—</span>
                                            }
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{cat.name}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-zinc-400" dir="rtl">{cat.nameAr || '-'}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[11px] font-medium text-zinc-500 font-mono">{cat.slug}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                                cat.isActive 
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <button 
                                                    onClick={() => handleEdit(cat)}
                                                    className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                >
                                                    <i className="fas fa-edit text-sm"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
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
        </div>
    );
}
