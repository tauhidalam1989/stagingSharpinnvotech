'use client'

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminProducts, deleteProduct, Product, getProductCategories, ProductCategory } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');

    const loadData = async () => {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
            getAdminProducts({ page, limit: 10, search, categoryId }),
            getProductCategories()
        ]);
        setProducts(productData.products);
        setTotal(productData.total);
        setCategories(categoryData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [page, categoryId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadData();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const res = await deleteProduct(id);
            if (res.success) {
                loadData();
            } else {
                alert(res.message || 'Error deleting product');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Products</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Manage your software solutions and digital products.</p>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-plus" />
                        <span>Create New Product</span>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col xl:flex-row gap-6">
                        <div className="flex-grow relative">
                            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by title, slug..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setPage(1);
                                }}
                                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold appearance-none cursor-pointer min-w-[200px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="bg-zinc-950 dark:bg-white dark:text-zinc-950 text-white font-black px-10 py-4 rounded-2xl transition-all hover:opacity-90">
                                Apply Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-8 py-8 text-xs font-black text-zinc-400 uppercase tracking-widest">Product</th>
                                    <th className="px-8 py-8 text-xs font-black text-zinc-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-8 text-xs font-black text-zinc-400 uppercase tracking-widest">Order</th>
                                    <th className="px-8 py-8 text-xs font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-8 text-xs font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-12 h-32">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl"></div>
                                                    <div className="flex-grow space-y-3">
                                                        <div className="h-6 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                                                        <div className="h-4 w-1/4 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 flex items-center justify-center rounded-[20px] bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-zinc-700 flex-shrink-0">
                                                        <i className={`${product.cardIcon || 'fas fa-box'} text-2xl`} />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-black text-xl group-hover:text-blue-600 transition-colors">{product.title}</span>
                                                        <span className="text-zinc-400 text-sm font-bold tracking-tight">/{product.slug}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                                                    {product.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 font-black text-zinc-300 dark:text-zinc-600">
                                                {product.order}
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2.5 w-2.5 rounded-full ${product.isPublished ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                                                    <span className={`text-xs font-black uppercase tracking-wider ${product.isPublished
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-zinc-400'
                                                        }`}>
                                                        {product.isPublished ? 'Live' : 'Draft'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="fas fa-edit" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <i className="fas fa-box-open text-6xl text-zinc-100 dark:text-zinc-800" />
                                                <span className="text-zinc-400 font-black text-xl">No products found.</span>
                                                <button onClick={() => { setSearch(''); setCategoryId(''); }} className="text-blue-600 font-bold hover:underline">Clear all filters</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {total > 10 && (
                        <div className="px-10 py-8 bg-zinc-50/50 dark:bg-zinc-800/10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm font-black text-zinc-400 tracking-widest uppercase">
                                Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * 10 + 1}</span> to <span className="text-zinc-900 dark:text-white">{Math.min(page * 10, total)}</span> of <span className="text-zinc-900 dark:text-white">{total}</span> items
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-14 px-8 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-30 flex items-center gap-2"
                                >
                                    <i className="fas fa-chevron-left text-[10px]" />
                                    <span>Previous</span>
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * 10 >= total}
                                    className="h-14 px-8 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-30 flex items-center gap-2"
                                >
                                    <span>Next</span>
                                    <i className="fas fa-chevron-right text-[10px]" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
