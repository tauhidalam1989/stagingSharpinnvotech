import { getDictionary } from "@/lib/get-dictionary";
import NotFoundUI from "@/components/NotFoundUI";
import { headers } from "next/headers";

export default async function NotFound() {
    // 1. Get the current pathname from the custom header set in middleware
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    
    // 2. Extract locale from pathname (e.g., /en/services... -> en)
    const segments = pathname.split('/');
    const lang = segments[1] === 'ar' ? 'ar' : 'en'; // Simple extraction
    
    // 3. Get dictionary for the detected locale
    const dict = await getDictionary(lang);

    return (
        <NotFoundUI lang={lang} dict={dict} />
    );
}
