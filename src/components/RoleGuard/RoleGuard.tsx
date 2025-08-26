'use client'

import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useRole } from '@/shared/hooks/useRole'
import type { RolePermissions, UserRole } from '@/shared/lib/roles'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: (keyof RolePermissions)[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function RoleGuard({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback,
  redirectTo = '/',
}: RoleGuardProps) {
  const { hasAnyRole, hasPermission, isLoading: roleLoading } = useRole()
  const { isAuthenticated, isLoading: authLoading } = useCurrentUser()
  const router = useRouter()

  const isLoading = roleLoading || authLoading

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/Auth/SingIn')
      return
    }

    if (!isLoading && isAuthenticated) {
      const hasRequiredRole =
        requiredRoles.length === 0 || hasAnyRole(requiredRoles)
      const hasRequiredPermission =
        requiredPermissions.length === 0 ||
        requiredPermissions.some((permission) => hasPermission(permission))

      if (!hasRequiredRole || !hasRequiredPermission) {
        router.push(redirectTo)
        return
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    hasAnyRole,
    hasPermission,
    requiredRoles,
    requiredPermissions,
    router,
    redirectTo,
  ])

  if (isLoading) {
    return (
      <div className='role-guard-loading'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            fontSize: '1.1rem',
            color: '#6d6d6d',
          }}
        >
          Проверка доступа...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || null
  }

  const hasRequiredRole =
    requiredRoles.length === 0 || hasAnyRole(requiredRoles)
  const hasRequiredPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((permission) => hasPermission(permission))

  if (!hasRequiredRole || !hasRequiredPermission) {
    return (
      fallback || (
        <div className='role-guard-forbidden'>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <h2 style={{ color: '#ff525e', marginBottom: '1rem' }}>
              Доступ запрещен
            </h2>
            <p style={{ color: '#6d6d6d', marginBottom: '2rem' }}>
              У вас недостаточно прав для доступа к этой странице
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ff525e',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
