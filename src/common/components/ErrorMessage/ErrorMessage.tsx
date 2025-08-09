import React from 'react'
import CloseButton from '../Input/CloseButton/CloseButton'
import styles from './ErrorMessage.module.scss'

interface ErrorMessageProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

const ErrorIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='30'
    height='30'
    viewBox='0 0 30 30'
    fill='none'
  >
    <path
      d='M15 2.5L27.5 25H2.5L15 2.5ZM15 20V22.5H15V20ZM15 12.5V17.5H15V12.5Z'
      fill='#A30E2C'
    />
  </svg>
)

const ErrorMessage = ({ message, isVisible, onClose }: ErrorMessageProps) => {
  if (!isVisible) return null

  return (
    <div className={styles.errorMessage}>
      <div className={styles.content}>
        <ErrorIcon />
        <span className={styles.text}>{message}</span>
      </div>
      <CloseButton onClick={onClose} />
    </div>
  )
}

export default ErrorMessage
