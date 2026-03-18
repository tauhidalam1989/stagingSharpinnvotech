'use client'

import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import { sendContactForm } from '@/lib/api';

export default function ContactForm({ lang, dict }: { lang: Locale; dict: any }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        organization: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const subjects = [
        { value: '1', label: dict['CONTACT-FORM'].SUBJECT_SERVICES },
        { value: '6', label: dict['CONTACT-FORM'].SUBJECT_MEDIA },
        { value: '2', label: dict['CONTACT-FORM'].SUBJECT_BILLING },
        { value: '3', label: dict['CONTACT-FORM'].SUBJECT_GENERAL },
        { value: '5', label: dict['CONTACT-FORM'].SUBJECT_TECHNICAL },
        { value: '7', label: dict['CONTACT-FORM'].SUBJECT_COMPLAINTS },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Convert subject value to label before sending as per Angular code
        const selectedSubject = subjects.find(s => s.value === formData.subject)?.label || formData.subject;
        const payload = { ...formData, subject: selectedSubject };

        const response = await sendContactForm(payload);

        if (response.success) {
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                contactNumber: '',
                organization: '',
                subject: '',
                message: '',
            });
            setTimeout(() => setSuccess(false), 5000);
        } else {
            setError(response.message || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 md:p-8 shadow-2xl shadow-blue-500/5 border border-zinc-100 dark:border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1">
                            {dict['CONTACT-FORM'].YOUR_NAME}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_NAME}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1">
                            {dict['CONTACT-FORM'].YOUR_EMAIL}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_EMAIL}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label htmlFor="contactNumber" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1">
                            {dict['CONTACT-FORM'].CONTACT_NUMBER}
                        </label>
                        <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_NUMBER}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="organization" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1">
                            {dict['CONTACT-FORM'].ORGANIZATION}
                        </label>
                        <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_ORGANIZATION}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="subject" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1">
                        {dict['CONTACT-FORM'].SUBJECT}
                    </label>
                    <div className="relative">
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                            <option value="">{dict['CONTACT-FORM'].PLACEHOLDER_SUBJECT}</option>
                            {subjects.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-50">
                            <i className="fas fa-chevron-down text-xs" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="message" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1">
                        {dict['CONTACT-FORM'].MESSAGE}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={2}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder={dict['CONTACT-FORM'].PLACEHOLDER_MESSAGE}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    ></textarea>
                </div>

                <div className="pt-1.5">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${success
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20'
                            } flex items-center justify-center min-h-[42px]`}
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : success ? (
                            <div className="text-white animate-in zoom-in duration-300">
                                <i className="fa fa-check-circle text-lg" />
                            </div>
                        ) : (
                            <span className="tracking-wide uppercase text-xs md:text-sm">{dict['CONTACT-FORM'].SEND_MESSAGE}</span>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
