export const SUPPORTED_LOCALES = ['en', 'uk'] as const
export const DEFAULT_LOCALE: (typeof SUPPORTED_LOCALES)[number] = 'uk'
export const FALLBACK_LOCALE: (typeof SUPPORTED_LOCALES)[number] = 'en'

export const LANGUAGE_LABELS = {
	en: 'English',
	uk: 'Українська',
} as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const NAMESPACES = ['common', 'home']
