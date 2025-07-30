'use client'

import CloseButton from '@/common/components/Input/CloseButton/CloseButton'
import InputText from '@/common/components/Input/InputText/InputText.module'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import SearchInput from '@/common/components/Input/SearchInput/SearchInput'
import Select from '@/common/components/Input/Select/Select'
import DeleteConfirmModal from '@/common/components/Modal/DeleteConfirmModal/DeleteConfirmModal'
import Modal from '@/common/components/Modal/Modal'
import ModalActions from '@/common/components/Modal/ModalActions/ModalActions'
import ModalButton from '@/common/components/Modal/ModalButton/ModalButton'
import SuccessMessage from '@/common/components/SuccessMessage/SuccessMessage'
import { API } from '@/shared/config/api.config'
import { useEffect, useRef, useState } from 'react'
import styles from './page.module.scss'

interface Sector {
  id: string
  name: {
    en: string
    uk: string
  }
  specialties: string[]
}

interface CreateSectorRequest {
  name: {
    en: string
    uk: string
  }
  specialties: string[]
}

interface GetSectorsRequest {
  pageNumber: number
  pageSize: number
}

const createSector = async (data: CreateSectorRequest) => {
  const response = await fetch(`${API}admin/sector/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create sector')
  }

  return response.json()
}

const getAllSectors = async (params: GetSectorsRequest) => {
  const response = await fetch(`${API}admin/sector/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch sectors')
  }

  return response.json()
}

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
  const [sectorNameUk, setSectorNameUk] = useState('')
  const [sectorNameEn, setSectorNameEn] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [addedSpecialities, setAddedSpecialities] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSectorIndex, setSelectedSectorIndex] = useState<number | null>(
    null,
  )
  const [editingSectorNameUk, setEditingSectorNameUk] = useState('')
  const [editingSectorNameEn, setEditingSectorNameEn] = useState('')
  const [editingSpecialities, setEditingSpecialities] = useState<string[]>([])
  const [editingSpeciality, setEditingSpeciality] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)

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
      sector.name.uk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.specialties.some((spec: string) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllSectors({ pageNumber: 0, pageSize: 100 })
        setSectors(data.content || data || [])
      } catch (err) {
        setError('Помилка при завантаженні секторів')
        console.error('Error fetching sectors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSectors()
  }, [])

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

  const handleSubmit = async () => {
    if (sectorNameUk && sectorNameEn) {
      try {
        setLoading(true)
        setError(null)

        const createData: CreateSectorRequest = {
          name: {
            uk: sectorNameUk,
            en: sectorNameEn,
          },
          specialties: addedSpecialities,
        }

        await createSector(createData)

        const data = await getAllSectors({ pageNumber: 0, pageSize: 100 })
        setSectors(data.content || data || [])

        setSectorNameUk('')
        setSectorNameEn('')
        setSpeciality('')
        setAddedSpecialities([])

        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError('Помилка при створенні сектору')
        console.error('Error creating sector:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteSector = (sectorIndex: number) => {
    setSelectedSectorIndex(sectorIndex)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedSectorIndex !== null) {
      setSectors((prevSectors) =>
        prevSectors.filter((_, index) => index !== selectedSectorIndex),
      )
    }
    setShowDeleteModal(false)
    setSelectedSectorIndex(null)
  }

  const handleEditSector = (sectorIndex: number) => {
    const sector = sectors[sectorIndex]
    setSelectedSectorIndex(sectorIndex)
    setEditingSectorNameUk(sector.name.uk)
    setEditingSectorNameEn(sector.name.en)
    setEditingSpecialities([...sector.specialties])
    setEditingSpeciality('')
    setShowEditModal(true)
  }

  const handleEditSpecialityChange = (selectedSpeciality: string) => {
    setEditingSpeciality(selectedSpeciality)
    if (
      selectedSpeciality &&
      !editingSpecialities.includes(selectedSpeciality)
    ) {
      setEditingSpecialities([...editingSpecialities, selectedSpeciality])
    }
  }

  const removeEditingSpeciality = (specialityToRemove: string) => {
    setEditingSpecialities(
      editingSpecialities.filter((spec) => spec !== specialityToRemove),
    )
  }

  const confirmEdit = async () => {
    if (
      selectedSectorIndex !== null &&
      editingSectorNameUk &&
      editingSectorNameEn
    ) {
      try {
        setLoading(true)
        setError(null)

        const data = await getAllSectors({ pageNumber: 0, pageSize: 100 })
        setSectors(data.content || data || [])

        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError('Помилка при редагуванні сектору')
        console.error('Error updating sector:', err)
      } finally {
        setLoading(false)
      }
    }
    setShowEditModal(false)
    setSelectedSectorIndex(null)
    setEditingSectorNameUk('')
    setEditingSectorNameEn('')
    setEditingSpecialities([])
    setEditingSpeciality('')
  }

  const closeModal = () => {
    setShowDeleteModal(false)
    setShowEditModal(false)
    setSelectedSectorIndex(null)
    setEditingSectorNameUk('')
    setEditingSectorNameEn('')
    setEditingSpecialities([])
    setEditingSpeciality('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>ВСІ СЕКТОРИ</h1>
        <p className={styles.subtitle}>
          На цій сторінці ви можете додати новий сектор до системи, вказавши
          його основні дані, спеціальності та за потребою — редагувати існуючі.
          Усі обов&aposязкові поля позначені, а введені дані можна редагувати
          пізніше.
        </p>
      </div>

      <div className={styles.headerToFormGap}></div>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title='Назва сектора uk'
                placeholder='Оператор машинного відділу'
                isRequired={true}
                value={sectorNameUk}
                onChange={(e) => setSectorNameUk(e.target.value)}
              />

              <InputText
                title='Назва сектора en'
                placeholder='Machine Operator Department'
                isRequired={true}
                value={sectorNameEn}
                onChange={(e) => setSectorNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title='Спеціальності, які входять в сектор'
                placeholder='Оператор машинного відділу'
                options={specialityOptions}
                isRequired={false}
                value={speciality}
                onChange={handleSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>Додані спеціальності:</p>
            {addedSpecialities.length > 0 ? (
              <div className={styles.specialityTags}>
                {addedSpecialities.map((addedSpeciality) => (
                  <div key={addedSpeciality} className={styles.specialityTag}>
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

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || !sectorNameUk || !sectorNameEn}
          >
            {loading ? 'Додається...' : 'Додати сектор'}
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

        <SuccessMessage
          message='Сектор успішно створено!'
          isVisible={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

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
                    <div className={styles.tableCell}>{sector.name.uk}</div>
                    <div className={styles.tableCell}>
                      {sector.specialties.join(', ')}
                    </div>
                    <div className={styles.tableActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditSector(index)}
                      >
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

      <div className={styles.scrollUpContainer}>
        <ScrollUp />
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title='Ви впевнені, що хочете видалити сектор?'
        confirmText='Так, видалити спеціальність'
        specialities={
          selectedSectorIndex !== null
            ? sectors[selectedSectorIndex]?.specialties || []
            : []
        }
      />

      <Modal
        isOpen={showEditModal}
        onClose={closeModal}
        title='Редагувати сектор'
      >
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title='Назва сектора uk'
                placeholder='Оператор машинного відділу'
                isRequired={true}
                value={editingSectorNameUk}
                onChange={(e) => setEditingSectorNameUk(e.target.value)}
              />

              <InputText
                title='Назва сектора en'
                placeholder='Machine Operator Department'
                isRequired={true}
                value={editingSectorNameEn}
                onChange={(e) => setEditingSectorNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title='Спеціальності, які входять в сектор'
                placeholder='Оператор машинного відділу'
                options={specialityOptions}
                isRequired={false}
                value={editingSpeciality}
                onChange={handleEditSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>Додані спеціальності:</p>
            {editingSpecialities.length > 0 ? (
              <div className={styles.specialityTags}>
                {editingSpecialities.map((addedSpeciality) => (
                  <div key={addedSpeciality} className={styles.specialityTag}>
                    <span>{addedSpeciality}</span>
                    <div className={styles.divider}></div>
                    <CloseButton
                      onClick={() => removeEditingSpeciality(addedSpeciality)}
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
        </div>

        <ModalActions>
          <ModalButton
            variant='primary'
            onClick={confirmEdit}
            disabled={loading || !editingSectorNameUk || !editingSectorNameEn}
          >
            {loading ? 'Зберігається...' : 'Зберегти зміни'}
          </ModalButton>
        </ModalActions>
      </Modal>
    </div>
  )
}

export default AllSectorsPage
