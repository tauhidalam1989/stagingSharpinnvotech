'use client';

import React, { useState, useEffect } from 'react';
import { getNewsletters, updateNewsletterStatus, deleteNewsletter, NewsletterSubscription } from '@/lib/api';
import { Mail, Calendar, Search, Loader2, Inbox, Edit2, Trash2, CheckCircle2, Clock, X, AlertTriangle } from 'lucide-react';

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

    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Modal States
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean; id: string; currentStatus: string }>({
        isOpen: false, id: '', currentStatus: 'Pending'
    });
    const [tempStatus, setTempStatus] = useState<'Pending' | 'Contacted'>('Pending');
    
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string }>({
        isOpen: false, id: ''
    });

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const { newsletters, total } = await getNewsletters({ page, limit: 10 });
            setSubscriptions(newsletters);
            setTotal(total);
        } catch (error) {
            console.error('Failed to fetch newsletters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openStatusModal = (id: string, currentStatus: string) => {
        setStatusModal({ isOpen: true, id, currentStatus });
        setTempStatus(currentStatus as 'Pending' | 'Contacted');
    };

    const handleStatusConfirm = async () => {
        const { id } = statusModal;
        setStatusModal({ isOpen: false, id: '', currentStatus: 'Pending' });
        
        setIsUpdating(id);
        const res = await updateNewsletterStatus(id, tempStatus);
        if (res.success) {
            fetchSubscriptions();
        } else {
            alert('Failed to update status');
        }
        setIsUpdating(null);
    };

    const openDeleteModal = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDeleteConfirm = async () => {
        const { id } = deleteModal;
        setDeleteModal({ isOpen: false, id: '' });
        
        setIsUpdating(id);
        const res = await deleteNewsletter(id);
        if (res.success) {
            if (subscriptions.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchSubscriptions();
            }
        } else {
            alert('Failed to delete subscription');
        }
        setIsUpdating(null);
    };

    const totalPages = Math.ceil(total / 10);

    useEffect(() => {
        if (lang) fetchSubscriptions();
    }, [lang, page]);

    const filteredSubscriptions = (Array.isArray(subscriptions) ? subscriptions : []).filter(sub => 
        sub?.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
                                    <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest w-[40%]">Email Address</th>
                                    <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest">Subscription Date</th>
                                    <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
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
                                            <div className="flex items-center gap-2">
                                                {sub.status === 'Contacted' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Contacted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Pending
                                                    </span>
                                                )}
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
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openStatusModal(sub.id, sub.status || 'Pending')}
                                                    disabled={isUpdating === sub.id}
                                                    className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors disabled:opacity-50"
                                                    title="Change Status"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(sub.id)}
                                                    disabled={isUpdating === sub.id}
                                                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                                                    title="Delete Subscription"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                            >
                                Previous
                            </button>
                            <div className="flex flex-wrap items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {statusModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                    ></div>
                    <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-blue-500" />
                                Update Status
                            </h3>
                            <button 
                                onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm font-medium">
                                Select the new status for this subscription:
                            </p>
                            <div className="space-y-3">
                                <label 
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${tempStatus === 'Pending' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-900'}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Pending" 
                                        checked={tempStatus === 'Pending'} 
                                        onChange={() => setTempStatus('Pending')}
                                        className="w-4 h-4 text-amber-500 border-zinc-300 focus:ring-amber-500 hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${tempStatus === 'Pending' ? 'border-amber-500' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                        {tempStatus === 'Pending' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                    </div>
                                    <Clock className={`w-5 h-5 ${tempStatus === 'Pending' ? 'text-amber-500' : 'text-zinc-400'}`} />
                                    <span className={`font-bold ${tempStatus === 'Pending' ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                        Pending
                                    </span>
                                </label>
                                
                                <label 
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${tempStatus === 'Contacted' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-900'}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Contacted" 
                                        checked={tempStatus === 'Contacted'} 
                                        onChange={() => setTempStatus('Contacted')}
                                        className="w-4 h-4 text-emerald-500 border-zinc-300 focus:ring-emerald-500 hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${tempStatus === 'Contacted' ? 'border-emerald-500' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                        {tempStatus === 'Contacted' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                    </div>
                                    <CheckCircle2 className={`w-5 h-5 ${tempStatus === 'Contacted' ? 'text-emerald-500' : 'text-zinc-400'}`} />
                                    <span className={`font-bold ${tempStatus === 'Contacted' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                        Contacted
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                                className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusConfirm}
                                className="px-5 py-2.5 text-sm font-bold border border-transparent bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                    ></div>
                    <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                Delete Subscription?
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                                Are you sure you want to permanently delete this newsletter subscription? This action cannot be undone.
                            </p>
                        </div>
                        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex items-center justify-center gap-3">
                            <button
                                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                                className="flex-1 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 py-3 text-sm font-bold border border-transparent bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
