import { getDictionary } from "@/lib/get-dictionary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <>
            <Header lang={lang} dict={dict} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer lang={lang} dict={dict} />
        </>
    );
}
