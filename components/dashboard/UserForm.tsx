'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUser, UserProfile } from '@/lib/api';

interface UserFormProps {
    lang: string;
    initialData?: UserProfile;
    isEdit?: boolean;
}

export default function UserForm({ lang, initialData, isEdit }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: '',
        role: initialData?.role || 'admin',
        phone: initialData?.phone || '',
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    });

    const roles = [
        { value: 'admin', label: 'Administrator' },
        { value: 'editor', label: 'Content Editor' },
        { value: 'viewer', label: 'Viewer Only' },
        { value: 'super_admin', label: 'Super Admin' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let res;
            if (isEdit && initialData) {
                // If editing and password is empty, don't send it
                const payload = { ...formData };
                if (!payload.password) delete (payload as any).password;
                res = await updateUser(initialData.id, payload);
            } else {
                if (!formData.password) {
                    setError('Password is required for new users');
                    setLoading(false);
                    return;
                }
                res = await createUser(formData);
            }

            if (res.success) {
                router.push(`/${lang}/dashboard/users`);
            } else {
                setError(res.message || 'Something went wrong');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black capitalize tracking-tight">
                        {isEdit ? 'Refine Profile' : 'New User'}
                    </h1>
                    <p className="text-zinc-500 text-xs font-medium italic mt-0.5">
                        {isEdit ? 'Update permissions and account details.' : 'Invite a new team member to the system.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-black text-[10px] uppercase"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 text-[10px] uppercase tracking-wider"
                    >
                        {loading ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-save" />}
                        <span>{isEdit ? 'Update' : 'Create'}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 font-bold text-center text-xs animate-in fade-in zoom-in duration-300">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-zinc-900 dark:text-zinc-100">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                    {isEdit ? 'New Password' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="+1 234..."
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Access Role</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {roles.map((role) => (
                                    <label key={role.value} className="cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={formData.role === role.value}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                                            formData.role === role.value 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 group-hover:border-zinc-200 dark:group-hover:border-zinc-600'
                                        }`}>
                                            <p className="text-[9px] font-black uppercase tracking-wider truncate">{role.label.split(' ')[0]}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Attributes */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 block">Account Status</label>
                            <label className="flex items-center gap-3 cursor-pointer group p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                                <div className="relative shrink-0">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}></div>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                    {formData.isActive ? 'Active' : 'Disabled'}
                                </span>
                            </label>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-blue-600">
                                <i className="fas fa-info-circle text-sm"></i>
                                <p className="text-[9px] font-black uppercase tracking-widest">Guidance</p>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 leading-normal uppercase tracking-wider">
                                Choose appropriate roles to maintain security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
