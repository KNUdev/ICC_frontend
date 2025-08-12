'use client'

import { getGalleryItems } from '@/shared/api/gallery'
import type { GalleryItem } from '@/shared/types/gallery'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseGalleryProps {
  pageSize?: number
}

export function useGallery({ pageSize = 10 }: UseGalleryProps = {}) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)

  const loadItems = useCallback(
    async (page: number, reset = false) => {
      if (loadingRef.current) return

      loadingRef.current = true
      setLoading(true)
      setError(null)

      try {
        const response = await getGalleryItems({
          pageNumber: page,
          pageSize,
        })

        if (response) {
          setItems((prev) =>
            reset ? response.content : [...prev, ...response.content],
          )
          setHasMore(!response.last)
          pageRef.current = page
        } else {
          setError('Не удалось загрузить изображения')
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке изображений')
        console.error('Gallery loading error:', err)
      } finally {
        setLoading(false)
        loadingRef.current = false
      }
    },
    [pageSize],
  )

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return
    loadItems(pageRef.current + 1)
  }, [hasMore, loadItems])

  const refresh = useCallback(() => {
    pageRef.current = 0
    setItems([])
    setHasMore(true)
    loadItems(0, true)
  }, [loadItems])

  useEffect(() => {
    loadItems(0, true)
  }, [loadItems])

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
  }
}
