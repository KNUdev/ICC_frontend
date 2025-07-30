'use client'

import CloseButton from '@/common/components/Input/CloseButton/CloseButton'
import InputText from '@/common/components/Input/InputText/InputText.module'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import SearchInput from '@/common/components/Input/SearchInput/SearchInput'
import Select from '@/common/components/Input/Select/Select'
import DeleteConfirmModal from '@/common/components/Modal/DeleteConfirmModal/DeleteConfirmModal'
import EditModal from '@/common/components/Modal/EditModal/EditModal'
import SuccessMessage from '@/common/components/SuccessMessage/SuccessMessage'
import { useEffect, useRef, useState } from 'react'
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

const AddSpecialityPage = () => {
  const [specialityName, setSpecialityName] = useState('')
  const [category, setCategory] = useState('')
  const [sector, setSector] = useState('')
  const [addedSectors, setAddedSectors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [createdSpecialities, setCreatedSpecialities] = useState<
    Array<{
      name: string
      category: string
      sectors: string[]
    }>
  >([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpeciality, setEditingSpeciality] = useState<{
    name: string
    category: string
    sectors: string[]
    index: number
  } | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    specialityIndex: number
    sectorIndex: number
  } | null>(null)

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)

  const filteredSpecialities = createdSpecialities
    .flatMap((speciality, specialityIndex) =>
      speciality.sectors.map((sector, sectorIndex) => ({
        ...speciality,
        sector: sector,
        originalIndex: specialityIndex,
        sectorIndex: sectorIndex,
      })),
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  useEffect(() => {
    const updateScrollState = () => {
      if (tableBodyContainerRef.current) {
        const container = tableBodyContainerRef.current
        const { scrollTop, scrollHeight, clientHeight } = container

        const scrollable = scrollHeight > clientHeight

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
  }, [filteredSpecialities])

  const sectorOptions = [
    'Сектор мережевих технологій',
    'Сектор веб-розробки',
    'Сектор мобільних технологій',
    'Сектор штучного інтелекту',
    'Сектор кібербезпеки',
  ]

  const handleSectorChange = (selectedSector: string) => {
    setSector(selectedSector)
    if (selectedSector && !addedSectors.includes(selectedSector)) {
      setAddedSectors([...addedSectors, selectedSector])
    }
  }

  const removeSector = (sectorToRemove: string) => {
    setAddedSectors(addedSectors.filter((sector) => sector !== sectorToRemove))
  }

  const handleSubmit = () => {
    if (specialityName && addedSectors.length > 0) {
      const newSpeciality = {
        name: specialityName,
        category: category,
        sectors: addedSectors,
      }

      setCreatedSpecialities([...createdSpecialities, newSpeciality])

      setSpecialityName('')
      setCategory('')
      setSector('')
      setAddedSectors([])
    }
  }

  const handleDeleteSector = (specialityIndex: number, sectorIndex: number) => {
    setDeleteTarget({ specialityIndex, sectorIndex })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      setCreatedSpecialities(
        (prevSpecialities) =>
          prevSpecialities
            .map((speciality, index) => {
              if (index === deleteTarget.specialityIndex) {
                const updatedSectors = speciality.sectors.filter(
                  (_, i) => i !== deleteTarget.sectorIndex,
                )
                if (updatedSectors.length === 0) {
                  return null
                }
                return { ...speciality, sectors: updatedSectors }
              }
              return speciality
            })
            .filter(Boolean) as Array<{
            name: string
            category: string
            sectors: string[]
          }>,
      )
    }
    setIsDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  const handleEditSpeciality = (specialityIndex: number) => {
    const speciality = createdSpecialities[specialityIndex]
    setEditingSpeciality({
      ...speciality,
      index: specialityIndex,
    })
    setIsModalOpen(true)
  }

  const handleSaveEditedSpeciality = (editedSpeciality: {
    name: string
    category: string
    sectors: string[]
  }) => {
    if (editingSpeciality !== null) {
      setCreatedSpecialities((prevSpecialities) =>
        prevSpecialities.map((speciality, index) =>
          index === editingSpeciality.index ? editedSpeciality : speciality,
        ),
      )

      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
    setIsModalOpen(false)
    setEditingSpeciality(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSpeciality(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>ДОДАТИ СПЕЦІАЛЬНІСТЬ</h1>
        <p className={styles.subtitle}>
          На цій сторінці ви можете додати нового працівника до системи,
          вказавши його основні дані, контактну інформацію, посаду та зв
          потребою — завантажити фотографію. Усі обов&aposязкові поля позначені,
          а введені дані можна редагувати пізніше.
        </p>
      </div>

      <div className={styles.headerToFormGap}></div>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title='Назва спеціальності'
                placeholder='Оператор машинного відділу'
                isRequired={true}
                value={specialityName}
                onChange={(e) => setSpecialityName(e.target.value)}
              />
            </div>
            <div className={styles.inputColumn}>
              <InputText
                title='Категорія (якщо потрібно вказувати)'
                placeholder='1 категорія'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title='Сектор'
                placeholder='Сектор мережевих технологій'
                options={sectorOptions}
                isRequired={true}
                value={sector}
                onChange={handleSectorChange}
              />
            </div>
          </div>

          <div className={styles.additionalSectors}>
            <p className={styles.additionalLabel}>Додані сектори:</p>
            {addedSectors.length > 0 ? (
              <div className={styles.sectorTags}>
                {addedSectors.map((addedSector) => (
                  <div key={addedSector} className={styles.sectorTag}>
                    <span>{addedSector}</span>
                    <div className={styles.divider}></div>
                    <CloseButton onClick={() => removeSector(addedSector)} />
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
            Додати спеціальність
          </button>
        </div>
      </div>

      <div className={styles.formToSpecialtiesGap}></div>

      <div className={styles.specialtiesSection}>
        <div className={styles.specialtiesHeader}>
          <h2 className={styles.specialtiesTitle}>
            СПИСОК СТВОРЕНИХ СПЕЦІАЛЬНОСТЕЙ
          </h2>

          <div className={styles.searchContainer}>
            <SearchInput
              placeholder='Знайдіть спеціальність, яку ви шукаєте...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
        </div>

        <SuccessMessage
          message='Спеціальність успішно відредаговано!'
          isVisible={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
        />

        <div className={styles.specialtiesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Спеціальність</div>
            <div className={styles.headerCell}>Категорія</div>
            <div className={styles.headerCell}>Сектор</div>
            <div className={styles.headerCell}></div>
          </div>

          {filteredSpecialities.length > 0 ? (
            <div
              className={styles.tableBodyContainer}
              ref={tableBodyContainerRef}
            >
              <div className={styles.tableBody}>
                {filteredSpecialities.map((item) => (
                  <div
                    key={`${item.originalIndex}-${item.sectorIndex}`}
                    className={styles.tableRow}
                  >
                    <div className={styles.tableCell}>{item.name}</div>
                    <div className={styles.tableCell}>
                      {item.category || '-'}
                    </div>
                    <div className={styles.tableCell}>{item.sector}</div>
                    <div className={styles.tableActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditSpeciality(item.originalIndex)}
                      >
                        <EditIcon />
                        Редагувати
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          handleDeleteSector(
                            item.originalIndex,
                            item.sectorIndex,
                          )
                        }
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

      <div className={styles.scrollUpContainer}>
        <ScrollUp />
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEditedSpeciality}
        speciality={editingSpeciality}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title='Видалити спеціальність'
        message='Ви впевнені, що хочете видалити цю спеціальність? Цю дію неможливо скасувати.'
      />
    </div>
  )
}

export default AddSpecialityPage
