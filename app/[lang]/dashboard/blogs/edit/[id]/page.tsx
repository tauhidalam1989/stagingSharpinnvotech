'use client';

import React, { useState, useEffect } from 'react';
import BlogForm from '@/components/dashboard/BlogForm';
import { getBlogById } from '@/lib/api';
export default function EditBlogPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id: idStr } = React.use(params);
    const id = Number(idStr);
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getBlogById(id);
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="p-20 text-center">Loading blog data...</div>;
    if (!blog) return <div className="p-20 text-center text-red-500 font-bold">Blog not found</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <BlogForm lang={lang} id={id} initialData={blog} />
        </div>
    );
}
