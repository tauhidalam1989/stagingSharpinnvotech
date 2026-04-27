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
    getAdminClients,
    getAdminPartners,
    getAdminCertificates,
    Client,
    Partner,
    Certificate
} from '@/lib/api';

interface ClientPartnerFormProps {
    lang: string;
    initialData?: any;
    isEdit?: boolean;
    type: 'clients' | 'partners' | 'certificates';
}

export default function ClientPartnerForm({ lang, initialData, isEdit, type }: ClientPartnerFormProps) {
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
            const isPathLocal = path.includes('127.0.0.1:8092');
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
            ? (type === 'certificates' ? initialData.image : initialData.logo)
                ? getFullImageUrl(type === 'certificates' ? initialData.image : initialData.logo)
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
            setError('Please select an image or logo');
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

        try {
            let res;
            const id = initialData?.id;

            if (type === 'clients') {
                res = isEdit && id ? await updateClient(id, data) : await createClient(data);
            } else if (type === 'partners') {
                res = isEdit && id ? await updatePartner(id, data) : await createPartner(data);
            } else {
                res = isEdit && id ? await updateCertificate(id, data) : await createCertificate(data);
            }

            if (res.success) {
                router.push(`/${lang}/dashboard/client-partner`);
                router.refresh();
            } else {
                setError(res.message || 'Something went wrong');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const typeLabel = type.slice(0, -1);

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black capitalize tracking-tight text-zinc-900 dark:text-white">
                        {isEdit ? `Edit ${typeLabel}` : `Add New ${typeLabel}`}
                    </h1>
                    <p className="text-zinc-500 mt-1 font-medium italic">Define the appearance and order for this {typeLabel}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-save" />}
                        <span>{isEdit ? 'Save Changes' : `Create ${typeLabel}`}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 font-bold text-sm text-center animate-shake">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">{typeLabel} Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                placeholder={`Enter ${typeLabel} name...`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Display Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Visibility</label>
                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6.5 rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4.5 h-4.5 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-5.5' : ''}`}></div>
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-500 group-hover:text-blue-600 transition-colors">
                                        {formData.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 block">{typeLabel} Logo</label>

                        <div className="relative group">
                            <div className={`aspect-video rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center transition-all group-hover:border-blue-500/50 ${preview ? 'border-none' : ''}`}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="text-center space-y-2">
                                        <i className="fas fa-cloud-upload-alt text-2xl text-zinc-300 group-hover:text-blue-500 transition-colors" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Upload Image</p>
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
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl pointer-events-none">
                                    <i className="fas fa-camera text-xl text-white" />
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl flex items-start gap-2 border border-blue-100/50 dark:border-blue-800/20">
                            <i className="fas fa-info-circle text-blue-500 text-xs mt-0.5" />
                            <p className="text-[9px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">
                                Use a transparent PNG for best results on the website.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
