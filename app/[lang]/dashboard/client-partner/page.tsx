'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    getAdminClients, 
    getAdminPartners, 
    getAdminCertificates,
    deleteClient, 
    deletePartner, 
    deleteCertificate,
    updateClient, 
    updatePartner,
    updateCertificate
} from '@/lib/api';
import { Client, Partner, Certificate } from '@/lib/api';

export default function ClientPartnerListPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [clients, setClients] = useState<Client[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [clientsRes, partnersRes, certsRes] = await Promise.all([
                getAdminClients(),
                getAdminPartners(),
                getAdminCertificates()
            ]);
            setClients(clientsRes);
            setPartners(partnersRes);
            setCertificates(certsRes);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number, type: 'client' | 'partner' | 'certificate') => {
        if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;
        try {
            let res;
            if (type === 'client') res = await deleteClient(id);
            else if (type === 'partner') res = await deletePartner(id);
            else res = await deleteCertificate(id);

            if (res.success) fetchData();
            else alert(res.message || 'Error deleting');
        } catch (error) {
            alert('An error occurred while deleting');
        }
    };

    const toggleStatus = async (item: Client | Partner | Certificate, type: 'client' | 'partner' | 'certificate') => {
        try {
            const data = new FormData();
            data.append('isActive', String(!item.isActive));
            
            let res;
            if (type === 'client') res = await updateClient(item.id, data);
            else if (type === 'partner') res = await updatePartner(item.id, data);
            else res = await updateCertificate(item.id, data);

            if (res.success) fetchData();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const getFullImageUrl = (path: string) => {
        if (!path) return '/placeholder.png';
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
    };

    const renderSection = (title: string, items: (Client | Partner | Certificate)[], type: 'client' | 'partner' | 'certificate') => (
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-10">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h2>
                <Link 
                    href={`/${lang}/dashboard/client-partner/new?type=${type}s`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-95"
                >
                    <i className="fas fa-plus"></i>
                    Add {type}
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Image</th>
                            <th className="px-8 py-4">Name</th>
                            <th className="px-8 py-4">Order</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-8 py-6">
                                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-10 text-center">
                                    <p className="text-zinc-400 font-medium italic">No {type}s found</p>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <button 
                                            onClick={() => toggleStatus(item, type)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                                                item.isActive 
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800' 
                                                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-600' : 'bg-zinc-400'}`}></span>
                                            {item.isActive ? 'Active' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="w-16 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center p-1.5 overflow-hidden">
                                            <img 
                                                src={getFullImageUrl((item as any).logo || (item as any).image)} 
                                                alt={item.name} 
                                                className="max-w-full max-h-full object-contain" 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.name}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-black text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">#{item.order}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link 
                                                href={`/${lang}/dashboard/client-partner/edit/${item.id}?type=${type}s`}
                                                className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <i className="fas fa-edit text-sm"></i>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(item.id, type)}
                                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash text-sm"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Trust & Partners</h1>
                <p className="text-zinc-500 font-medium italic mt-2">Manage your high-profile clients, strategic partners, and industry certifications.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {renderSection('Manage Clients', clients, 'client')}
                {renderSection('Manage Partners', partners, 'partner')}
                {renderSection('Manage Certificates', certificates, 'certificate')}
            </div>
        </div>
    );
}
