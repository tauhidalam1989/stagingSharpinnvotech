'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetailForm from '@/components/admin/ProductDetailForm';
import { getProductDetailById, ProductDetail } from '@/lib/api';

export default function EditProductDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const [item, setItem] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        getProductDetailById(id).then(data => {
            if (data) {
                setItem(data);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
                <div className="h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-4xl text-red-400" />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Product detail not found</h2>
                <p className="text-zinc-400 font-medium">The requested product detail card does not exist or was deleted.</p>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all"
                >
                    <i className="fas fa-arrow-left" /> Go Back
                </button>
            </div>
        );
    }

    return <ProductDetailForm initialData={item!} isEdit />;
}
