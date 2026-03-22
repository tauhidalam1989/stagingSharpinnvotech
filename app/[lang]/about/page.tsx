import { getDictionary, Locale } from "@/lib/get-dictionary";
import Breadcrumbs from "@/components/Breadcrumbs";
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutMissionVision from '@/components/about/AboutMissionVision';
import AboutValues from '@/components/about/AboutValues';
import AboutTimeline from '@/components/about/AboutTimeline';
import AboutCommitment from '@/components/about/AboutCommitment';
import AboutCTA from '@/components/about/AboutCTA';

export default async function AboutPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dict = await getDictionary(lang);

    return (
        <main className="bg-white">
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
