'use client'

import FlagEN from '@/assets/image/icons/English_flag.svg'
import FlagUA from '@/assets/image/icons/Ukraine_flag.svg'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import ArrowUp from '@/assets/image/icons/arrow-up.svg'
import { LANGUAGE_LABELS, type Locale, SUPPORTED_LOCALES } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import styles from './Header/Header.module.scss'

const FLAG_ICONS: Record<Locale, React.FC<React.SVGProps<SVGSVGElement>>> = {
  uk: FlagUA,
  en: FlagEN,
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleChange = (newLang: Locale) => {
    document.cookie = `locale=${newLang}; path=/; max-age=31536000; SameSite=Lax`

    router.replace(pathname, { locale: newLang })
    setIsOpen(false)
  }

  const CurrentFlag = FLAG_ICONS[locale as Locale]

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <switch
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
      >
        <div className={styles.flagTextContainer}>
          <CurrentFlag
            className={styles.flag}
            aria-label='flagIcon'
            role='img'
          />

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
            <CurrentFlag
              className={styles.flag}
              aria-label='flagIcon'
              role='img'
            />

            {LANGUAGE_LABELS[locale as Locale]}
          </li>

          <hr className={styles.divider} role='separator' />

          {SUPPORTED_LOCALES.filter((code) => code !== locale).map((code) => {
            const Flag = FLAG_ICONS[code]
            return (
              <li
                key={code}
                onClick={() => handleChange(code)}
                className={styles.option}
              >
                <Flag
                  className={styles.flag}
                  aria-label='flagIcon'
                  role='img'
                />

                {LANGUAGE_LABELS[code]}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
