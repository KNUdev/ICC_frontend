'use client'

import { useRole } from '@/shared/hooks/useRole'
import type { RolePermissions, UserRole } from '@/shared/lib/roles'

interface RoleBasedProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: (keyof RolePermissions)[]
  fallback?: React.ReactNode
}

export function RoleBased({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback = null,
}: RoleBasedProps) {
  const { hasAnyRole, hasPermission } = useRole()

  const hasRequiredRole =
    requiredRoles.length === 0 || hasAnyRole(requiredRoles)
  const hasRequiredPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((permission) => hasPermission(permission))

  if (!hasRequiredRole || !hasRequiredPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
