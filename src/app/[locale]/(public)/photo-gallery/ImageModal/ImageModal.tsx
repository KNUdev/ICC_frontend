'use client'

import CloseIcon from '@/assets/image/icons/close.svg'
import Image from 'next/image'
import { useEffect } from 'react'
import styles from './ImageModal.module.scss'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  title: string
  description?: string
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
}: ImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label='Закрыть'
      >
        <CloseIcon />
      </button>

      <div className={styles.modalContent}>
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={styles.image}
            sizes='100vw'
            quality={100}
          />
        </div>

        <div className={styles.imageInfo}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
    </div>
  )
}
