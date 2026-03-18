'use client';

import React, { useEffect, useState } from 'react';
import ProductForm from '@/components/dashboard/products/ProductForm';
import { Product, getProductById } from '@/lib/api';

export default function EditProductPage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(parseInt(id));
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-8 text-center text-zinc-500 font-medium">
                Product not found.
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto p-8">
            <ProductForm lang={lang} product={product} isEdit={true} />
        </div>
    );
}
