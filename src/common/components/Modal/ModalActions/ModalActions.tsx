import React from 'react'
import styles from './ModalActions.module.scss'

interface ModalActionsProps {
  children: React.ReactNode
  className?: string
}

const ModalActions = ({ children, className = '' }: ModalActionsProps) => {
  return <div className={`${styles.modalActions} ${className}`}>{children}</div>
}

export default ModalActions
