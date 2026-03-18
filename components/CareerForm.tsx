'use client'

import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import { sendResume } from '@/lib/api';

export default function CareerForm({ lang, dict }: { lang: Locale; dict: any }) {
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload your CV.');
            return;
        }

        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('designation', formData.designation);
        data.append('file', file);

        const response = await sendResume(data);

        if (response.success) {
            setSuccess(true);
            setFormData({ name: '', designation: '' });
            setFile(null);
            setTimeout(() => setSuccess(false), 5000);
        } else {
            setError(response.message || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-blue-500/5 border border-zinc-100 dark:border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            {dict.career.form.name}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="designation" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            {dict.career.form.designation}
                        </label>
                        <input
                            type="text"
                            id="designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="cv" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        {dict.career.form.upload_cv}
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            id="cv"
                            onChange={handleFileChange}
                            required
                            className="hidden"
                        />
                        <label
                            htmlFor="cv"
                            className="flex items-center justify-between w-full bg-zinc-50 dark:bg-zinc-800 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl px-6 py-4 cursor-pointer hover:border-blue-500 transition-all"
                        >
                            <span className="text-zinc-500 truncate">
                                {file ? file.name : (lang === 'ar' ? 'اختر ملف CV' : 'Choose CV file')}
                            </span>
                            <i className="fas fa-upload text-blue-600" />
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] ${success
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20'
                        } flex items-center justify-center gap-2`}
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : success ? (
                        <>
                            <i className="fas fa-check-circle" />
                            {lang === 'ar' ? 'تم تقديم الطلب!' : 'Application Submitted!'}
                        </>
                    ) : (
                        dict.career.form.submit
                    )}
                </button>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
