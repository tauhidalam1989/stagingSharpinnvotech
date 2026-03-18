'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginAdmin } from '@/lib/api';

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginAdmin({ email, password });
            if (response.success && response.result) {
                login(response.result.user, response.result.token);
                router.push(`/${lang}/dashboard`);
            } else {
                setError(response.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <div className="max-w-[400px] w-full">
                <div className="text-center mb-8">
                    <img 
                        src="/logo/SLogo.png" 
                        alt="Sharp Innovation" 
                        className="h-16 mx-auto mb-4 drop-shadow-sm" 
                    />
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Portal</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm font-medium">Manage your platform</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50">
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 px-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@sharp.com"
                                    className="w-full bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 px-1">
                                Password
                            </label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group text-sm"
                            >
                                {loading ? (
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                ) : (
                                    <>
                                        Sign In
                                        <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <p className="text-zinc-400 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} SHARP INNOVATION
                    </p>
                </div>
            </div>
        </div>
    );
}
