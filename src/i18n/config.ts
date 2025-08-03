export const SUPPORTED_LOCALES = ['en', 'uk'] as const
export const DEFAULT_LOCALE: (typeof SUPPORTED_LOCALES)[number] = 'uk'
export const FALLBACK_LOCALE: (typeof SUPPORTED_LOCALES)[number] = 'en'

export const LANGUAGE_LABELS: Record<Locale, string> = {
  uk: 'UA',
  en: 'ENG',
}

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const NAMESPACES = [
  'common',
  'home',
  'footer',
  'form/text',
  'form/application',
  'form/points',
  'form/success',
  'faq',
  'AddNewWorker/common',
]
