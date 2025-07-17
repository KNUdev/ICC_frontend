import React from 'react'
import styles from './CloseButton.module.scss'

interface CloseButtonProps {
  onClick: () => void
  className?: string
}

const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.closeButton} ${className || ''}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
        <path d="M5.33341 16.3334L4.16675 15.1667L8.83342 10.5L4.16675 5.83335L5.33341 4.66669L10.0001 9.33335L14.6667 4.66669L15.8334 5.83335L11.1667 10.5L15.8334 15.1667L14.6667 16.3334L10.0001 11.6667L5.33341 16.3334Z" fill="#272727"/>
      </svg>
    </button>
  )
}

export default CloseButton
