'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const pathname = usePathname()
    const router = useRouter()

    const redirectedPathname = (locale: string) => {
        if (!pathname) return '/'
        const segments = pathname.split('/')
        segments[1] = locale
        return segments.join('/')
    }

    const otherLocale = currentLang === 'en' ? 'ar' : 'en';
    const label = currentLang === 'en' ? 'عربي' : 'English';

    return (
        <div className="flex items-center">
            <Link
                href={redirectedPathname(otherLocale)}
                className="text-[16px] font-medium transition-colors hover:text-white/80"
            >
                {label}
            </Link>
        </div>
    );
}
