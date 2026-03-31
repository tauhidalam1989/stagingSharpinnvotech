import { getClients, getPartners, getCertificates } from '@/lib/api';
import ClientsSection from './ClientsSection';
import { Locale } from '@/lib/get-dictionary';

export default async function ClientsSectionWrapper({ lang, dict }: { lang: Locale; dict: any }) {
    const [clients, partners, certificates] = await Promise.all([
        getClients('active'),
        getPartners('active'),
        getCertificates('active'),
    ]);

    return (
        <ClientsSection
            lang={lang}
            dict={dict}
            clients={clients}
            partners={partners}
            certificates={certificates}
        />
    );
}
