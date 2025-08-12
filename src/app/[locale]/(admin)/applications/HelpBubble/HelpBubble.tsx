'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './HelpBubble.module.scss'
import QuestionIcon from '@/assets/image/icons/question.svg'

interface HelpBubbleProps {
  helpText: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  ariaLabel?: string
}

export default function HelpBubble({
  helpText,
  position = 'bottom',
  ariaLabel = 'Help',
}: HelpBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipId = 'help-tooltip'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div className={`${styles.helpWrapper} ${styles[position]}`}>
      <button
        ref={buttonRef}
        type='button'
        className={styles.helpButton}
        aria-label={ariaLabel}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <QuestionIcon />
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role='tooltip'
          className={`${styles.helpTooltip} ${styles[position]} ${styles.open}`}
        >
          {helpText}
        </div>
      )}
    </div>
  )
}
