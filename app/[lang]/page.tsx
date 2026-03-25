import { getDictionary, Locale } from '@/lib/get-dictionary';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServiceSection from '@/components/ServiceSection';
import ClientsSection from '@/components/ClientsSection';
import FAQSection from '@/components/FAQSection';
import Newsletter from '@/components/Newsletter';
import AISolutionsSection from '@/components/AISolutionsSection';
import PhilosophySection from '@/components/PhilosophySection';
import LatestBlogsSection from '@/components/LatestBlogsSection';
import { getClients, getPartners, getCertificates, getPublishedBlogs } from '@/lib/api';

export default async function Home({ params }: { params: Promise<{ lang: string }>; }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    // Fetch dynamic data for clients/partners section
    const [clients, partners, certificates, blogsRes] = await Promise.all([
        getClients('active'),
        getPartners('active'),
        getCertificates('active'),
        getPublishedBlogs({ limit: 8 })
    ]);

    return (
        <div className="flex flex-col w-full gap-12 sm:gap-16 lg:gap-20">
            <Hero lang={lang} dict={dict} />
            <AboutSection lang={lang} dict={dict} />
            <ServiceSection lang={lang} dict={dict} />
            <AISolutionsSection lang={lang} dict={dict} />
            <PhilosophySection lang={lang} dict={dict} />
            <div className="flex flex-col gap-0">
                <ClientsSection
                    lang={lang}
                    dict={dict}
                    clients={clients}
                    partners={partners}
                    certificates={certificates}
                />
                <FAQSection lang={lang} dict={dict} />
                <LatestBlogsSection lang={lang} dict={dict} blogs={blogsRes.blogs} />
                <Newsletter lang={lang} dict={dict} />
            </div>
        </div>
    );
}
