'use client'

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminPage({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
