'use client';

import React from 'react';
import ProductForm from '@/components/dashboard/products/ProductForm';

export default function NewProductPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    return (
        <div className="max-w-[1400px] mx-auto p-8">
            <ProductForm lang={lang} />
        </div>
    );
}
