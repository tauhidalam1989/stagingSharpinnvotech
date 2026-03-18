'use client'

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    getProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    ProductCategory
} from '@/lib/api';

export default function AdminProductCategories() {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        nameAr: '',
        slug: '',
        order: 0,
        isActive: true
    });

    const loadCategories = async () => {
        setLoading(true);
        const data = await getProductCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        if (name === 'name' && !editingId) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const res = editingId
            ? await updateProductCategory(editingId, formData)
            : await createProductCategory(formData);

        if (res.success) {
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', nameAr: '', slug: '', order: 0, isActive: true });
            loadCategories();
        } else {
            setError(res.message || 'Something went wrong');
        }
        setSubmitting(false);
    };

    const handleEdit = (category: ProductCategory) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            nameAr: category.nameAr || '',
            slug: category.slug,
            order: category.order,
            isActive: category.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const res = await deleteProductCategory(id);
            if (res.success) {
                loadCategories();
            } else {
                alert(res.message || 'Error deleting category');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Product Categories</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Classify your products for better organization.</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ name: '', nameAr: '', slug: '', order: 0, isActive: true });
                                setShowForm(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-plus" />
                            <span>Add New Category</span>
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border-2 border-blue-500/20 shadow-xl shadow-blue-500/5 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black">{editingId ? 'Edit Category' : 'Create New Category'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                <i className="fas fa-times text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Category Name (EN)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2" dir="rtl">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">الاسم (العربية)</label>
                                    <input
                                        type="text"
                                        name="nameAr"
                                        value={formData.nameAr}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
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
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Sort Order</label>
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
                                                    name="isActive"
                                                    checked={formData.isActive}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                <div className={`w-14 h-8 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}></div>
                                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-6' : ''}`}></div>
                                            </div>
                                            <span className="font-black text-sm uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                                                {formData.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-red-500 font-bold text-center">{error}</p>}

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-black uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting ? <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : editingId ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Order</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Name</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Slug</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-10 h-24 bg-zinc-50/50 dark:bg-zinc-800/20"></td>
                                        </tr>
                                    ))
                                ) : categories.length > 0 ? (
                                    categories.sort((a, b) => a.order - b.order).map((cat) => (
                                        <tr key={cat.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group text-zinc-900 dark:text-zinc-100">
                                            <td className="px-8 py-6">
                                                <span className="font-black text-zinc-300 dark:text-zinc-600">{cat.order}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-black text-lg group-hover:text-blue-600 transition-colors">{cat.name}</span>
                                                    {cat.nameAr && <span className="text-zinc-400 font-bold" dir="rtl">{cat.nameAr}</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-zinc-400 font-mono text-sm">{cat.slug}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${cat.isActive
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                    }`}>
                                                    {cat.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="fas fa-edit" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
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
                                        <td colSpan={5} className="px-8 py-20 text-center text-zinc-500 font-bold">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
