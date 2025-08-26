interface TokenPayload {
  isacct: boolean
  roles: string[]
  employeeId: string
  userid: string
  sub: string
  iss: string
  iat: number
  exp: number
}

export function parseJWT(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload) return true

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

export function getEmployeeIdFromToken(): string | null {
  const accessToken = getCookie('accessToken')
  if (!accessToken || isTokenExpired(accessToken)) {
    return null
  }

  const payload = parseJWT(accessToken)
  return payload?.employeeId || null
}

export function logout(): void {
  document.cookie =
    'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie =
    'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

  window.dispatchEvent(new Event('auth-state-changed'))
}
