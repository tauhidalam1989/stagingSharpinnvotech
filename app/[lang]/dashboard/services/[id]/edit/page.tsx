'use client';

import React, { useState, useEffect } from 'react';
import ServiceForm from '@/components/dashboard/services/ServiceForm';
import { ServicePage, getServiceById } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function EditServicePage({ params }: { params: Promise<{ lang: string, id: string }> }) {
    const { lang, id } = React.use(params);
    const router = useRouter();
    const [service, setService] = useState<ServicePage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceById(Number(id));
                setService(data);
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="max-w-[1400px] mx-auto p-8 text-center py-20">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">Service Not Found</h1>
                <button 
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto p-8">
            <ServiceForm lang={lang} service={service} isEdit={true} />
        </div>
    );
}
