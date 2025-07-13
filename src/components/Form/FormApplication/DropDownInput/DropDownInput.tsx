import styles from './DropDownInput.module.scss'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import ArrowUp from '@/assets/image/icons/arrow-up.svg'
import { useState, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface SearchableDropdownProps {
  options: Option[]
  onSelect: (value: string) => void
  onValidate?: (isValid: boolean) => void
  placeholder?: string
}

const DropDownInput: React.FC<SearchableDropdownProps> = ({
  options,
  onSelect,
  placeholder,
  onValidate,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
    setInputValue(e.target.value)
    setIsDropdownOpen(true)
  }

  const handleOptionClick = (option: Option) => {
    setInputValue(option.label)
    onSelect(option.value)
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
          placeholder={placeholder}
          className={styles.searchInput}
        />

        <div className={styles.iconWrapper} onMouseDown={toggleDropdown}>
          {isDropdownOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
      </div>

      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className={styles.list}>
          {filteredOptions.slice(0, 20).map((option) => {
            const regex = new RegExp(`(${inputValue})`, 'ig')
            const parts = option.label.split(regex)

            return (
              <li
                className={styles.listItem}
                key={option.value}
                onMouseDown={() => handleOptionClick(option)}
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
    </div>
  )
}

export default DropDownInput
