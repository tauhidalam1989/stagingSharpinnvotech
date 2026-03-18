'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ClientPartnerForm from '@/components/dashboard/ClientPartnerForm';

export default function NewClientPartnerPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const searchParams = useSearchParams();
    const type = (searchParams.get('type') as 'clients' | 'partners' | 'certificates') || 'clients';

    return (
        <div className="container mx-auto px-4">
            <ClientPartnerForm lang={lang} type={type} isEdit={false} />
        </div>
    );
}
