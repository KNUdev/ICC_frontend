'use client'

import React, { useState, useRef, useEffect } from 'react'
import InputText from '@/common/components/Input/InputText/InputText.module'
import Select from '@/common/components/Input/Select/Select'
import CloseButton from '@/common/components/Input/CloseButton/CloseButton'
import SearchInput from '@/common/components/Input/SearchInput/SearchInput'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import styles from './page.module.scss'

const EditIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='19'
    height='19'
    viewBox='0 0 19 19'
    fill='none'
  >
    <path
      d='M0 19.0001V14.7501L14.625 0.175049L18.8 4.45005L4.25 19.0001H0ZM14.6 5.80005L16 4.40005L14.6 3.00005L13.2 4.40005L14.6 5.80005Z'
      fill='#FF525E'
    />
  </svg>
)

const DeleteIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
  >
    <path
      d='M9 17H11V8H9V17ZM13 17H15V8H13V17ZM5 21V6H4V4H9V3H15V4H20V6H19V21H5Z'
      fill='#FF525E'
    />
  </svg>
)

const AllSectorsPage = () => {
  const [sectorName, setSectorName] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [addedSpecialities, setAddedSpecialities] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sectors, setSectors] = useState<
    Array<{
      name: string
      specialities: string[]
    }>
  >([])

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  const specialityOptions = [
    'Оператор машинного відділу',
    'Frontend розробник',
    'Backend розробник',
    'iOS розробник',
    'Android розробник',
    'Data Scientist',
    'Спеціаліст з кібербезпеки',
  ]

  const filteredSectors = sectors.filter(
    (sector) =>
      sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.specialities.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  useEffect(() => {
    const updateScrollState = () => {
      if (tableBodyContainerRef.current) {
        const container = tableBodyContainerRef.current
        const { scrollTop, scrollHeight, clientHeight } = container

        const scrollable = scrollHeight > clientHeight
        setIsScrollable(scrollable)

        if (scrollable) {
          container.classList.add(styles.scrollable)

          const isScrolledToBottom =
            scrollTop + clientHeight >= scrollHeight - 10

          if (isScrolledToBottom) {
            container.classList.add(styles.scrolledToBottom)
          } else {
            container.classList.remove(styles.scrolledToBottom)
          }
        } else {
          container.classList.remove(styles.scrollable)
          container.classList.remove(styles.scrolledToBottom)
        }
      }
    }

    updateScrollState()

    const container = tableBodyContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollState)

      return () => {
        container.removeEventListener('scroll', updateScrollState)
      }
    }
  }, [filteredSectors])

  const handleSpecialityChange = (selectedSpeciality: string) => {
    setSpeciality(selectedSpeciality)
    if (selectedSpeciality && !addedSpecialities.includes(selectedSpeciality)) {
      setAddedSpecialities([...addedSpecialities, selectedSpeciality])
    }
  }

  const removeSpeciality = (specialityToRemove: string) => {
    setAddedSpecialities(
      addedSpecialities.filter((spec) => spec !== specialityToRemove),
    )
  }

  const handleSubmit = () => {
    if (sectorName && addedSpecialities.length > 0) {
      const newSector = {
        name: sectorName,
        specialities: addedSpecialities,
      }

      setSectors([...sectors, newSector])

      setSectorName('')
      setSpeciality('')
      setAddedSpecialities([])
    }
  }

  const handleDeleteSector = (sectorIndex: number) => {
    setSectors((prevSectors) =>
      prevSectors.filter((_, index) => index !== sectorIndex),
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>ВСІ СЕКТОРИ</h1>
        <p className={styles.subtitle}>
          На цій сторінці ви можете додати новий сектор до системи, вказавши
          його основні дані, спеціальності та за потребою — редагувати існуючі.
          Усі обов'язкові поля позначені, а введені дані можна редагувати
          пізніше.
        </p>
      </div>

      <div className={styles.headerToFormGap}></div>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title='Назва сектора'
                placeholder='Оператор машинного відділу'
                isRequired={true}
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title='Спеціальності, які входять в сектор'
                placeholder='Оператор машинного відділу'
                options={specialityOptions}
                isRequired={true}
                value={speciality}
                onChange={handleSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>Додані спеціальності:</p>
            {addedSpecialities.length > 0 ? (
              <div className={styles.specialityTags}>
                {addedSpecialities.map((addedSpeciality, index) => (
                  <div key={index} className={styles.specialityTag}>
                    <span>{addedSpeciality}</span>
                    <div className={styles.divider}></div>
                    <CloseButton
                      onClick={() => removeSpeciality(addedSpeciality)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.additionalText}>
                Поки що нічого не додано :(
              </p>
            )}
          </div>

          <button className={styles.submitButton} onClick={handleSubmit}>
            Додати сектор
          </button>
        </div>
      </div>

      <div className={styles.formToSectorsGap}></div>

      <div className={styles.sectorsSection}>
        <div className={styles.sectorsHeader}>
          <h2 className={styles.sectorsTitle}>СПИСОК СТВОРЕНИХ СЕКТОРІВ</h2>

          <div className={styles.searchContainer}>
            <SearchInput
              placeholder='Знайдіть сектор або спеціальність, яку ви шукаєте...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
        </div>

        <div className={styles.sectorsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Назва сектору</div>
            <div className={styles.headerCell}>Спеціальності</div>
            <div className={styles.headerCell}></div>
          </div>

          {filteredSectors.length > 0 ? (
            <div
              className={styles.tableBodyContainer}
              ref={tableBodyContainerRef}
            >
              <div className={styles.tableBody}>
                {filteredSectors.map((sector, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>{sector.name}</div>
                    <div className={styles.tableCell}>
                      {sector.specialities.join(', ')}
                    </div>
                    <div className={styles.tableActions}>
                      <button className={styles.editButton}>
                        <EditIcon />
                        Редагувати
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteSector(index)}
                      >
                        <DeleteIcon />
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>
                {searchTerm
                  ? 'Результатів не знайдено'
                  : 'Поки що нічого не додано :('}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.scrollUpContainer}>{<ScrollUp />}</div>
    </div>
  )
}

export default AllSectorsPage
