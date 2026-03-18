'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createClient,
    updateClient,
    createPartner,
    updatePartner,
    createCertificate,
    updateCertificate,
    Client,
    Partner,
    Certificate
} from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface ClientPartnerFormProps {
    initialData?: Client | Partner | Certificate;
    isEdit?: boolean;
    type: 'clients' | 'partners' | 'certificates';
}

export default function ClientPartnerForm({ initialData, isEdit, type }: ClientPartnerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        order: initialData?.order || 0,
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const [preview, setPreview] = useState<string | null>(
        initialData
            ? (type === 'certificates'
                ? (initialData as Certificate).image
                : (initialData as Client | Partner).logo)
                ? getFullImageUrl(type === 'certificates' ? (initialData as Certificate).image : (initialData as Client | Partner).logo)
                : null
            : null
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!selectedFile && !isEdit) {
            setError('Please select an image/logo');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('order', formData.order.toString());
        data.append('isActive', formData.isActive.toString());

        if (selectedFile) {
            const fieldName = type === 'certificates' ? 'certificate' : 'logo';
            data.append(fieldName, selectedFile);
        }

        let res;
        const id = initialData?.id;

        try {
            if (type === 'clients') {
                res = isEdit && id ? await updateClient(id, data) : await createClient(data);
            } else if (type === 'partners') {
                res = isEdit && id ? await updatePartner(id, data) : await createPartner(data);
            } else {
                res = isEdit && id ? await updateCertificate(id, data) : await createCertificate(data);
            }

            if (res.success) {
                router.push('/admin/clients-partners');
            } else {
                setError(res.message || 'Something went wrong');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const typeLabel = type?.slice(0, -1) || '';

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black capitalize tracking-tight">{isEdit ? `Edit ${typeLabel}` : `Add New ${typeLabel}`}</h1>
                        <p className="text-zinc-500 mt-2 font-medium italic">Enter details for your prestigious {typeLabel}.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-black text-xs uppercase"
                        >
                            Back to List
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-save" />}
                            <span>{isEdit ? 'Save Changes' : `Create ${typeLabel}`}</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-400/10 border border-red-400/20 rounded-[32px] text-red-400 font-bold text-center animate-in fade-in zoom-in duration-300">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">{typeLabel} Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder={`e.g. ${type === 'clients' ? 'Global Tech Solutions' : type === 'partners' ? 'Microsoft Azure' : 'ISO 9001:2015'}`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Sort Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Visibility</label>
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-14 h-8 rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}></div>
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wider text-zinc-500 group-hover:text-blue-600 transition-colors">
                                            {formData.isActive ? 'Active & Visible' : 'Hidden / Draft'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2 block">{typeLabel} Logo / Image</label>

                            <div className="relative group">
                                <div className={`aspect-square rounded-[32px] overflow-hidden bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center transition-all group-hover:border-blue-500/50 ${preview ? 'border-solid border-blue-100 dark:border-zinc-700' : ''}`}>
                                    {preview ? (
                                        <Image src={preview} alt="Preview" fill className="object-contain p-8" />
                                    ) : (
                                        <div className="text-center space-y-3">
                                            <i className="fas fa-image text-4xl text-zinc-200" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Upload High Res</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                {preview && (
                                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 flex items-center justify-center transition-all pointer-events-none rounded-[32px]">
                                        <i className="fas fa-camera text-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-start gap-3">
                                <i className="fas fa-info-circle text-blue-500 mt-1" />
                                <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">
                                    Use a transparency-enabled PNG (256x256min) for the best looking brand cards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
