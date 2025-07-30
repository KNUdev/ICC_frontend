'use client'

import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import ArrowUp from '@/assets/image/icons/arrow-up.svg'
import ErrorIcon from '@/assets/image/icons/bigger-error.svg'
import { useEffect, useState } from 'react'
import styles from './DropDownInput.module.scss'

interface Option {
  value: string
  label: string
}

interface SearchableDropdownProps {
  options: Option[]
  onOpen: (value: string) => void
  onSelect: (value: string | null) => void
  onValidate?: (isValid: boolean) => void
  placeholder?: string
  hasError?: boolean
  value?: string | null
  errorMessage?: string | null
}

const DropDownInput: React.FC<SearchableDropdownProps> = ({
  options,
  onOpen,
  onSelect,
  placeholder,
  onValidate,
  hasError,
  value,
  errorMessage,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!isExpanded) {
      if (value === null || value === '') {
        setInputValue('')
      } else {
        const selected = options.find((o) => o.value === value)
        if (selected) setInputValue(selected.label)
      }
    }
  }, [value, options, isExpanded])

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    )
  }, [inputValue, options])

  useEffect(() => {
    const isValid = options.some(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase(),
    )
    onValidate?.(isValid)
  }, [inputValue, options, onValidate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    setIsExpanded(true)

    const match = options.find(
      (opt) => opt.label.toLowerCase() === val.toLowerCase(),
    )

    onSelect(match?.value ?? null)
  }

  const handleOptionClick = (option: Option) => {
    setInputValue(option.label)
    onSelect(option.value)
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    if (!isExpanded) {
      onOpen(inputValue)
    }
    setIsExpanded((prev) => !prev)
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsExpanded(false)
    }, 150)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!isExpanded) {
              onOpen(inputValue)
              setIsExpanded(true)
            }
          }}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`${styles.searchInput} ${
            hasError ? styles.searchInputError : ''
          }`}
        />

        <div
          className={styles.iconWrapper}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleExpanded()
          }}
        >
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </div>
      </div>

      {isExpanded && filteredOptions.length > 0 && (
        <ul className={styles.list}>
          {filteredOptions.slice(0, 20).map((option) => {
            const regex = new RegExp(`(${inputValue})`, 'ig')
            const parts = option.label.split(regex)

            return (
              <li
                className={styles.listItem}
                key={option.value}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleOptionClick(option)
                }}
              >
                {parts.map((part, index) =>
                  part.toLowerCase() === inputValue.toLowerCase() ? (
                    <span key={index} className={styles.highlight}>
                      {part}
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  ),
                )}
              </li>
            )
          })}
        </ul>
      )}

      {hasError && errorMessage && isExpanded && (
        <div className={styles.errorBlock}>
          <ErrorIcon />
          <span className={styles.errorText}>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}

export default DropDownInput
