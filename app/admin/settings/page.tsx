'use client'

import React, { useState } from 'react';
import { changePassword } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword(formData);
            if (res.success) {
                setMessage({ text: 'Password changed successfully.', type: 'success' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ text: res.message || 'Failed to change password.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">Security Protocol</h1>
                    <p className="text-zinc-500 mt-2 font-medium italic">Fortify your administrative portal access.</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[56px] border border-zinc-100 dark:border-zinc-800 p-12 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-10 max-w-xl">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block px-2">Current Authorization Key</label>
                                <div className="relative group">
                                    <i className="fas fa-key absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-14 py-5 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-zinc-900 dark:text-white"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-zinc-50 dark:bg-zinc-800 w-full" />

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block px-2">New Security Sequence</label>
                                <div className="relative group">
                                    <i className="fas fa-shield-alt absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-14 py-5 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-zinc-900 dark:text-white"
                                        placeholder="New password (min. 6 chars)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block px-2">Confirm Sequence</label>
                                <div className="relative group">
                                    <i className="fas fa-check-double absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-14 py-5 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-zinc-900 dark:text-white"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-6 rounded-3xl font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} />
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-3xl transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Update Authorization</span>
                                    <i className="fas fa-sync-alt text-xs" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="p-10 bg-blue-50/50 dark:bg-blue-900/10 rounded-[48px] border border-blue-100 dark:border-blue-900/30 flex items-start gap-6">
                    <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-blue-600/10">
                        <i className="fas fa-info" />
                    </div>
                    <div>
                        <h4 className="font-black text-blue-900 dark:text-blue-400 uppercase tracking-[0.2em] text-xs">Security Advisory</h4>
                        <p className="text-blue-900/60 dark:text-blue-400/60 mt-2 font-medium leading-relaxed max-w-2xl">
                            Frequent password updates are recommended for accounts with high-level access. Ensure your new sequence uses a mix of cryptographic symbols, numeric identifiers, and varied letter casing.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
