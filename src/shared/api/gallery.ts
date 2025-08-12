import { API } from '@/shared/config/api.config'
import type { GalleryParams, GalleryResponse } from '@/shared/types/gallery'

export async function getGalleryItems(
  params: GalleryParams = {},
): Promise<GalleryResponse | null> {
  try {
    const { pageNumber = 0, pageSize = 10 } = params

    const searchParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    })

    const response = await fetch(`${API}gallery?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch gallery data:', response.status)
      return null
    }

    const galleryData: GalleryResponse = await response.json()
    return galleryData
  } catch (error) {
    console.error('Error fetching gallery data:', error)
    return null
  }
}
