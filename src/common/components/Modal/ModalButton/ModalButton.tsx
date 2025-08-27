import React from 'react'
import styles from './ModalButton.module.scss'

interface ModalButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  className?: string
}

const ModalButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: ModalButtonProps) => {
  return (
    <button
      className={`${styles.modalButton} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ModalButton
