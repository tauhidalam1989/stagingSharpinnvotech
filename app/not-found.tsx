import { getDictionary } from "@/lib/get-dictionary";
import NotFoundUI from "@/components/NotFoundUI";

export default async function GlobalNotFound() {
    // Default to English for root-level 404s
    const lang = 'en';
    const dict = await getDictionary(lang);

    return <NotFoundUI lang={lang} dict={dict} />;
}
