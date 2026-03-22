import { getDictionary } from "@/lib/get-dictionary";
import FAQPageClient from "@/components/FAQPageClient";

export default async function FAQPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <FAQPageClient lang={lang} dict={dict} />;
}
