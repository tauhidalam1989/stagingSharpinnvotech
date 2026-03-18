'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, UserProfile } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile().then(data => {
            setProfile(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-zinc-400 uppercase tracking-widest text-sm">Decoding Profile...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!profile) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                    <i className="fas fa-ghost text-6xl text-zinc-200" />
                    <p className="font-black text-zinc-900 dark:text-white text-2xl tracking-tight">Profile Not Found</p>
                    <p className="text-zinc-500 font-medium max-w-xs">It seems you're a glitch in the matrix. Try logging in again.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter">Account Identity</h1>
                    <p className="text-zinc-500 mt-2 font-medium italic italic">Your professional footprint and system privileges.</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[56px] border border-zinc-100 dark:border-zinc-800 p-12 shadow-sm space-y-12">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative h-40 w-40 rounded-[48px] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl ring-1 ring-zinc-100 dark:ring-zinc-700">
                            <Image
                                src={profile.avatar ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${profile.avatar}` : '/img/default-avatar.png'}
                                alt={profile.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center md:text-left space-y-4">
                            <div>
                                <h2 className="text-4xl font-black tracking-tight">{profile.name}</h2>
                                <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">{profile.role.replace('_', ' ')}</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${profile.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {profile.isActive ? 'Active Member' : 'Account Suspended'}
                                </span>
                                <span className="bg-zinc-100 dark:bg-zinc-800 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    ID: {profile.id.toString().padStart(4, '0')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-zinc-50 dark:border-zinc-800/50">
                        <div className="space-y-4 px-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block">Digital Address (Email)</label>
                            <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                                <i className="far fa-envelope text-blue-500" />
                                {profile.email}
                            </div>
                        </div>
                        <div className="space-y-4 px-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block">Telecommunication</label>
                            <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                                <i className="fas fa-phone-alt text-blue-500" />
                                {profile.phone || 'N/A'}
                            </div>
                        </div>
                        <div className="space-y-4 px-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block">Registration Date</label>
                            <div className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
                                {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div className="space-y-4 px-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block">Last Engagement</label>
                            <div className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
                                {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'First time login'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => router.push('/admin/settings')}
                        className="bg-zinc-900 hover:bg-black text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-zinc-950/20"
                    >
                        Modify Security Settings
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
