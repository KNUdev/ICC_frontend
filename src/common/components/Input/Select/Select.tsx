import { useState } from 'react'
import styles from './Select.module.scss'

interface SelectProps {
  title: string
  placeholder: string
  options: string[]
  isRequired?: boolean
  value?: string
  onChange?: (value: string) => void
}

const Select = ({
  title,
  placeholder,
  options,
  isRequired = false,
  value,
  onChange,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || '')

  const handleSelect = (option: string) => {
    setSelectedValue(option)
    onChange?.(option)
    setIsOpen(false)
  }

  return (
    <div className={styles.selectContainer}>
      <label>
        {title}
        {isRequired && <span>*</span>}
      </label>
      <div className={styles.selectWrapper}>
        <div className={styles.selectInput} onClick={() => setIsOpen(!isOpen)}>
          <span
            className={
              selectedValue ? styles.selectedValue : styles.placeholder
            }
          >
            {selectedValue || placeholder}
          </span>
          <svg
            className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M7 10L12 15L17 10'
              stroke='#6d6d6d'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        {isOpen && (
          <div className={styles.dropdown}>
            {options.map((option) => (
              <div
                key={option}
                className={styles.option}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select
