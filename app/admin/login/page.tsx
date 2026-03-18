'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success && data.result) {
                const token = data.result.token || data.result.accessToken;
                const user = data.result.user || data.result;
                const expiresIn = data.result.expiresIn || '24h';

                // Parse expiry
                const unit = expiresIn.slice(-1);
                const value = parseInt(expiresIn.slice(0, -1));
                let expiryMs = 24 * 60 * 60 * 1000;
                if (unit === 'h') expiryMs = value * 60 * 60 * 1000;
                else if (unit === 'd') expiryMs = value * 24 * 60 * 60 * 1000;

                localStorage.setItem('auth_token', token);
                localStorage.setItem('current_user', JSON.stringify(user));
                localStorage.setItem('token_expiry', (Date.now() + expiryMs).toString());

                router.push('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 bg-[url('/img/bg-login.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"></div>

            <div className="relative w-full max-w-md">
                <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[40px] p-10 border border-zinc-800 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="h-16 w-16 bg-blue-600 rounded-[22px] flex items-center justify-center font-black text-3xl text-white mb-6 shadow-xl shadow-blue-600/40">S</div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Admin Login</h1>
                        <p className="text-zinc-500 mt-2 font-medium">Welcome back, Please enter your details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Email Address</label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="admin@sharpinnovations.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest px-2">Password</label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <i className="fas fa-arrow-right" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-zinc-600 mt-8 text-sm font-bold">
                    © 2025 Sharp Innovations - All Rights Reserved
                </p>
            </div>
        </div>
    );
}
