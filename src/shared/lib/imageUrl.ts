import { API } from '@/shared/config/api.config'

export function getFullImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('/')) {
    return path
  }
  
  // Ensure API ends with a slash and path doesn't start with one
  const baseUrl = API.endsWith('/') ? API : `${API}/`
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  
  return `${baseUrl}${cleanPath}`
}
