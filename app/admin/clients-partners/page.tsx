'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getAdminClients,
    getAdminPartners,
    getAdminCertificates,
    deleteClient,
    deletePartner,
    deleteCertificate,
    Client,
    Partner,
    Certificate
} from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

type ItemType = 'clients' | 'partners' | 'certificates';

export default function ClientPartnerListPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ItemType>('clients');
    const [clients, setClients] = useState<Client[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [c, p, certs] = await Promise.all([
                getAdminClients(),
                getAdminPartners(),
                getAdminCertificates()
            ]);
            setClients(c);
            setPartners(p);
            setCertificates(certs);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number, type: ItemType) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        let res;
        if (type === 'clients') res = await deleteClient(id);
        else if (type === 'partners') res = await deletePartner(id);
        else res = await deleteCertificate(id);

        if (res.success) {
            loadData();
        } else {
            alert(res.message || 'Failed to delete');
        }
    };

    const getFullImageUrl = (path: string) => {
        if (!path) return '';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        const isBaseLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
        
        let finalPath = path;
        if (path.startsWith('http')) {
            const isPathLocal = path.includes('127.0.0.1:8093');
            if (!isBaseLocal && isPathLocal) {
                const uploadsIndex = path.indexOf('/uploads/');
                if (uploadsIndex !== -1) {
                    finalPath = `${baseUrl}${path.substring(uploadsIndex)}`;
                }
            }
        } else {
            finalPath = `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
        }
        return finalPath;
    };

    const renderTable = (items: any[], type: ItemType) => {
        return (
            <div className="overflow-x-auto rounded-[32px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Image</th>
                            <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Name</th>
                            <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Order</th>
                            <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 text-zinc-300">
                                        <i className="fas fa-folder-open text-5xl" />
                                        <p className="font-bold text-lg">No {type} found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="relative h-12 w-24 bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                                            <Image
                                                src={type === 'certificates' ? getFullImageUrl(item.image) : getFullImageUrl(item.logo)}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-zinc-900 dark:text-white">{item.name}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-bold text-zinc-400"># {item.order}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.isActive ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/clients-partners/${activeTab}/${item.id}`)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-600/5 group/btn"
                                            >
                                                <i className="fas fa-edit text-xs group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, type)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-600/5 group/btn"
                                            >
                                                <i className="fas fa-trash-alt text-xs group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Trust & Recognition</h1>
                        <p className="text-zinc-500 mt-2 font-medium italic">Manage the giants you work with and your prestigious certifications.</p>
                    </div>
                    <button
                        onClick={() => router.push(`/admin/clients-partners/${activeTab}/new`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-3xl transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 active:scale-95"
                    >
                        <i className="fas fa-plus" />
                        <span>Add New {activeTab?.slice(0, -1)}</span>
                    </button>
                </div>

                <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[28px] w-fit">
                    {(['clients', 'partners', 'certificates'] as ItemType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-10 py-4 rounded-[22px] font-black text-sm transition-all tracking-tight capitalize ${activeTab === tab ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-black text-zinc-400 uppercase tracking-widest text-xs">Synchronizing with cloud...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {activeTab === 'clients' && renderTable(clients, 'clients')}
                        {activeTab === 'partners' && renderTable(partners, 'partners')}
                        {activeTab === 'certificates' && renderTable(certificates, 'certificates')}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
