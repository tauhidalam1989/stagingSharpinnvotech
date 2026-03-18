'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminProducts, deleteProduct, updateProduct, getProductCategories } from '@/lib/api';
import { Product, ProductCategory } from '@/lib/api';

export default function ProductListPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchData = async (currentPage = pagination.page, currentSearch = search, currentCategory = categoryId) => {
        setLoading(true);
        try {
            const productsRes = await getAdminProducts({
                page: currentPage,
                limit: pagination.limit,
                search: currentSearch || undefined,
                categoryId: currentCategory === 'all' ? undefined : currentCategory
            });
            
            setProducts(productsRes.products);
            setPagination(prev => ({ 
                ...prev, 
                page: currentPage, 
                total: productsRes.total 
            }));

            // Only fetch categories if they haven't been fetched yet
            if (categories.length === 0) {
                const categoriesRes = await getProductCategories();
                setCategories(categoriesRes);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, categoryId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(1); // Reset to page 1 for new search
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await deleteProduct(id);
            if (res.success) fetchData();
            else alert(res.message || 'Error deleting product');
        } catch (error) {
            alert('An error occurred');
        }
    };

    const togglePublish = async (product: Product) => {
        try {
            const res = await updateProduct(product.id, { isPublished: !product.isPublished });
            if (res.success) fetchData();
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    const checkBilingual = (product: Product) => {
        const hasArTitle = !!product.titleAr;
        const hasArShortDesc = !!product.shortDescriptionAr;
        return hasArTitle && hasArShortDesc;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Product Management</h1>
                    <p className="text-sm text-zinc-500 font-medium">Manage your products and categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href={`/${lang}/dashboard/products/categories`}
                        className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                    >
                        <i className="fas fa-tags text-xs"></i>
                        Categories
                    </Link>
                    <Link 
                        href={`/${lang}/dashboard/products/new`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all group"
                    >
                        <i className="fas fa-plus text-xs"></i>
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div className="flex flex-col md:flex-row gap-3">
                        <form onSubmit={handleSearch} className="relative flex-grow">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </form>
                        <select 
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-8 py-5">Order</th>
                                <th className="px-8 py-5">Title</th>
                                <th className="px-8 py-5 text-center">Language</th>
                                <th className="px-8 py-5">Slug</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Views</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fas fa-boxes text-3xl text-zinc-200 dark:text-zinc-800"></i>
                                            <p className="text-xs text-zinc-500 font-medium">No products found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-black text-zinc-600 dark:text-zinc-400">
                                                {product.order}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {product.cardIcon && (
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 text-xs shadow-sm">
                                                        <i className={product.cardIcon}></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{product.title}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5 max-w-[180px] line-clamp-1">{product.shortDescription || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${product.title ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-zinc-200 dark:bg-zinc-700'}`} title="English Support"></span>
                                                <span className={`w-2 h-2 rounded-full ${checkBilingual(product) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-200 dark:bg-zinc-700'}`} title="Arabic Support"></span>
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1.5">{checkBilingual(product) ? 'Bilingual' : 'English Only'}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <code className="text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold tracking-tight">
                                                /{product.slug}
                                            </code>
                                        </td>
                                        <td className="px-8 py-4">
                                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                 product.isPublished 
                                                     ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100/50 dark:border-emerald-800/30' 
                                                     : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-100/50 dark:border-amber-800/30'
                                             }`}>
                                                 <span className={`w-1 h-1 rounded-full ${product.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                 {product.isPublished ? 'Live' : 'Draft'}
                                             </span>
                                         </td>
                                         <td className="px-8 py-4">
                                             <p className="text-sm text-zinc-500 font-bold">{product.views || 0}</p>
                                         </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link 
                                                    href={`/${lang}/dashboard/products/${product.id}`}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <i className="fas fa-eye text-xs"></i>
                                                </Link>
                                                <Link 
                                                    href={`/${lang}/dashboard/products/edit/${product.id}`}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit text-xs"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => togglePublish(product)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${product.isPublished ? 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                                                    title={product.isPublished ? 'Unpublish' : 'Publish'}
                                                >
                                                    <i className={`fas ${product.isPublished ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                 {/* Pagination */}
                 {!loading && products.length > 0 && (
                     <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                         <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                             Total {pagination.total} products
                         </p>
                         <div className="flex items-center gap-3">
                             <button 
                                 disabled={pagination.page === 1}
                                 onClick={() => fetchData(pagination.page - 1)}
                                 className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                             >
                                 <i className="fas fa-chevron-left text-xs"></i>
                             </button>
                             <span className="text-sm font-black text-zinc-900 dark:text-white px-3">
                                 Page {pagination.page}
                             </span>
                             <button 
                                 disabled={pagination.page * pagination.limit >= pagination.total}
                                 onClick={() => fetchData(pagination.page + 1)}
                                 className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                             >
                                 <i className="fas fa-chevron-right text-xs"></i>
                             </button>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
}
