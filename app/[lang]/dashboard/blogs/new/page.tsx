'use client';

import React from 'react';
import BlogForm from '@/components/dashboard/BlogForm';

export default function NewBlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    return (
        <div className="max-w-7xl mx-auto">
            <BlogForm lang={lang} />
        </div>
    );
}
