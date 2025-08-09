'use client'

import { useState, useRef } from 'react'
import AlignArrowUpIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import styles from './Staff.module.scss'

export function Staff() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [specialty, setSpecialty] = useState<string | null>(null)

  const specialties = [
    { value: 'engineer', label: 'Інженер' },
    { value: 'teacher', label: 'Викладач' },
    { value: 'doctor', label: 'Лікар' },
    { value: 'designer', label: 'Дизайнер' },
    { value: 'manager', label: 'Менеджер' },
  ]

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

              <DropDownInput
                options={specialties}
                placeholder='Інженер'
                value={specialty}
                onOpen={() => {
                  //TODO: fetch here when it will work
                }}
                onSelect={(val) => setSpecialty(val)}
                onValidate={(isValid) => {
                  console.log('Specialty valid?', isValid)
                }}
              />
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
