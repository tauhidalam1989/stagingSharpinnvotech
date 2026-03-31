import { Suspense } from 'react';
import { getDictionary } from '@/lib/get-dictionary';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServiceSection from '@/components/ServiceSection';
import AISolutionsSection from '@/components/AISolutionsSection';
import PhilosophySection from '@/components/PhilosophySection';
import Newsletter from '@/components/Newsletter';
import FAQSection from '@/components/FAQSection';
import ClientsSectionWrapper from '@/components/ClientsSectionWrapper';
import LatestBlogsWrapper from '@/components/LatestBlogsWrapper';

export default async function Home({ params }: { params: Promise<{ lang: string }>; }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-col w-full gap-8 sm:gap-12 lg:gap-16">
            <Hero lang={lang} dict={dict} />
            <AboutSection lang={lang} dict={dict} />
            <ServiceSection lang={lang} dict={dict} />
            <AISolutionsSection lang={lang} dict={dict} />
            <PhilosophySection lang={lang} dict={dict} />
            
            <div className="flex flex-col gap-0 text-[#333]">
                <Suspense fallback={<div className="py-20 text-center text-zinc-500">Loading clients...</div>}>
                    <ClientsSectionWrapper lang={lang} dict={dict} />
                </Suspense>
                
                <FAQSection lang={lang} dict={dict} />
                
                <Suspense fallback={<div className="py-20 text-center text-zinc-500">Loading insights...</div>}>
                    <LatestBlogsWrapper lang={lang} dict={dict} />
                </Suspense>
                
                <Newsletter lang={lang} dict={dict} />
            </div>
        </div>
    );
}
