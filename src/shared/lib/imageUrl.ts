import { API } from '@/shared/config/api.config'

export function getFullImageUrl(
  imagePath: string | null | undefined,
): string | null {
  if (!imagePath) {
    return null
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

  return `${API}${cleanPath}`
}
