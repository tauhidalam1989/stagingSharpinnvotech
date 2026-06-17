'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PasswordPromptModal from '@/components/admin/PasswordPromptModal';
import {
    getAdminProductDetails,
    deleteProductDetail,
    ProductDetail,
    getMediaUrl
} from '@/lib/api';

export default function ProductDetailsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const router = useRouter();
    const [items, setItems] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Password modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [revealTarget, setRevealTarget] = useState<ProductDetail | null>(null);
    const [revealedPasswords, setRevealedPasswords] = useState<Record<number, boolean>>({});

    const fetchItems = useCallback(async () => {
        setLoading(true);
        const data = await getAdminProductDetails();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);
        await deleteProductDetail(id);
        setDeletingId(null);
        fetchItems();
    };

    const handleShowPassword = (item: ProductDetail) => {
        if (revealedPasswords[item.id]) {
            // Hide it again
            setRevealedPasswords(prev => { const n = { ...prev }; delete n[item.id]; return n; });
            return;
        }
        setRevealTarget(item);
        setModalOpen(true);
    };

    const handlePasswordVerified = () => {
        if (revealTarget) {
            setRevealedPasswords(prev => ({ ...prev, [revealTarget.id]: true }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Product Details</h1>
                    <p className="text-zinc-500 mt-2 font-medium">
                        Manage product demo links and stored credentials. Admin-only vault.
                    </p>
                </div>
                <Link
                    href={`/${lang}/dashboard/product-details/new`}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 whitespace-nowrap"
                >
                    <i className="fas fa-plus" />
                    Add Product Detail
                </Link>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Cards', value: items.length, icon: 'fa-cube', color: 'blue' },
                    { label: 'Active', value: items.filter(i => i.isActive).length, icon: 'fa-check-circle', color: 'green' },
                    { label: 'With Credentials', value: items.filter(i => i.password || i.username).length, icon: 'fa-key', color: 'amber' },
                    { label: 'With Thumbnails', value: items.filter(i => i.image).length, icon: 'fa-image', color: 'violet' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[28px] p-5 flex items-center gap-4 shadow-sm">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10`}>
                            <i className={`fas ${stat.icon} text-${stat.color}-500`} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[40px] p-20 text-center shadow-sm">
                    <div className="h-20 w-20 rounded-3xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-cube text-4xl text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-zinc-900 dark:text-white">No product details yet</h3>
                    <p className="text-zinc-400 font-medium mb-8">Add your first product detail card to get started.</p>
                    <Link
                        href={`/${lang}/dashboard/product-details/new`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all"
                    >
                        <i className="fas fa-plus" /> Add First Card
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map(item => (
                        <ProductDetailCard
                            key={item.id}
                            item={item}
                            isPasswordRevealed={!!revealedPasswords[item.id]}
                            isDeleting={deletingId === item.id}
                            onShowPassword={() => handleShowPassword(item)}
                            onEdit={() => router.push(`/${lang}/dashboard/product-details/edit/${item.id}`)}
                            onDelete={() => handleDelete(item.id, item.title)}
                        />
                    ))}
                </div>
            )}

            {/* Password Prompt Modal */}
            <PasswordPromptModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setRevealTarget(null); }}
                onSuccess={handlePasswordVerified}
                productTitle={revealTarget?.title}
            />
        </div>
    );
}

// ─── Product Detail Card ──────────────────────────────────────────────────────

interface CardProps {
    item: ProductDetail;
    isPasswordRevealed: boolean;
    isDeleting: boolean;
    onShowPassword: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function ProductDetailCard({ item, isPasswordRevealed, isDeleting, onShowPassword, onEdit, onDelete }: CardProps) {
    const [copyState, setCopyState] = useState<'url' | 'user' | 'pass' | null>(null);

    const copyToClipboard = (text: string, field: 'url' | 'user' | 'pass') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyState(field);
            setTimeout(() => setCopyState(null), 2000);
        });
    };

    const thumbnailUrl = item.image ? getMediaUrl(item.image) : null;
    const hasCredentials = !!(item.username || item.password);

    return (
        <div className={`group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[36px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${!item.isActive ? 'opacity-60' : ''}`}>
            {/* Thumbnail / Header */}
            <div className="relative h-44 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
                {thumbnailUrl ? (
                    <Image src={thumbnailUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                        <i className="fas fa-cube text-5xl text-zinc-300 dark:text-zinc-600" />
                    </div>
                )}
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${item.isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-400 text-white'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                {hasCredentials && (
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-500 text-black shadow-lg">
                            <i className="fas fa-key mr-1" />Credentials
                        </span>
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-zinc-900/80 to-transparent pointer-events-none" />
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <h3 className="text-lg font-black leading-tight truncate text-zinc-900 dark:text-white" title={item.title}>{item.title}</h3>

                {/* URL */}
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-2xl px-4 py-3">
                    <i className="fas fa-link text-blue-500 text-xs flex-shrink-0" />
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-500 hover:text-blue-400 truncate flex-1 transition-colors"
                        title={item.url}
                    >
                        {item.url}
                    </a>
                    <button
                        onClick={() => copyToClipboard(item.url, 'url')}
                        className="flex-shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Copy URL"
                    >
                        <i className={`fas ${copyState === 'url' ? 'fa-check text-emerald-500' : 'fa-copy'} text-xs`} />
                    </button>
                </div>

                {/* Credentials Section */}
                {hasCredentials && (
                    <div className="space-y-2 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 bg-amber-50/50 dark:bg-amber-950/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                            <i className="fas fa-shield-alt" /> Credentials
                        </p>

                        {/* Username */}
                        {item.username && (
                            <div className="flex items-center gap-2">
                                <i className="fas fa-user text-zinc-400 text-xs w-4 text-center flex-shrink-0" />
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 flex-1 truncate">{item.username}</span>
                                <button
                                    onClick={() => copyToClipboard(item.username!, 'user')}
                                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex-shrink-0"
                                    title="Copy username"
                                >
                                    <i className={`fas ${copyState === 'user' ? 'fa-check text-emerald-500' : 'fa-copy'} text-xs`} />
                                </button>
                            </div>
                        )}

                        {/* Password */}
                        {item.password && (
                            <div className="flex items-center gap-2">
                                <i className="fas fa-lock text-zinc-400 text-xs w-4 text-center flex-shrink-0" />
                                {isPasswordRevealed ? (
                                    <>
                                        <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300 flex-1 truncate">{item.password}</span>
                                        <button
                                            onClick={() => copyToClipboard(item.password!, 'pass')}
                                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex-shrink-0"
                                            title="Copy password"
                                        >
                                            <i className={`fas ${copyState === 'pass' ? 'fa-check text-emerald-500' : 'fa-copy'} text-xs`} />
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs font-mono font-bold text-zinc-400 flex-1 select-none tracking-widest">
                                        ••••••••••
                                    </span>
                                )}
                                <button
                                    onClick={onShowPassword}
                                    className={`flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-lg transition-all ${isPasswordRevealed ? 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30' : 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30'}`}
                                    title={isPasswordRevealed ? 'Hide password' : 'Show password (admin verify required)'}
                                >
                                    <i className={`fas ${isPasswordRevealed ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white border border-zinc-200 dark:border-zinc-700 hover:border-blue-600 transition-all text-zinc-700 dark:text-zinc-300"
                    >
                        <i className="fas fa-pencil-alt" /> Edit
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-red-400 hover:bg-red-500 hover:text-white border border-red-200 dark:border-red-900/40 hover:border-red-500 transition-all disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <div className="h-3 w-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <i className="fas fa-trash" />
                        )}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
