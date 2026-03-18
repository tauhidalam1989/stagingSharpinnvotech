'use client';

import React from 'react';
import UserForm from '@/components/dashboard/UserForm';

export default function NewUserPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);

    return (
        <div className="container mx-auto px-4">
            <UserForm lang={lang} isEdit={false} />
        </div>
    );
}
