import { getGalleryItems } from '@/shared/api/gallery'
import type { GalleryItem } from '@/shared/types/gallery'
import { useCallback, useEffect, useState } from 'react'

interface UseGalleryOptions {
  pageSize?: number
}

interface UseGalleryReturn {
  items: GalleryItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export const useGallery = ({ pageSize = 12 }: UseGalleryOptions = {}): UseGalleryReturn => {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchGalleryItems = useCallback(async (pageNumber: number, isRefresh = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getGalleryItems({ pageNumber, pageSize })
      
      if (!data) {
        setError('Failed to fetch gallery items')
        return
      }

      setItems(prev => isRefresh ? data.content : [...prev, ...data.content])
      setHasMore(!data.last)
      setPage(pageNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  useEffect(() => {
    fetchGalleryItems(0, true)
  }, [fetchGalleryItems])

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchGalleryItems(page + 1)
    }
  }, [loading, hasMore, page, fetchGalleryItems])

  const refresh = useCallback(async () => {
    setPage(0)
    await fetchGalleryItems(0, true)
  }, [fetchGalleryItems])

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  }
}
