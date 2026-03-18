import { getDictionary, Locale } from "@/lib/get-dictionary";
import Breadcrumbs from "@/components/Breadcrumbs";
import AboutSection from "@/components/AboutSection";
import ServiceSection from "@/components/ServiceSection";
import PhilosophySection from "@/components/PhilosophySection";
import Newsletter from "@/components/Newsletter";

export default async function AboutPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-col w-full">
            <Breadcrumbs lang={lang} dict={dict} items={[{ label: dict.ABOUT || (lang === 'ar' ? 'نبذة عنا' : 'About Us') }]} />
            <AboutSection lang={lang} dict={dict} />
            <ServiceSection lang={lang} dict={dict} />
            <PhilosophySection lang={lang} dict={dict} />
            <Newsletter lang={lang} dict={dict} />
        </div>
    );
}
