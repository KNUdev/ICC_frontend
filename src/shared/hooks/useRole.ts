'use client'

import type { RolePermissions, UserRole } from '@/shared/lib/roles'
import {
  getHighestRole,
  getUserRoles,
  hasAnyRole,
  hasPermission,
  hasRole,
} from '@/shared/lib/roles'
import { useEffect, useState } from 'react'

interface UseRoleReturn {
  userRoles: UserRole[]
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  hasPermission: (permission: keyof RolePermissions) => boolean
  highestRole: UserRole | null
  isLoading: boolean
}

export function useRole(): UseRoleReturn {
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateRoles = () => {
      setIsLoading(true)
      const roles = getUserRoles()
      setUserRoles(roles)
      setIsLoading(false)
    }

    // Загружаем роли при монтировании
    updateRoles()

    // Слушаем события изменения состояния аутентификации
    const handleAuthStateChange = () => {
      updateRoles()
    }

    window.addEventListener('auth-state-changed', handleAuthStateChange)

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChange)
    }
  }, [])

  return {
    userRoles,
    hasRole: (role: UserRole) => hasRole(role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(roles),
    hasPermission: (permission: keyof RolePermissions) =>
      hasPermission(permission),
    highestRole: getHighestRole(),
    isLoading,
  }
}
