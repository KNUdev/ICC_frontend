'use client'

import FlagEN from '@/assets/image/icons/English_flag.svg'
import FlagUA from '@/assets/image/icons/Ukraine_flag.svg'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import ArrowUp from '@/assets/image/icons/arrow-up.svg'
import { LANGUAGE_LABELS, type Locale, SUPPORTED_LOCALES } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import styles from './Header/Header.module.scss'

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const FlagIcon = locale === 'uk' ? FlagUA : FlagEN

  const handleChange = (newLang: Locale) => {
    router.push(pathname, { locale: newLang })
    setIsOpen(false)
  }

  return (
    <div className={styles.languageSwitcher}>
      <switch
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
      >
        <div className={styles.flagTextContainer}>
          <FlagUA className={styles.flag} aria-label='flagIcon' role='img' />

          {LANGUAGE_LABELS[locale as Locale]}
        </div>

        <span className={styles.arrow}>
          {isOpen ? (
            <ArrowUp aria-label='arrow-upIcon' role='img' />
          ) : (
            <ArrowDown aria-label='arrow-downIcon' role='img' />
          )}
        </span>
      </switch>
      {isOpen && (
        <ul className={styles.dropdown}>
          <li className={`${styles.option} ${styles.active}`}>
            <FlagUA className={styles.flag} aria-label='flagIcon' role='img' />

            {LANGUAGE_LABELS[locale as Locale]}
          </li>

          <hr className={styles.divider} role='separator' />

          {SUPPORTED_LOCALES.filter((code) => code !== locale).map((code) => (
            <li
              key={code}
              onClick={() => handleChange(code)}
              className={styles.option}
            >
              <FlagUA
                className={styles.flag}
                aria-label='flagIcon'
                role='img'
              />

              {LANGUAGE_LABELS[code]}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
