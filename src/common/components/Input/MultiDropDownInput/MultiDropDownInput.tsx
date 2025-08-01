'use client'

import { useEffect, useRef, useState } from 'react'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import ArrowUp from '@/assets/image/icons/arrow-up.svg'
import ErrorIcon from '@/assets/image/icons/bigger-error.svg'
import styles from './MultiDropDownInput.module.scss'

interface Option {
  value: string
  label: string
}

interface MultiDropDownInputProps {
  options: Option[]
  onSubmit: (selected: string[]) => void
  onOpen?: (values: string[]) => void
  placeholder?: string
  initialSelected?: string[]
  hasError?: boolean
  errorMessage?: string | null
  optionalStyle?: boolean
}

const MultiDropDownInput: React.FC<MultiDropDownInputProps> = ({
  options,
  onSubmit,
  onOpen,
  placeholder = 'Select options',
  initialSelected = [],
  hasError = false,
  errorMessage = null,
  optionalStyle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedValues, setSelectedValues] =
    useState<string[]>(initialSelected)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }
  }, [isExpanded])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExpanded) return

      if (e.key === 'Escape') {
        setIsExpanded(false)
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        onSubmit(selectedValues)
        setIsExpanded(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, selectedValues, onSubmit])

  const toggleSelect = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const toggleExpanded = () => {
    const newState = !isExpanded
    setIsExpanded(newState)

    if (newState && onOpen) {
      try {
        onOpen(selectedValues)
      } catch (err) {
        console.error('onOpen callback failed:', err)
      }
    }
  }

  const getLabel = () => {
    if (selectedValues.length === 0) return ''
    return options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label)
      .join(', ')
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={`
    ${styles.inputContainer}
    ${optionalStyle ? styles.optionalStyle : ''}
  `}
      >
        <input
          type='text'
          readOnly
          value={getLabel()}
          onClick={toggleExpanded}
          placeholder={placeholder}
          className={`${styles.searchInput} ${
            hasError ? styles.searchInputError : ''
          }`}
        />
        <div className={styles.iconWrapper} onClick={toggleExpanded}>
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </div>
      </div>

      {isExpanded && (
        <>
          <ul className={styles.list}>
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.listItem} ${
                  selectedValues.includes(option.value) ? styles.selected : ''
                }`}
                onClick={() => toggleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>

          <button
            className={`mainBtn ${styles.submitButton} ${styles.centerText}`}
            onClick={() => {
              setIsExpanded(false)
              onSubmit(selectedValues)
            }}
          >
            Submit
          </button>
        </>
      )}

      {hasError && errorMessage && (
        <div className={styles.errorBlock}>
          <ErrorIcon />
          <span className={styles.errorText}>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}

export default MultiDropDownInput
