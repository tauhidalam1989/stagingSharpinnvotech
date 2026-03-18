'use client'

import React, { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, Product } from '@/lib/api';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id ? parseInt(params.id as string) : null;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getProductById(id).then(data => {
                setProduct(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Loading Product Data...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!product) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <i className="fas fa-exclamation-circle text-6xl text-red-500" />
                    <p className="font-black text-zinc-900 dark:text-white text-2xl">Product Not Found</p>
                    <button onClick={() => window.history.back()} className="text-blue-600 font-bold hover:underline">Go Back</button>
                </div>
            </AdminLayout>
        );
    }

    return <ProductForm product={product} isEdit />;
}
