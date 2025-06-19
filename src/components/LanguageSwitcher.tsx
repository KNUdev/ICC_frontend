'use client'

import { LANGUAGE_LABELS, type Locale, SUPPORTED_LOCALES } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Locale
    router.push(pathname, { locale: newLang })
  }

  return (
    <select value={locale} onChange={handleChange}>
      {SUPPORTED_LOCALES.map((code) => (
        <option key={code} value={code}>
          {LANGUAGE_LABELS[code]}
        </option>
      ))}
    </select>
  )
}
