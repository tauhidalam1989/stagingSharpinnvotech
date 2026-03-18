'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBlogBySlug, Blog } from '@/lib/api'; // Using slug fetch for now if ID fetch is not ready, but usually admin uses ID
import BlogForm from '@/components/admin/BlogForm';
import AdminLayout from '@/components/admin/AdminLayout';

// NOTE: Usually there's a getBlogById for admin, if not I'll use getBlogBySlug 
// or I'll implement getBlogById in lib/api.ts

export default function EditBlogPage() {
    const params = useParams();
    const id = params.id as string;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            // In a real app we'd use getBlogById, let's assume getBlogBySlug works for now or I'll add getBlogById
            // Actually I'll use fetch with ID directly for a better admin experience
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`, {
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setBlog(data.result);
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!blog) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold">Blog not found</h1>
                </div>
            </AdminLayout>
        );
    }

    return <BlogForm blog={blog} isEdit={true} />;
}
