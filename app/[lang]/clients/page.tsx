import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getClients, getPartners, getCertificates } from "@/lib/api";
import FAQSection from "@/components/FAQSection";
import Newsletter from "@/components/Newsletter";
import ClientsPageClient from "@/components/ClientsPageClient";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function ClientsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const clients = await getClients('active');
    const partners = await getPartners('active');
    const certificates = await getCertificates('active');

    return (
        <div className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Breadcrumbs lang={lang} dict={dict} items={[{ label: lang === 'ar' ? 'شركاؤنا' : 'Clients' }]} />
            <ClientsPageClient 
                lang={lang} 
                dict={dict} 
                clients={clients} 
                partners={partners} 
                certificates={certificates} 
            />

            <FAQSection lang={lang} dict={dict} />
            <Newsletter lang={lang} dict={dict} />
        </div>
    );
}
