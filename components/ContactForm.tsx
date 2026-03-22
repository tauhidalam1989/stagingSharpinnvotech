'use client'

import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import { sendContactForm } from '@/lib/api';
import { motion } from 'framer-motion';

export default function ContactForm({ lang, dict }: { lang: Locale; dict: any }) {
    const isAr = lang === 'ar';
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
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 h-full">
            <div className="mb-10">
                <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mb-3">
                    {dict.CONTACT || (lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message')}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed">
                    {dict['CONTACT-FORM'].QUERY_PROMPT || (lang === 'ar' ? 'املأ النموذج أدناه وسيقوم فريقنا بالرد عليك خلال يوم عمل واحد.' : 'Fill in the form below and our team will get back to you within one business day.')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider px-1">
                            {dict['CONTACT-FORM'].YOUR_NAME} <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_NAME || "e.g. Ahmed Al-Rashidi"}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:font-light"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider px-1">
                            {dict['CONTACT-FORM'].YOUR_EMAIL} <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_EMAIL || "you@company.com"}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:font-light"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="contactNumber" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider px-1">
                            {dict['CONTACT-FORM'].CONTACT_NUMBER} <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_NUMBER || "+966 5X XXX XXXX"}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:font-light"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="organization" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider px-1">
                            {dict['CONTACT-FORM'].ORGANIZATION}
                        </label>
                        <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder={dict['CONTACT-FORM'].PLACEHOLDER_ORGANIZATION || "Your company name"}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:font-light"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider px-1">
                        {dict['CONTACT-FORM'].SUBJECT} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="">{dict['CONTACT-FORM'].PLACEHOLDER_SUBJECT}</option>
                            {subjects.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none group-hover:translate-y-0.5 transition-transform duration-300">
                            <i className="fas fa-chevron-down text-zinc-400 text-xs" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider px-1">
                        {dict['CONTACT-FORM'].MESSAGE} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder={dict['CONTACT-FORM'].PLACEHOLDER_MESSAGE || "Tell us about your project..."}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-[140px] leading-relaxed font-medium placeholder:font-light"
                    ></textarea>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-[1.25rem] font-bold text-white transition-all transform active:scale-[0.98] ${success
                                ? 'bg-emerald-500 shadow-xl shadow-emerald-500/20'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 hover:-translate-y-1'
                            } flex items-center justify-center gap-3`}
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : success ? (
                            <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                                <i className="fa fa-check-circle text-xl" />
                                <span className="text-sm uppercase tracking-widest">{isAr ? 'تم الإرسال!' : 'Message Sent!'}</span>
                            </div>
                        ) : (
                            <>
                                <i className="fa fa-paper-plane text-sm" />
                                <span className="tracking-widest uppercase text-xs md:text-sm">{dict['CONTACT-FORM'].SEND_MESSAGE}</span>
                            </>
                        )}
                    </button>
                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-[13px] font-medium text-center"
                        >
                            ✓ {lang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنقوم بالرد عليك خلال يوم عمل واحد.' : "Your message has been sent successfully! We'll get back to you within one business day."}
                        </motion.div>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}
                
                <p className="text-[11px] text-zinc-400 text-center font-light uppercase tracking-wider">
                    {lang === 'ar' ? 'معلوماتك محفوظة بسرية تامة ولا يتم مشاركتها أبداً.' : 'Your information is kept confidential and never shared.'}
                </p>
            </form>
        </div>
    );
}
