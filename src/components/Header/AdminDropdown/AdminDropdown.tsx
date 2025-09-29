'use client'

import { ADMIN_PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './AdminDropdown.module.scss'

interface AdminDropdownProps {
  className?: string
}

export function AdminDropdown({ className }: AdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tCommon = useTranslations('common')

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
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`${styles.dropdown} ${className || ''}`} ref={dropdownRef}>
      <button
        className={styles.toggleButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <span>{tCommon('navigation.adminDropdown')}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {Object.entries(ADMIN_PAGES).map(([key, link]) => (
            <Link
              key={key}
              href={link}
              className={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              {tCommon(`navigation.admin.${key}`)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
