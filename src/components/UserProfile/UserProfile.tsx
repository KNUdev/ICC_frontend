'use client'

import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { logout } from '@/shared/lib/jwt'
import Image from 'next/image'
import { useState } from 'react'
import styles from './UserProfile.module.scss'

export function UserProfile() {
  const { employee, isLoading, isAuthenticated } = useCurrentUser()
  const [showDropdown, setShowDropdown] = useState(false)

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

  const fullName = `${employee.name.firstName} ${employee.name.lastName} ${employee.name.middleName}`

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{fullName}</div>
        <div className={styles.userEmail}>{employee.email}</div>
      </div>
      <div className={styles.avatarContainer}>
        <button
          className={styles.avatarButton}
          onClick={() => setShowDropdown(!showDropdown)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        >
          <Image
            src={employee.avatarUrl}
            alt={`${fullName} avatar`}
            width={40}
            height={40}
            className={styles.avatar}
            unoptimized
          />
        </button>

        {showDropdown && (
          <div className={styles.dropdown}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
