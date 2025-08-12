'use client'

import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useRole } from '@/shared/hooks/useRole'
import { logout } from '@/shared/lib/jwt'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './UserProfile.module.scss'

export function UserProfile() {
  const { employee, isLoading, isAuthenticated } = useCurrentUser()
  const { highestRole } = useRole()
  const [showDropdown, setShowDropdown] = useState(false)
  const tCommon = useTranslations('common')

  if (isLoading) {
    return (
      <div className={styles.userProfile}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSkeleton}></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !employee) {
    return null
  }

  const fullName = `${employee.name.lastName} ${employee.name.firstName}  ${employee.name.middleName}`
  const roleLabel = highestRole
    ? tCommon(`roles.${highestRole}`)
    : tCommon('roles.COMMON_USER')

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{fullName}</div>
        <div className={styles.userEmail}>{employee.email}</div>
        <div className={styles.userRole}>{roleLabel}</div>
      </div>
      <div className={styles.avatarContainer}>
        <button
          className={styles.avatarButton}
          onClick={() => setShowDropdown(!showDropdown)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        >
          <Image
            src={employee.avatarUrl || '/default-avatar.png'}
            alt={`${fullName} avatar`}
            width={40}
            height={40}
            className={styles.avatar}
            unoptimized
          />
        </button>

        {showDropdown && (
          <div className={styles.dropdown}>
            <Link
              href='/userProfile'
              className={styles.profileLink}
              onClick={() => setShowDropdown(false)}
            >
              {tCommon('navigation.profile')}
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              {tCommon('authentication.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
