'use client';

import React, { useEffect, useState } from 'react';
import UserForm from '@/components/dashboard/UserForm';
import { getUserById, UserProfile } from '@/lib/api';

export default function EditUserPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = React.use(params);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await getUserById(parseInt(id));
                setUser(res);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-zinc-400 text-xs uppercase tracking-widest">Identifying user...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
                <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">User not found</h3>
                <p className="text-zinc-500 mt-2">The user you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <UserForm lang={lang} initialData={user} isEdit={true} />
        </div>
    );
}
