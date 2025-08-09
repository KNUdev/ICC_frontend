'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import AlignArrowUpIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import styles from './Staff.module.scss'

const api = process.env.NEXT_PUBLIC_API_URL

interface SpecialtyOption {
  value: string
  label: string
}

interface Specialty {
  id: string
  name: {
    [key: string]: string | undefined
    en?: string
    uk?: string
  }
}

interface Employee {
  avatarUrl: string
  contractEndDate: [number, number, number]
  createdAt: [number, number, number, number, number, number, number]
  email: string
  id: string
  isStudent: boolean
  name: {
    firstName: string
    middleName: string
    lastName: string
  }
  phoneNumber: string
  sector: {
    id: string
  }
  specialty: {
    id: string
  }
  workHours: {
    startTime: string
    endTime: string
  }
}

export function Staff() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [specialty, setSpecialty] = useState<string | null>(null)
  const [specialties, setSpecialties] = useState<SpecialtyOption[]>([])

  const [employees, setEmployees] = useState<Employee[]>([])

  const locale = useLocale()

  const fetchEmployees = useCallback(async () => {
    try {
      const formData = new FormData()
      formData.append('pageSize', '10')

      const response = await fetch(`${api}admin/employee/all`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)

      setEmployees(result.content)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }, [])

  const fetchSpecialties = useCallback(async () => {
    try {
      const response = await fetch(`${api}specialty/getAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageNumber: 0,
          pageSize: 10,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)

      const mapped: SpecialtyOption[] =
        result?.content?.map((item: Specialty) => ({
          value: item.id,
          label: item.name?.[locale] || item.name?.en || '',
        })) ?? []

      setSpecialties(mapped)
    } catch (error) {
      console.error('Error fetching specialties:', error)
    }
  }, [locale])

  useEffect(() => {
    fetchEmployees()
    fetchSpecialties()
  }, [fetchEmployees, fetchSpecialties])

  const getSpecialtyName = (specialtyId: string) => {
    const spec = specialties.find((s) => s.value === specialtyId)
    return spec ? spec.label : ''
  }

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
                onOpen={fetchSpecialties}
                onSelect={(val) => setSpecialty(val)}
              />
            </div>
          </div>
        </article>

        <article className={styles.workersArticle}>
          <h1 className={styles.workersHeading}>Робітників на сторінку</h1>

          <div className={styles.buttonsContainer}>
            <button type='button' className='chooseBtn'>
              10
            </button>

            <button type='button' className='chooseBtn'>
              20
            </button>

            <button type='button' className='chooseBtn'>
              УСІ
            </button>
          </div>
        </article>

        <ul className={styles.employeeList}>
          {employees.length === 0 ? (
            <p role='status'>No results</p>
          ) : (
            employees.map((employee) => (
              <li
                key={employee.id}
                className={styles.employeeListItem}
                data-name={`${employee.name.firstName} ${employee.name.middleName} ${employee.name.lastName}`}
                data-email={employee.email}
                data-specialty={getSpecialtyName(employee.specialty.id)}
              >
                <Image
                  src={employee.avatarUrl}
                  alt='avatar'
                  width={150}
                  height={150}
                  unoptimized
                  className={styles.employeePhoto}
                />
              </li>
            ))
          )}
        </ul>

        <Hyperlink href='/staff' icon={AlignArrowUpIcon}>
          Прогорнути вгору
        </Hyperlink>
      </section>
    </div>
  )
}
