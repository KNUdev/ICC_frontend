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

interface SectorOption {
  value: string
  label: string
}

interface SectorItem {
  id: string
  name: {
    [key: string]: string | undefined
    en?: string
    uk?: string
  }
}

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

  const [sectors, setSectors] = useState<SectorOption[]>([])

  const [specialty, setSpecialty] = useState<string | null>(null)
  const [specialties, setSpecialties] = useState<SpecialtyOption[]>([])

  const [employees, setEmployees] = useState<Employee[]>([])

  const [pageSize, setPageSize] = useState<number | 'all'>(10)

  const locale = useLocale()

  const fetchEmployees = useCallback(async () => {
    try {
      const formData = new FormData()
      formData.append(
        'pageSize',
        pageSize === 'all' ? String(999) : String(pageSize),
      )

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
  }, [pageSize])

  const fetchSectors = useCallback(async () => {
    try {
      const response = await fetch(`${api}sector/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageNumber: 0,
          pageSize: 10,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      const mapped: SectorOption[] =
        (result?.content as SectorItem[])?.map((item) => ({
          value: item.id,
          label: item.name?.[locale] || item.name?.en || '',
        })) ?? []

      setSectors(mapped)
    } catch (error) {
      console.error('Error fetching sectors:', error)
    }
  }, [locale])

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
  }, [fetchEmployees])

  useEffect(() => {
    fetchSpecialties()
    fetchSectors()
  }, [fetchSpecialties, fetchSectors])

  const getSpecialtyName = (specialtyId: string) => {
    const spec = specialties.find((s) => s.value === specialtyId)
    return spec ? spec.label : ''
  }

  const getSectorName = (sectorId: string) => {
    const sec = sectors.find((s) => s.value === sectorId)
    return sec ? sec.label : ''
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
            <button
              type='button'
              className={`chooseBtn ${pageSize === 10 ? styles.active : ''}`}
              onClick={() => setPageSize(10)}
            >
              10
            </button>

            <button
              type='button'
              className={`chooseBtn ${pageSize === 20 ? styles.active : ''}`}
              onClick={() => setPageSize(20)}
            >
              20
            </button>

            <button
              type='button'
              className={`chooseBtn ${pageSize === 'all' ? styles.active : ''}`}
              onClick={() => setPageSize('all')}
            >
              УСІ
            </button>
          </div>
        </article>

        <ul className={styles.employeeList}>
          {employees
            .filter((employee) => {
              const matchesSpecialty =
                !specialty || employee.specialty.id === specialty

              const fullName =
                `${employee.name.firstName} ${employee.name.middleName} ${employee.name.lastName}`.toLowerCase()
              const email = employee.email.toLowerCase()
              const matchesSearch =
                !searchValue ||
                fullName.includes(searchValue.toLowerCase()) ||
                email.includes(searchValue.toLowerCase())

              return matchesSpecialty && matchesSearch
            })
            .map((employee) => (
              <li
                key={employee.id}
                className={styles.employeeListItem}
                data-name={`${employee.name.firstName} ${employee.name.middleName} ${employee.name.lastName}`}
                data-email={employee.email}
                data-specialty={getSpecialtyName(employee.specialty.id)}
                data-phonenumber={employee.phoneNumber}
                data-isstudent={employee.isStudent}
                data-sector={getSectorName(employee.sector.id)}
              >
                <Image
                  src={employee.avatarUrl}
                  alt={`${employee.name.firstName} ${employee.name.middleName} ${employee.name.lastName}`}
                  width={150}
                  height={150}
                  unoptimized
                  className={styles.employeePhoto}
                />
              </li>
            ))}
        </ul>

        <Hyperlink href='/staff' icon={AlignArrowUpIcon}>
          Прогорнути вгору
        </Hyperlink>
      </section>
    </div>
  )
}
