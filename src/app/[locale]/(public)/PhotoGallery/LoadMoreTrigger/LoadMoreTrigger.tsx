'use client'

import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import { useEffect } from 'react'
import styles from './LoadMoreTrigger.module.scss'

interface LoadMoreTriggerProps {
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

export default function LoadMoreTrigger({
  onLoadMore,
  hasMore,
  loading,
}: LoadMoreTriggerProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore()
    }
  }, [isIntersecting, hasMore, loading, onLoadMore])

  if (!hasMore) {
    return null
  }

  return (
    <div ref={targetRef} className={styles.loadMoreTrigger}>
      {loading && (
        <div className={styles.spinner}>
          <div className={styles.spinnerCircle} />
        </div>
      )}
    </div>
  )
}
