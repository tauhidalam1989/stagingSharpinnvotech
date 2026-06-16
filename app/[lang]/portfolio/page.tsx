import { getPublicPortfolio } from '@/lib/api';
import { notFound } from 'next/navigation';
import PortfolioClient from './PortfolioClient';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function PublicPortfolioPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const portfolioData = await getPublicPortfolio();

    if (!portfolioData) {
        notFound();
    }

    return <PortfolioClient portfolioData={portfolioData} lang={lang} />;
}
