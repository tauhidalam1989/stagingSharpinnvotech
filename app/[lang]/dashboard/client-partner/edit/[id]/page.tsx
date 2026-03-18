'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientPartnerForm from '@/components/dashboard/ClientPartnerForm';
import { getClientById, getPartnerById, getCertificateById } from '@/lib/api';

export default function EditClientPartnerPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = React.use(params);
    const searchParams = useSearchParams();
    const type = (searchParams.get('type') as 'clients' | 'partners' | 'certificates') || 'clients';
    
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                const numericId = parseInt(id);
                if (type === 'clients') data = await getClientById(numericId);
                else if (type === 'partners') data = await getPartnerById(numericId);
                else data = await getCertificateById(numericId);
                
                setInitialData(data);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, type]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-zinc-400 text-xs uppercase tracking-widest">Loading details...</p>
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
                <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Item not found</h3>
                <p className="text-zinc-500 mt-2">The {type.slice(0, -1)} you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <ClientPartnerForm 
                lang={lang} 
                type={type} 
                initialData={initialData} 
                isEdit={true} 
            />
        </div>
    );
}
