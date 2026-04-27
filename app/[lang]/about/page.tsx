import { getDictionary, Locale } from "@/lib/get-dictionary";
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutMissionVision from '@/components/about/AboutMissionVision';
import AboutValues from '@/components/about/AboutValues';
import AboutTimeline from '@/components/about/AboutTimeline';
import AboutCommitment from '@/components/about/AboutCommitment';
import AboutCTA from '@/components/about/AboutCTA';
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/schema-builder";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return {
        title: dict.PAGE_TITLES.ABOUT || "About Us",
        description: dict.PAGE_TITLES.ABOUT_DESC || "Learn more about Sharp Innovation's mission, vision, and core values.",
        alternates: {
            canonical: `/${lang}/about`,
        }
    };
}

export default async function AboutPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dict = await getDictionary(lang);
    const schema = getWebPageSchema(
        dict.PAGE_TITLES.ABOUT || "About Us",
        dict.PAGE_TITLES.ABOUT_DESC || "Learn more about Sharp Innovation's mission, vision, and core values.",
        lang,
        'AboutPage'
    );

    return (
        <main className="bg-white">
            <JsonLd schema={schema} />
            {/* <Breadcrumbs lang={lang} dict={dict} items={[{ label: dict.ABOUT || (lang === 'ar' ? 'نبذة عنا' : 'About Us') }]} /> */}
            <AboutHero lang={lang} dict={dict} />
            <AboutStory lang={lang} dict={dict} />
            <AboutMissionVision lang={lang} dict={dict} />
            <AboutValues lang={lang} dict={dict} />
            <AboutTimeline lang={lang} dict={dict} />
            <AboutCommitment lang={lang} dict={dict} />
            <AboutCTA lang={lang} dict={dict} />
        </main>
    );
}
