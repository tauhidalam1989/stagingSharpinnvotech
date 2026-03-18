import 'server-only'

const dictionaries: Record<string, () => Promise<any>> = {
    en: () => import('@/public/i18n/en.json').then((module) => module.default),
    ar: () => import('@/public/i18n/ar.json').then((module) => module.default),
}

// Locale is string so it's compatible with what Next.js 16 infers for params.
// Components that type their lang prop as Locale will now accept any string.
export type Locale = string

export const getDictionary = async (locale: string) => {
    return dictionaries[locale] ? dictionaries[locale]() : dictionaries['en']()
}
