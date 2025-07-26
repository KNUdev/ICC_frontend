'use client'

import { useState, useRef } from 'react'
import Search from '@/assets/image/icons/form/search.svg'
import Close from '@/assets/image/icons/form/close.svg'
import Filter from '@/assets/image/icons/form/filter.svg'
import { useTranslations } from 'next-intl'
import styles from './ApplicationsPage.module.scss'

export function ApplicationsPage() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const tApplications = useTranslations('admin/applications')

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  return (
    <section>
      <div className={styles.headingContainer}>
        <h1 className={styles.heading}>
          {tApplications('header.application')}
        </h1>

        <div className={styles.searchFilterContainer}>
          <div className='searchContainer'>
            <Search />

            <input
              type='search'
              placeholder={tApplications('header.search')}
              className='searchInput'
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {searchValue && (
              <button type='button' className='clearBtn' onClick={handleClear}>
                <Close />
              </button>
            )}
          </div>

          <button className='mainBtn'>
            <Filter />

            {tApplications('header.filter')}
          </button>
        </div>
      </div>
    </section>
  )
}
