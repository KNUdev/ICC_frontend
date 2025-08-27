import React from 'react'
import styles from './SearchInput.module.scss'

interface SearchInputProps {
  placeholder: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
}

const SearchInput = ({ placeholder, value, onChange, onClear }: SearchInputProps) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" className={styles.searchIcon}>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M10.9375 2.08331C9.52564 2.08343 8.13425 2.42119 6.87945 3.06841C5.62465 3.71563 4.54283 4.65354 3.72422 5.80389C2.90562 6.95424 2.37399 8.28367 2.17367 9.68127C1.97336 11.0789 2.11018 12.5041 2.57271 13.8381C3.03524 15.1721 3.81007 16.3761 4.83256 17.3497C5.85505 18.3233 7.09555 19.0383 8.45056 19.435C9.80556 19.8317 11.2358 19.8986 12.6219 19.6301C14.008 19.3616 15.3099 18.7656 16.4188 17.8916L20.2229 21.6958C20.4194 21.8856 20.6825 21.9906 20.9556 21.9882C21.2288 21.9858 21.49 21.8763 21.6832 21.6831C21.8763 21.49 21.9858 21.2287 21.9882 20.9556C21.9906 20.6825 21.8856 20.4194 21.6959 20.2229L17.8917 16.4187C18.9209 15.1131 19.5616 13.5441 19.7407 11.8914C19.9199 10.2386 19.63 8.56875 18.9044 7.07299C18.1788 5.57724 17.0468 4.31598 15.6378 3.43355C14.2289 2.55113 12.6 2.0832 10.9375 2.08331ZM4.16669 10.9375C4.16669 9.14174 4.88004 7.41955 6.14982 6.14978C7.4196 4.88 9.14178 4.16665 10.9375 4.16665C12.7333 4.16665 14.4554 4.88 15.7252 6.14978C16.995 7.41955 17.7084 9.14174 17.7084 10.9375C17.7084 12.7332 16.995 14.4554 15.7252 15.7252C14.4554 16.995 12.7333 17.7083 10.9375 17.7083C9.14178 17.7083 7.4196 16.995 6.14982 15.7252C4.88004 14.4554 4.16669 12.7332 4.16669 10.9375Z" 
            fill="#272727"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.searchInput}
        />
        {value && value.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className={styles.clearButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path d="M5.83332 15.8333L4.66666 14.6667L9.33332 10L4.66666 5.33333L5.83332 4.16667L10.5 8.83333L15.1667 4.16667L16.3333 5.33333L11.6667 10L16.3333 14.6667L15.1667 15.8333L10.5 11.1667L5.83332 15.8333Z" fill="#272727"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchInput
