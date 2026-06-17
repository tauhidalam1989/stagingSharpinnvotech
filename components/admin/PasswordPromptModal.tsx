'use client'

import React, { useState, useEffect, useRef } from 'react';
import { verifyAdminPassword } from '@/lib/api';

interface PasswordPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productTitle?: string;
}

export default function PasswordPromptModal({ isOpen, onClose, onSuccess, productTitle }: PasswordPromptModalProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError('');
            setShowPassword(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }
        setLoading(true);
        setError('');

        const res = await verifyAdminPassword(password);

        setLoading(false);
        if (res.success) {
            onSuccess();
            onClose();
        } else {
            setError(res.message || 'Incorrect password. Please try again.');
            setShake(true);
            setTimeout(() => setShake(false), 600);
            setPassword('');
            inputRef.current?.focus();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        >
            <div
                className={`bg-zinc-900 border border-zinc-700/60 rounded-[32px] p-8 w-full max-w-md shadow-2xl transition-all ${shake ? 'animate-shake' : ''}`}
                style={{ animation: shake ? 'shake 0.5s ease-in-out' : undefined }}
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-shield-alt text-2xl text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">Admin Verification</h2>
                        <p className="text-zinc-400 text-sm font-medium mt-0.5">
                            {productTitle ? `Reveal credentials for "${productTitle}"` : 'Enter your admin password to reveal credentials'}
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                        <i className="fas fa-exclamation-circle text-red-400 text-sm" />
                        <span className="text-red-400 text-sm font-bold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                            Admin Password
                        </label>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your dashboard password"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 pr-12 font-bold text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                                tabIndex={-1}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                            </button>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium px-1">
                            <i className="fas fa-info-circle mr-1" />
                            This is the password you use to log in to the admin dashboard.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-black text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="flex-1 py-4 rounded-2xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <i className="fas fa-unlock" />
                            )}
                            {loading ? 'Verifying...' : 'Reveal Password'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    15%       { transform: translateX(-8px); }
                    30%       { transform: translateX(8px); }
                    45%       { transform: translateX(-6px); }
                    60%       { transform: translateX(6px); }
                    75%       { transform: translateX(-4px); }
                    90%       { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
}
