'use client'

import AlignArrowUpIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import AtLineIcon from '@/assets/image/icons/social/at_line.svg'
import PhoneIcon from '@/assets/image/icons/social/telephone.svg'
import ContactLink from '@/common/components/ContactLink/ContactLink'
import HelpBubble from '@/common/components/HelpBubble/HelpBubble'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import { getEmployees } from '@/shared/api/employees'
import { getPublicSectors } from '@/shared/api/sectors'
import { getPublicSpecialties } from '@/shared/api/specialties'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './page.module.scss'

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

export default function Staff() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [sectors, setSectors] = useState<SectorOption[]>([])

  const [specialty, setSpecialty] = useState<string | null>(null)
  const [specialties, setSpecialties] = useState<SpecialtyOption[]>([])

  const [employees, setEmployees] = useState<Employee[]>([])

  const [pageSize, setPageSize] = useState<number | 'all'>(10)

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  )

  const locale = useLocale()
  const tStaff = useTranslations('public/staff')

  const fetchEmployees = useCallback(async () => {
    try {
      const employees = await getEmployees({ pageSize })
      setEmployees(employees)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }, [pageSize])

  const fetchSectors = useCallback(async () => {
    try {
      const result = await getPublicSectors({
        pageNumber: 0,
        pageSize: 10,
      })

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
      const result = await getPublicSpecialties({
        pageNumber: 0,
        pageSize: 10,
      })

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

  const getSectorName = (sectorId: string) => {
    const sec = sectors.find((s) => s.value === sectorId)
    return sec ? sec.label : ''
  }

  const getSpecialtyName = (specialtyId: string) => {
    const spec = specialties.find((s) => s.value === specialtyId)
    return spec ? spec.label : ''
  }

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  const filteredEmployees = selectedEmployee
    ? employees.filter(
        (e) =>
          e.specialty.id === selectedEmployee.specialty.id &&
          e.id !== selectedEmployee.id,
      )
    : employees.filter((employee) => {
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

  return (
    <div className='layout-wrapper' role='main'>
      {!selectedEmployee ? (
        <>
          <section
            className={styles.staffSection}
            role='region'
            aria-labelledby='filters-heading'
          >
            <article className={styles.filtersArticle}>
              <div className={styles.filterHeadingContainer}>
                <h1 id='filters-heading' className={styles.filterHeading}>
                  {tStaff('headings.filter')}
                </h1>

                <HelpBubble
                  helpText={tStaff('help')}
                  position='left'
                  ariaLabel={tStaff('aria-labels.help')}
                />
              </div>

              <div className={styles.searchFilterContainer} role='search'>
                <div className={styles.searchTextContainer}>
                  <label className={styles.label} htmlFor='employee-search'>
                    {tStaff('labels.search')}
                  </label>

                  <div className='searchContainer'>
                    <SearchIcon aria-hidden='true' />

                    <input
                      id='employee-search'
                      className='searchInput'
                      ref={inputRef}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={tStaff('placeholders.search')}
                    />

                    {searchValue && (
                      <button
                        type='button'
                        className='clearBtn'
                        onClick={handleClear}
                        aria-label={tStaff('aria-labels.search')}
                      >
                        <CloseIcon aria-hidden='true' />
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.specialtyFilterContainer}>
                  <label className={`${styles.label} ${styles.labelDropDown}`}>
                    <span>{tStaff('labels.specialty')}</span>

                    <DropDownInput
                      options={specialties}
                      placeholder={tStaff('placeholders.specialty')}
                      value={specialty}
                      onOpen={fetchSpecialties}
                      onSelect={(val) => setSpecialty(val)}
                      aria-label={tStaff('aria-labels.specialty')}
                    />
                  </label>
                </div>
              </div>
            </article>

            <article
              className={styles.workersArticle}
              role='region'
              aria-labelledby='pagination-heading'
            >
              <h2 id='pagination-heading' className={styles.workersHeading}>
                {tStaff('headings.pagination')}
              </h2>

              <div
                className={styles.buttonsContainer}
                role='group'
                aria-label={tStaff('aria-labels.pagination')}
              >
                <button
                  type='button'
                  className={`chooseBtn ${
                    pageSize === 10 ? styles.active : ''
                  }`}
                  onClick={() => setPageSize(10)}
                  aria-pressed={pageSize === 10}
                >
                  10
                </button>

                <button
                  type='button'
                  className={`chooseBtn ${
                    pageSize === 20 ? styles.active : ''
                  }`}
                  onClick={() => setPageSize(20)}
                  aria-pressed={pageSize === 20}
                >
                  20
                </button>

                <button
                  type='button'
                  className={`chooseBtn ${
                    pageSize === 'all' ? styles.active : ''
                  }`}
                  onClick={() => setPageSize('all')}
                  aria-pressed={pageSize === 'all'}
                >
                  {tStaff('buttons.all')}
                </button>
              </div>
            </article>

            <ul
              className={styles.employeeList}
              role='list'
              aria-label={tStaff('aria-labels.list')}
            >
              {filteredEmployees.map((employee) => (
                <li key={employee.id} role='listitem'>
                  <button
                    type='button'
                    className={styles.employeeListItem}
                    onClick={() => setSelectedEmployee(employee)}
                    aria-label={`${tStaff('aria-labels.details')} ${
                      employee.name.firstName
                    } ${employee.name.middleName} ${employee.name.lastName}`}
                  >
                    <Image
                      src={employee.avatarUrl}
                      alt={`${employee.name.firstName} ${employee.name.middleName} ${employee.name.lastName}`}
                      width={150}
                      height={150}
                      unoptimized
                      className={styles.employeePhoto}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.toTopContainer}>
              <button
                type='button'
                className={styles.toTopParagraph}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label={tStaff('aria-labels.top')}
              >
                <AlignArrowUpIcon aria-hidden='true' />
                {tStaff('buttons.top')}
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <section
            className={styles.detailSection}
            role='region'
            aria-labelledby='employee-detail-heading'
          >
            <div className={styles.detailHeader}>
              <div className={styles.detailPhotoBlock}>
                <Image
                  src={selectedEmployee.avatarUrl}
                  alt={`${selectedEmployee.name.firstName} ${selectedEmployee.name.middleName} ${selectedEmployee.name.lastName}`}
                  width={300}
                  height={300}
                  unoptimized
                />

                <div className={styles.contacts}>
                  <h3 className={styles.contactsHeader}>
                    {tStaff('headings.contacts')}
                  </h3>

                  <address className={styles.contactsDetails}>
                    <div className={styles.contactsEmail}>
                      <ContactLink
                        href={`mailto:${selectedEmployee.email}`}
                        icon={AtLineIcon}
                      >
                        {selectedEmployee.email}
                      </ContactLink>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.contactsNumber}>
                      <ContactLink
                        href={`tel:${selectedEmployee.phoneNumber}`}
                        icon={PhoneIcon}
                      >
                        {selectedEmployee.phoneNumber}
                      </ContactLink>
                    </div>
                  </address>
                </div>
              </div>

              <div className={styles.detailInfoBlock}>
                <div className={styles.infoMain}>
                  <p className={styles.specialty}>
                    {getSpecialtyName(selectedEmployee.specialty.id)}
                  </p>

                  <h2 className={styles.infoHeading}>
                    {`${selectedEmployee.name.firstName} ${selectedEmployee.name.middleName} ${selectedEmployee.name.lastName}`}
                  </h2>
                </div>

                <div className={styles.horizontalDivider} />

                <div className={styles.infoOther}>
                  <p>
                    {tStaff('paras.sector')}:{' '}
                    <span className={styles.spanSector}>
                      {getSectorName(selectedEmployee.sector.id)}
                    </span>
                  </p>

                  <p
                    className={
                      selectedEmployee.isStudent
                        ? styles.otherStudent
                        : styles.otherNotStudent
                    }
                  >
                    {selectedEmployee.isStudent
                      ? `${tStaff('paras.student')}`
                      : `${tStaff('paras.notStudent')}`}
                  </p>

                  <p>
                    {tStaff('paras.workHours')}:{' '}
                    <span className={styles.spanWorkingHours}>
                      {selectedEmployee.workHours.startTime} -{' '}
                      {selectedEmployee.workHours.endTime}
                    </span>
                  </p>
                </div>

                <button
                  type='button'
                  className={`mainBtn ${styles.centeredText}`}
                  onClick={() => setSelectedEmployee(null)}
                  aria-label={tStaff('aria-labels.back')}
                >
                  {tStaff('buttons.back')}
                </button>
              </div>
            </div>

            <article className={styles.workersArticle}>
              <h2 className={styles.workersHeading}>
                {tStaff('headings.workers')}
              </h2>
            </article>

            <ul
              className={styles.employeeList}
              role='list'
              aria-label={tStaff('aria-labels.listSame')}
            >
              {filteredEmployees.map((employee) => (
                <li key={employee.id} role='listitem'>
                  <button
                    type='button'
                    className={styles.employeeListItem}
                    onClick={() => setSelectedEmployee(employee)}
                    aria-label={`${tStaff('aria-labels.details')} ${
                      employee.name.firstName
                    } ${employee.name.middleName} ${employee.name.lastName}`}
                  >
                    <Image
                      src={employee.avatarUrl}
                      alt={`${employee.name.firstName} ${employee.name.middleName} ${employee.name.lastName}`}
                      width={150}
                      height={150}
                      unoptimized
                      className={styles.employeePhoto}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.toTopContainer}>
              <button
                type='button'
                className={styles.toTopParagraph}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label={tStaff('aria-labels.top')}
              >
                <AlignArrowUpIcon aria-hidden='true' />
                {tStaff('buttons.top')}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
