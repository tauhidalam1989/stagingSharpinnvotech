'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getServiceById, ServicePage } from '@/lib/api';
import ServiceForm from '@/components/admin/ServiceForm';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditServicePage() {
    const params = useParams();
    const id = params.id as string;
    const [service, setService] = useState<ServicePage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getServiceById(parseInt(id)).then(data => {
                setService(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!service) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-zinc-400">Service not found</h1>
                </div>
            </AdminLayout>
        );
    }

    return <ServiceForm service={service} isEdit />;
}
