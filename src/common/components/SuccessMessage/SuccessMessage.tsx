import React from 'react'
import CloseButton from '../Input/CloseButton/CloseButton'
import styles from './SuccessMessage.module.scss'

interface SuccessMessageProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

const CheckIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='30'
    height='30'
    viewBox='0 0 30 30'
    fill='none'
  >
    <path
      d='M11.9375 22.5L4.8125 15.375L6.59375 13.5938L11.9375 18.9375L23.4062 7.46875L25.1875 9.25L11.9375 22.5Z'
      fill='#40D438'
    />
  </svg>
)

const SuccessMessage = ({
  message,
  isVisible,
  onClose,
}: SuccessMessageProps) => {
  if (!isVisible) return null

  return (
    <div className={styles.successMessage}>
      <div className={styles.content}>
        <CheckIcon />
        <span className={styles.text}>{message}</span>
      </div>
      <CloseButton onClick={onClose} />
    </div>
  )
}

export default SuccessMessage
