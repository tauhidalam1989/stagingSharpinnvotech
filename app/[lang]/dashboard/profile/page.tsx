'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile, UserProfile } from '@/lib/api';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await getProfile();
                if (data) {
                    setProfileData(data);
                } else {
                    setError('Failed to load profile data');
                }
            } catch (err) {
                setError('An error occurred while loading profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Loading Profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <i className="fas fa-exclamation-circle text-xl"></i>
                </div>
                <p className="text-zinc-500 font-bold text-sm">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                    Retry
                </button>
            </div>
        );
    }

    const displayUser = profileData || authUser;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                    My Profile
                </h1>
                <p className="text-zinc-500 font-medium text-sm">Manage your account settings and details.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-200/50">
                {/* Profile Header Background */}
                <div className="h-24 bg-gradient-to-r from-[#00f2fe]/20 to-[#1200ff]/20"></div>
                
                <div className="px-6 pb-8">
                    <div className="relative -mt-12 mb-6 flex items-end gap-5">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#00f2fe] to-[#1200ff] rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative w-24 h-24 rounded-[20px] bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl text-zinc-800 dark:text-white font-black text-3xl">
                                {displayUser?.avatar ? (
                                    <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    displayUser?.name?.charAt(0).toUpperCase() || 'A'
                                )}
                            </div>
                        </div>
                        <div className="pb-2">
                            <h2 className="text-lg font-black text-zinc-900 dark:text-white leading-none">{displayUser?.name}</h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#1200ff] text-white mt-1.5">
                                {displayUser?.role?.replace('_', ' ') || 'Super Admin'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div className="space-y-1 px-1">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Email Address</label>
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                                    {displayUser?.email || 'admin@example.com'}
                                </div>
                            </div>

                            <div className="space-y-1 px-1">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Phone Number</label>
                                <div className={`p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 font-bold text-sm ${displayUser?.phone ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 italic'}`}>
                                    {displayUser?.phone || 'Not provided'}
                                </div>
                            </div>
                            
                            <div className="space-y-1 px-1">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Account Created</label>
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                                    {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1 px-1">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Account Status</label>
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full shadow-lg ${displayUser?.isActive !== false ? 'bg-green-500 shadow-green-500/30' : 'bg-zinc-400 shadow-zinc-400/30'}`}></div>
                                    <span className="text-zinc-900 dark:text-zinc-100 font-bold text-sm">{displayUser?.isActive !== false ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>

                            <div className="space-y-1 px-1">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Last Activity</label>
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                                    {displayUser?.lastLogin ? new Date(displayUser.lastLogin).toLocaleString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-800 flex justify-end gap-3">
                        <button className="px-5 py-2 rounded-xl text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-[10px] uppercase tracking-widest">
                            Cancel
                        </button>
                        <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#1200ff] text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-[10px] uppercase tracking-widest leading-none">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
