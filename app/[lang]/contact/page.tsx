import { getDictionary, Locale } from "@/lib/get-dictionary";
import ContactForm from "@/components/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactStrip from "@/components/contact/ContactStrip";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactWhy from "@/components/contact/ContactWhy";

export default async function ContactPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Hero Section */}
            <ContactHero lang={lang} dict={dict} />

            {/* Quick Contact Strip */}
            <ContactStrip lang={lang} dict={dict} />

            {/* Main Contact Section */}
            <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
                        {/* Form Column */}
                        <div className="h-full">
                            <ContactForm lang={lang as Locale} dict={dict} />
                        </div>

                        {/* Info Column */}
                        <ContactInfo lang={lang} dict={dict} />
                    </div>
                </div>
            </section>

            {/* Why Contact Us Section */}
            <ContactWhy lang={lang} dict={dict} />
        </div>
    );
}
