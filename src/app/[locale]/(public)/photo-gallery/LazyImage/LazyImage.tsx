'use client'

import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import type { GalleryItem } from '@/shared/types/gallery'
import Image from 'next/image'
import { useState } from 'react'
import styles from './LazyImage.module.scss'

interface LazyImageProps {
  item: GalleryItem
  className?: string
}

export default function LazyImage({ item, className }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  })

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  return (
    <div ref={targetRef} className={`${styles.lazyImage} ${className || ''}`}>
      {isIntersecting && !error && (
        <Image
          src={item.itemUrl}
          alt={item.itemDescription || item.publicItemName}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          onLoad={handleLoad}
          onError={handleError}
          className={`${styles.image} ${loaded ? styles.loaded : ''}`}
        />
      )}
      {!loaded && !error && isIntersecting && (
        <div className={styles.placeholder}>
          <div className={styles.spinner} />
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <span>Не удалось загрузить изображение</span>
        </div>
      )}
      {!isIntersecting && <div className={styles.placeholder} />}
    </div>
  )
}
