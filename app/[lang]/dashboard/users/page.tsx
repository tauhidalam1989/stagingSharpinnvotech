'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getUsers, toggleUserStatus, deleteUser, UserProfile } from '@/lib/api';

export default function UserListPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            // Note: If the backend supports search via the getUsers API, we should pass it.
            // If not, we'll filter locally for this demo, but the implementation plan implies full sync.
            const res = await getUsers(pagination.page, pagination.limit);
            
            let filteredData = res.data;
            if (searchTerm) {
                filteredData = res.data.filter(u => 
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    u.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setUsers(filteredData);
            setPagination(prev => ({ ...prev, total: res.pagination.total }));
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this administrative user? This cannot be undone.')) return;
        try {
            const res = await deleteUser(id);
            if (res.success) fetchUsers();
            else alert(res.message || 'Error deleting user');
        } catch (error) {
            alert('An error occurred during deletion.');
        }
    };

    const handleToggleStatus = async (user: UserProfile) => {
        try {
            const res = await toggleUserStatus(user.id, !user.isActive);
            if (res.success) fetchUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'super_admin': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600';
            case 'admin': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600';
            case 'editor': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-600';
            default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600';
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">System Staff</h1>
                    <p className="text-zinc-500 font-medium text-sm mt-0.5">Configure administrative access and security roles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 lg:w-72">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Find staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                        />
                    </div>
                    <Link 
                        href={`/${lang}/dashboard/users/new`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-wider"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Invite Staff</span>
                    </Link>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-6 py-4">Identification</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Registration</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                            {loading && users.length === 0 ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-40"></div>
                                                    <div className="h-3 bg-zinc-50 dark:bg-zinc-900 rounded-full w-24"></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 max-w-xs mx-auto">
                                            <div className="w-20 h-20 rounded-[32px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300">
                                                <i className="fas fa-users-slash text-3xl"></i>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-zinc-900 dark:text-white">No matches found</h3>
                                                <p className="text-zinc-500 font-medium text-sm mt-2 leading-relaxed">We couldn't find any staff members matching your current search parameters.</p>
                                            </div>
                                            <button 
                                                onClick={() => setSearchTerm('')}
                                                className="text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-700 transition-colors"
                                            >
                                                Clear Search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-700 overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-black uppercase">{user.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">{user.name}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest group/status ${
                                                    user.isActive ? 'text-emerald-500' : 'text-zinc-400'
                                                }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full border ${
                                                    user.isActive 
                                                        ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                                                        : 'bg-zinc-200 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-700'
                                                } transition-all`}></div>
                                                <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-zinc-900 dark:text-zinc-100 font-bold">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={`/${lang}/dashboard/users/edit/${user.id}`}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-600 hover:text-white transition-all"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit text-[10px]"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={user.role.toLowerCase() === 'super_admin'}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-800/50 hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-red-50 disabled:cursor-not-allowed"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash text-[10px]"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Status Bar / Pagination */}
                <div className="px-6 py-4 bg-zinc-50/30 dark:bg-zinc-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                {users.filter(u => u.isActive).length} Active
                            </span>
                        </div>
                        <div className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">
                            • Total {pagination.total} Records
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all disabled:opacity-20 shadow-sm"
                        >
                            <i className="fas fa-chevron-left text-[10px]"></i>
                        </button>
                        <div className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-black text-[10px] uppercase tracking-widest text-zinc-500">
                            Page {pagination.page} / {Math.ceil(pagination.total / pagination.limit) || 1}
                        </div>
                        <button 
                            disabled={pagination.page * pagination.limit >= pagination.total}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all disabled:opacity-20 shadow-sm"
                        >
                            <i className="fas fa-chevron-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
