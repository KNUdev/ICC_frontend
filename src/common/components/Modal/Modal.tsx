import React from 'react'
import styles from './Modal.module.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
}: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className={styles.modalHeader}>
            {title && <h3 className={styles.modalTitle}>{title}</h3>}
            {showCloseButton && (
              <button className={styles.closeButton} onClick={onClose}>
                ×
              </button>
            )}
          </div>
        )}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
