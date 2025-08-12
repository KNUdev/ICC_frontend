import { getCookie, isTokenExpired, parseJWT } from './jwt'

export type UserRole =
  | 'COMMON_USER'
  | 'SECRETARY'
  | 'SITE_MANAGER'
  | 'HEAD_MANAGER'

export interface RolePermissions {
  canAccessAdminPanel: boolean
  canCreateEmployees: boolean
  canEditEmployees: boolean
  canDeleteEmployees: boolean
  canViewAllEmployees: boolean
  canManageRoles: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  COMMON_USER: {
    canAccessAdminPanel: false,
    canCreateEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewAllEmployees: false,
    canManageRoles: false,
  },
  SECRETARY: {
    canAccessAdminPanel: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canViewAllEmployees: true,
    canManageRoles: false,
  },
  SITE_MANAGER: {
    canAccessAdminPanel: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewAllEmployees: true,
    canManageRoles: false,
  },
  HEAD_MANAGER: {
    canAccessAdminPanel: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewAllEmployees: true,
    canManageRoles: true,
  },
}

export function getUserRoles(): UserRole[] {
  const accessToken = getCookie('accessToken')
  if (!accessToken || isTokenExpired(accessToken)) {
    return []
  }

  const payload = parseJWT(accessToken)
  return (payload?.roles as UserRole[]) || []
}

export function hasRole(requiredRole: UserRole): boolean {
  const userRoles = getUserRoles()
  return userRoles.includes(requiredRole)
}

export function hasAnyRole(requiredRoles: UserRole[]): boolean {
  const userRoles = getUserRoles()
  return requiredRoles.some((role) => userRoles.includes(role))
}

export function hasPermission(permission: keyof RolePermissions): boolean {
  const userRoles = getUserRoles()

  return userRoles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role]
    return permissions[permission]
  })
}

export function getHighestRole(): UserRole | null {
  const userRoles = getUserRoles()

  const roleHierarchy: UserRole[] = [
    'HEAD_MANAGER',
    'SITE_MANAGER',
    'SECRETARY',
    'COMMON_USER',
  ]

  for (const role of roleHierarchy) {
    if (userRoles.includes(role)) {
      return role
    }
  }

  return null
}
