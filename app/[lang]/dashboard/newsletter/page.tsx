'use client';

import React, { useState, useEffect } from 'react';
import { getNewsletters, NewsletterSubscription } from '@/lib/api';
import { Mail, Calendar, Search, Loader2, Inbox } from 'lucide-react';

export default function NewsletterAdminPage({ params }: { params: Promise<{ lang: string }> }) {
    const [lang, setLang] = useState('');
    const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        params.then(p => setLang(p.lang));
    }, [params]);

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const { newsletters, total } = await getNewsletters({ page, limit: 100 });
            setSubscriptions(newsletters);
            setTotal(total);
        } catch (error) {
            console.error('Failed to fetch newsletters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (lang) fetchSubscriptions();
    }, [lang, page]);

    const filteredSubscriptions = subscriptions.filter(sub => 
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <Mail className="w-6 h-6" />
                        </div>
                        Newsletter Subscriptions
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                        Total {total} subscribers found
                    </p>
                </div>

                <div className="relative group max-w-md w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
                    />
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">Loading Subscribers...</p>
                    </div>
                ) : filteredSubscriptions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest w-[60%]">Email Address</th>
                                    <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest underline decoration-blue-500/30 decoration-2 underline-offset-4">Subscription Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredSubscriptions.map((sub, idx) => (
                                    <tr key={sub.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <span className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-bold">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                {new Date(sub.createdAt).toLocaleDateString(undefined, { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-32 text-center">
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-300 dark:text-zinc-700 mb-6">
                            <Inbox className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2 font-syne">No subscribers found</h3>
                        <p className="text-zinc-400 font-medium">Try adjusting your search query</p>
                    </div>
                )}
            </div>
        </div>
    );
}
