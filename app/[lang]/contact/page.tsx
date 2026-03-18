import { getDictionary, Locale } from "@/lib/get-dictionary";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function ContactPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Breadcrumbs lang={lang} dict={dict} items={[{ label: dict['CONTACT-FORM'].US || (lang === 'ar' ? 'اتصل بنا' : 'Contact Us') }]} />
            {/* Header */}
            <section className="py-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 text-center">
                    <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mb-4 uppercase tracking-[0.2em]">
                        {dict['CONTACT-FORM'].US}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black mb-5 tracking-tight">
                        {lang === 'ar' ? 'دعنا نتحدث عن مشروعك القادم' : 'Let\'s talk about your next project'}
                    </h1>
                    <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        {dict['CONTACT-FORM'].QUERY_PROMPT}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Form Column */}
                        <ContactForm lang={lang} dict={dict} />

                        {/* Info Column */}
                        <div className="space-y-10">
                            {/* Map Card */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none p-4">
                                <div className="aspect-video relative rounded-[24px] overflow-hidden mb-6">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3626.6349878292594!2d46.83981599999999!3d24.636262400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2fa712790d0be7%3A0xae72a5d4a66b7e45!2z2LTYsdmD2Kkg2KfYqNiq2YPYp9ix2KfYqiDYrdin2K_YqQ!5e0!3m2!1sen!2sin!4v1743526567330!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                                <div className="px-2 pb-2">
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                                            <i className="fas fa-map-marker-alt" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{lang === 'ar' ? 'العنوان' : 'Address'}</h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{dict.FOOTER.ADDRESS}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-base">{dict['CONTACT-FORM'].CONTACT_DETAILS}</h4>
                                            <div className="space-y-3">
                                                <a href={`tel:${dict.FOOTER.PHONE.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                                                    <i className="fas fa-phone-alt w-4" /> {dict.FOOTER.PHONE}
                                                </a>
                                                <a href={`tel:${dict.FOOTER.LANDLINE.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                                                    <i className="fas fa-tty w-4" /> {dict.FOOTER.LANDLINE}
                                                </a>
                                                <a href={`mailto:${dict.FOOTER.EMAIL}`} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                                                    <i className="fas fa-envelope w-4" /> {dict.FOOTER.EMAIL}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-base">{dict['CONTACT-FORM'].SALES_INQURY}</h4>
                                            <div className="space-y-3">
                                                <a href={`tel:${dict.FOOTER.PHONE.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                                                    <i className="fas fa-phone-alt w-4" /> {dict.FOOTER.PHONE}
                                                </a>
                                                <a href={`mailto:${dict.FOOTER.sales}`} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                                                    <i className="fas fa-envelope w-4" /> {dict.FOOTER.sales}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hours Card */}
                            <div className="bg-blue-600 rounded-[32px] p-7 md:p-10 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <i className="fas fa-clock text-[8rem] rotate-12" />
                                </div>
                                <h4 className="text-xl font-bold mb-5">{dict['CONTACT-FORM'].CONTACT_HOURS}</h4>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center gap-3 text-lg">
                                        <i className="fas fa-calendar-alt opacity-60 text-base" />
                                        <span>{dict['CONTACT-FORM'].CONTACT_TIME}</span>
                                    </div>
                                    <div className="inline-block bg-white/10 backdrop-blur-md px-5 py-2 rounded-xl text-base font-medium border border-white/20">
                                        {dict['CONTACT-FORM'].CONTACT_DAY}
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/20">
                                    <h5 className="text-sm font-bold mb-5 tracking-wide uppercase opacity-80">{dict['CONTACT-FORM'].CONTACT_SOCIALMEDIA}</h5>
                                    <div className="flex gap-3">
                                        {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon) => (
                                            <a key={icon} href="#" className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all">
                                                <i className={`fab fa-${icon} text-sm`} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
