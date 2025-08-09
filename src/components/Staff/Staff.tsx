'use client'

import AlignArrowUpIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import styles from './Staff.module.scss'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { useState, useRef } from 'react'

export function Staff() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  return (
    <div className='layout-wrapper'>
      <section className={styles.staffSection}>
        <article className={styles.filtersArticle}>
          <h1 className={styles.filterHeading}>ФІЛЬТРИ</h1>

          <div className={styles.searchFilterContainer}>
            <div className={styles.searchTextContainer}>
              <label className={styles.label}>Пошук по ПІБ/Пошті</label>

              <div className='searchContainer'>
                <SearchIcon />

                <input
                  className='searchInput'
                  ref={inputRef}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder='Попов Богдан Віталійович'
                />

                {searchValue && (
                  <button
                    type='button'
                    className='clearBtn'
                    onClick={handleClear}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.specialtyFilterContainer}>
              <label className={styles.label}>Професія</label>

              <input placeholder='Інженер' />
              {/* //TODO: where input place DropDownInput with fetched specialties */}
            </div>
          </div>
        </article>

        <article>
          {/* //TODO: workers filter with quantity of workers on page at the moment */}
        </article>

        <ul>
          {/* //TODO: fetch employees and place them in grid layout 3 in row li */}
        </ul>

        <Hyperlink href='/staff' icon={AlignArrowUpIcon}>
          Прогорнути вгору
        </Hyperlink>
      </section>
    </div>
  )
}
