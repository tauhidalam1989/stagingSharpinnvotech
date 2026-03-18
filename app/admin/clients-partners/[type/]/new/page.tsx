'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import ClientPartnerForm from '@/components/admin/ClientPartnerForm';

export default function NewClientPartnerPage() {
    const params = useParams();
    const type = params.type as 'clients' | 'partners' | 'certificates';

    return <ClientPartnerForm type={type} />;
}
