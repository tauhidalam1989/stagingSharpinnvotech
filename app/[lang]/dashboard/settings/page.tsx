'use client';

import React, { useState } from 'react';
import { changePassword } from '@/lib/api';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const res = await changePassword(formData);
            if (res.success) {
                setSuccessMessage('Password updated successfully!');
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setErrorMessage(res.message || 'Error updating password');
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 animate-slide-up">
            <div className="flex flex-col gap-0.5 px-1">
                <h1 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-none text-blue-600">
                    Account Settings
                </h1>
                <p className="text-zinc-500 font-medium text-[11px] uppercase tracking-wider">Manage your security</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-5 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-200/50">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-[#1200ff]">
                        <i className="fas fa-lock text-sm"></i>
                    </div>
                    <div>
                        <h2 className="text-md font-black text-zinc-900 dark:text-white leading-none">Change Password</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                    {successMessage && (
                        <div className="p-2.5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 font-bold text-[11px] flex items-center gap-2">
                            <i className="fas fa-check-circle"></i>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="p-2.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 font-bold text-[11px] flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest px-1">Current Password</label>
                        <input 
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#1200ff]/20 transition-all placeholder:text-zinc-300"
                            placeholder="Type current password"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest px-1">New Password</label>
                        <input 
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#1200ff]/20 transition-all placeholder:text-zinc-300"
                            placeholder="Type new password"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest px-1">Confirm New Password</label>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#1200ff]/20 transition-all placeholder:text-zinc-300"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00f2fe] to-[#1200ff] text-white shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {loading && <i className="fas fa-circle-notch animate-spin"></i>}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
