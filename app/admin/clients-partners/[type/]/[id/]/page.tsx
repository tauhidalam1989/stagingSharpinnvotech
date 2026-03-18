'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ClientPartnerForm from '@/components/admin/ClientPartnerForm';
import { getClientById, getPartnerById, getCertificateById, Client, Partner, Certificate } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditClientPartnerPage() {
    const params = useParams();
    const type = params.type as 'clients' | 'partners' | 'certificates';
    const id = params.id ? parseInt(params.id as string) : null;

    const [initialData, setInitialData] = useState<Client | Partner | Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                let data = null;
                if (type === 'clients') data = await getClientById(id);
                else if (type === 'partners') data = await getPartnerById(id);
                else if (type === 'certificates') data = await getCertificateById(id);

                setInitialData(data);
                setLoading(false);
            };
            fetchData();
        }
    }, [id, type]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Fetching specialized data...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!initialData) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <i className="fas fa-search text-6xl text-zinc-200" />
                    <p className="font-black text-zinc-900 dark:text-white text-2xl tracking-tight">Record Lost in the Grid</p>
                    <button onClick={() => window.history.back()} className="text-blue-600 font-bold hover:underline">Return to safety</button>
                </div>
            </AdminLayout>
        );
    }

    return <ClientPartnerForm initialData={initialData} type={type} isEdit />;
}
