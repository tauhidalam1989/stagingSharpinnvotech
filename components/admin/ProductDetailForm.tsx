'use client'

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { createProductDetail, updateProductDetail, ProductDetail, getMediaUrl } from '@/lib/api';

interface ProductDetailFormProps {
    initialData?: ProductDetail;
    isEdit?: boolean;
}

export default function ProductDetailForm({ initialData, isEdit }: ProductDetailFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        url: initialData?.url || '',
        username: initialData?.username || '',
        password: initialData?.password || '',
        order: initialData?.order ?? 0,
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        initialData?.image ? getMediaUrl(initialData.image) : null
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

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('url', formData.url);
        if (formData.username) data.append('username', formData.username);
        if (formData.password) data.append('password', formData.password);
        data.append('order', formData.order.toString());
        data.append('isActive', formData.isActive.toString());
        if (selectedFile) data.append('productThumbnail', selectedFile);

        try {
            const res = isEdit && initialData?.id
                ? await updateProductDetail(initialData.id, data)
                : await createProductDetail(data);

            if (res.success) {
                const isDashboard = pathname.includes('/dashboard');
                if (isDashboard) {
                    const lang = pathname.split('/')[1] || 'en';
                    router.push(`/${lang}/dashboard/product-details`);
                } else {
                    router.push('/admin/product-details');
                }
            } else {
                setError(res.message || 'Something went wrong');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">
                            {isEdit ? 'Edit Product Detail' : 'New Product Detail'}
                        </h1>
                        <p className="text-zinc-500 mt-2 font-medium italic">
                            {isEdit ? 'Update the product detail card.' : 'Add a new product detail card to the admin vault.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 rounded-2xl font-black text-xs uppercase text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <i className="fas fa-save" />
                            )}
                            <span>{isEdit ? 'Save Changes' : 'Create Card'}</span>
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-5 bg-red-400/10 border border-red-400/20 rounded-[28px] text-red-400 font-bold text-center">
                        <i className="fas fa-exclamation-circle mr-2" />{error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left column — fields */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Product Info */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-9 w-9 rounded-xl bg-blue-600/10 flex items-center justify-center">
                                    <i className="fas fa-cube text-blue-500 text-sm" />
                                </div>
                                <h2 className="font-black text-sm uppercase tracking-widest text-zinc-500">Product Info</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">
                                    Product Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Sharp CRM Platform"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">
                                    Product Demo URL <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <i className="fas fa-link text-zinc-400 text-sm" />
                                    </div>
                                    <input
                                        type="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="https://demo.example.com"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl pl-12 pr-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <i className="fas fa-key text-amber-500 text-sm" />
                                </div>
                                <h2 className="font-black text-sm uppercase tracking-widest text-zinc-500">Product Credentials</h2>
                                <span className="text-xs text-zinc-400 font-medium">(Optional)</span>
                            </div>

                            <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex items-start gap-3">
                                <i className="fas fa-info-circle text-amber-500 mt-0.5 text-sm" />
                                <p className="text-xs font-bold text-zinc-500 leading-relaxed">
                                    Credentials are stored securely and only revealed after admin password verification.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">
                                    Username <span className="text-zinc-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <i className="fas fa-user text-zinc-400 text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="admin@example.com"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl pl-12 pr-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">
                                    Password <span className="text-zinc-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-zinc-400 text-sm" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••••••"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl pl-12 pr-14 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-all text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Sort Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-3">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Status</label>
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-14 h-8 rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.isActive ? 'translate-x-6' : ''}`} />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wider text-zinc-500 group-hover:text-blue-600 transition-colors">
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column — image */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 p-7 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                    <i className="fas fa-image text-violet-500 text-sm" />
                                </div>
                                <div>
                                    <h2 className="font-black text-sm uppercase tracking-widest text-zinc-500">Thumbnail</h2>
                                    <span className="text-[10px] text-zinc-400 font-medium">Optional</span>
                                </div>
                            </div>

                            <div
                                className={`relative group aspect-video rounded-[28px] overflow-hidden border-2 border-dashed transition-all
                                    ${preview
                                        ? 'border-violet-300 dark:border-violet-700 bg-zinc-50 dark:bg-zinc-800'
                                        : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-blue-400'}`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                {preview ? (
                                    <>
                                        <Image src={preview} alt="Thumbnail preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                                                <i className="fas fa-camera text-white text-2xl" />
                                                <span className="text-white text-xs font-black">Change Image</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                                            <i className="fas fa-cloud-upload-alt text-2xl text-zinc-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Drag & drop or click</p>
                                            <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                        </div>
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
                                <button
                                    type="button"
                                    onClick={() => { setPreview(null); setSelectedFile(null); }}
                                    className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 border border-red-400/20 transition-all"
                                >
                                    <i className="fas fa-trash mr-2" />Remove Image
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
    );
}
