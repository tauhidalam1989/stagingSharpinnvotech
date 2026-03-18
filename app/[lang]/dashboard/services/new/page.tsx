'use client';

import React from 'react';
import ServiceForm from '@/components/dashboard/services/ServiceForm';

export default function NewServicePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    return (
        <div className="max-w-[1400px] mx-auto p-8">
            <ServiceForm lang={lang} />
        </div>
    );
}
