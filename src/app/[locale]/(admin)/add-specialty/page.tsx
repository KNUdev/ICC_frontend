'use client'

import CloseButton from '@/common/components/Input/CloseButton/CloseButton'
import InputText from '@/common/components/Input/InputText/InputText.module'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import SearchInput from '@/common/components/Input/SearchInput/SearchInput'
import Select from '@/common/components/Input/Select/Select'
import DeleteConfirmModal from '@/common/components/Modal/DeleteConfirmModal/DeleteConfirmModal'
import EditSpecialtyModal from '@/common/components/Modal/EditSpecialtyModal/EditSpecialtyModal'
import SuccessMessage from '@/common/components/SuccessMessage/SuccessMessage'
import { getAllSectors, type Sector } from '@/shared/api/sectors'
import {
  createSpecialty,
  deleteSpecialty,
  getAllSpecialties,
  updateSpecialty,
  type CreateSpecialtyRequest,
  type Specialty,
  type UpdateSpecialtyRequest,
} from '@/shared/api/specialties'
import { useLocale, useTranslations } from 'next-intl'
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
  const [specialityNameUk, setSpecialityNameUk] = useState('')
  const [specialityNameEn, setSpecialityNameEn] = useState('')
  const [category, setCategory] = useState<
    'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | ''
  >('')
  const [sector, setSector] = useState('')
  const [addedSectors, setAddedSectors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('AddSpeciality/common')
  const locale = useLocale()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpeciality, setEditingSpeciality] = useState<{
    id: string
    nameUk: string
    nameEn: string
    category: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | ''
    sectors: string[]
  } | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    specialtyId: string
    specialtyName: string
  } | null>(null)

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)

  const sectorOptions = sectors.map(
    (sector) => sector.name[locale as 'en' | 'uk'],
  )

  const categoryOptions = ['FIRST', 'SECOND', 'LEAD', 'SENIOR']

  const filteredSpecialities = specialties.filter(
    (specialty) =>
      specialty.name[locale as 'en' | 'uk']
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      specialty.name[locale === 'en' ? 'uk' : 'en']
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (specialty.category &&
        specialty.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      specialty.sectors.some(
        (sector) =>
          sector.name[locale as 'en' | 'uk']
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sector.name[locale === 'en' ? 'uk' : 'en']
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [specialtiesData, sectorsData] = await Promise.all([
          getAllSpecialties({ pageNumber: 0, pageSize: 100 }),
          getAllSectors({ pageNumber: 0, pageSize: 100 }),
        ])

        setSpecialties(specialtiesData.content || specialtiesData || [])
        setSectors(sectorsData.content || sectorsData || [])
      } catch (err) {
        setError(t('messages.error.loadData'))
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
  }, [filteredSpecialities])

  const handleSectorChange = (selectedSectorName: string) => {
    setSector(selectedSectorName)
    const selectedSector = sectors.find(
      (sec) => sec.name[locale as 'en' | 'uk'] === selectedSectorName,
    )
    if (selectedSector && !addedSectors.includes(selectedSector.id)) {
      setAddedSectors([...addedSectors, selectedSector.id])
    }
  }

  const removeSector = (sectorIdToRemove: string) => {
    setAddedSectors(addedSectors.filter((secId) => secId !== sectorIdToRemove))
  }

  const handleSubmit = async () => {
    if (specialityNameUk && specialityNameEn && addedSectors.length > 0) {
      try {
        setLoading(true)
        setError(null)

        const createData: CreateSpecialtyRequest = {
          name: {
            uk: specialityNameUk,
            en: specialityNameEn,
          },
          category: category || undefined,
          sectors: addedSectors.map((id) => ({ id })),
        }

        await createSpecialty(createData)
        const data = await getAllSpecialties({ pageNumber: 0, pageSize: 100 })
        setSpecialties(data.content || data || [])

        setSpecialityNameUk('')
        setSpecialityNameEn('')
        setCategory('')
        setSector('')
        setAddedSectors([])

        setSuccessMessage(t('messages.success.created'))
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError(t('messages.error.create'))
        console.error('Error creating specialty:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteSpecialty = (specialty: Specialty) => {
    setDeleteTarget({
      specialtyId: specialty.id,
      specialtyName: specialty.name.uk,
    })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        setLoading(true)
        setError(null)

        await deleteSpecialty(deleteTarget.specialtyId)

        const data = await getAllSpecialties({ pageNumber: 0, pageSize: 100 })
        setSpecialties(data.content || data || [])

        setSuccessMessage(t('messages.success.deleted'))
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError(t('messages.error.delete'))
        console.error('Error deleting specialty:', err)
      } finally {
        setLoading(false)
      }
    }
    setIsDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  const handleEditSpeciality = (specialty: Specialty) => {
    setEditingSpeciality({
      id: specialty.id,
      nameUk: specialty.name.uk,
      nameEn: specialty.name.en,
      category: specialty.category || '',
      sectors: specialty.sectors.map((sec) => sec.id),
    })
    setIsModalOpen(true)
  }

  const handleSaveEditedSpeciality = async (editedSpeciality: {
    nameUk: string
    nameEn: string
    category: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | ''
    sectors: string[]
  }) => {
    if (editingSpeciality !== null) {
      try {
        setLoading(true)
        setError(null)

        const updateData: UpdateSpecialtyRequest = {
          id: editingSpeciality.id,
          name: {
            uk: editedSpeciality.nameUk,
            en: editedSpeciality.nameEn,
          },
          category: editedSpeciality.category || undefined,
          sectors: editedSpeciality.sectors.map((id) => ({ id })),
        }

        await updateSpecialty(updateData)

        const data = await getAllSpecialties({ pageNumber: 0, pageSize: 100 })
        setSpecialties(data.content || data || [])

        setSuccessMessage(t('messages.success.updated'))
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError(t('messages.error.update'))
        console.error('Error updating specialty:', err)
      } finally {
        setLoading(false)
      }
    }
    setIsModalOpen(false)
    setEditingSpeciality(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSpeciality(null)
  }

  return (
    <div className={styles.container + ' main-wrapper'}>
      <div className={styles.form}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formFields}>
            <div className={styles.inputRow}>
              <div className={styles.inputColumn}>
                <InputText
                  title={t('form.specialtyNameUk.title')}
                  placeholder={t('form.specialtyNameUk.placeholder')}
                  isRequired={true}
                  value={specialityNameUk}
                  onChange={(e) => setSpecialityNameUk(e.target.value)}
                />
              </div>
              <div className={styles.inputColumn}>
                <InputText
                  title={t('form.specialtyNameEn.title')}
                  placeholder={t('form.specialtyNameEn.placeholder')}
                  isRequired={true}
                  value={specialityNameEn}
                  onChange={(e) => setSpecialityNameEn(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputColumn}>
                <Select
                  title={t('form.category.title')}
                  placeholder={t('form.category.placeholder')}
                  options={categoryOptions}
                  value={category}
                  onChange={(value) =>
                    setCategory(
                      value as 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | '',
                    )
                  }
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputColumn}>
                <Select
                  title={t('form.sectors.title')}
                  placeholder={t('form.sectors.placeholder')}
                  options={sectorOptions}
                  isRequired={true}
                  value={sector}
                  onChange={handleSectorChange}
                />
              </div>
            </div>

            <div className={styles.additionalSectors}>
              <p className={styles.additionalLabel}>
                {t('form.addedSectors.label')}
              </p>
              {addedSectors.length > 0 ? (
                <div className={styles.sectorTags}>
                  {addedSectors.map((sectorId) => {
                    const sector = sectors.find((s) => s.id === sectorId)
                    return (
                      <div key={sectorId} className={styles.sectorTag}>
                        <span>
                          {sector?.name[locale as 'en' | 'uk'] || sectorId}
                        </span>
                        <div className={styles.divider}></div>
                        <CloseButton onClick={() => removeSector(sectorId)} />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className={styles.additionalText}>
                  {t('form.addedSectors.empty')}
                </p>
              )}
            </div>

            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={
                loading ||
                !specialityNameUk ||
                !specialityNameEn ||
                addedSectors.length === 0
              }
            >
              {loading ? t('form.submitting') : t('form.submitButton')}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.specialtiesSection}>
        <div className={styles.specialtiesHeader}>
          <h2 className={styles.specialtiesTitle}>{t('table.title')}</h2>

          <div className={styles.searchContainer}>
            <SearchInput
              placeholder={t('table.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
        </div>

        <SuccessMessage
          message={successMessage}
          isVisible={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.specialtiesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>
              {t('table.headers.specialty')}
            </div>
            <div className={styles.headerCell}>
              {t('table.headers.category')}
            </div>
            <div className={styles.headerCell}>
              {t('table.headers.sectors')}
            </div>
            <div className={styles.headerCell}></div>
          </div>

          {filteredSpecialities.length > 0 ? (
            <div
              className={styles.tableBodyContainer}
              ref={tableBodyContainerRef}
            >
              <div className={styles.tableBody}>
                {filteredSpecialities.map((specialty) => (
                  <div key={specialty.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>
                      {specialty.name[locale as 'en' | 'uk']}
                    </div>
                    <div className={styles.tableCell}>
                      {specialty.category
                        ? t(`categories.${specialty.category}`)
                        : '-'}
                    </div>
                    <div className={styles.tableCell}>
                      {specialty.sectors
                        .map((sector) => sector.name[locale as 'en' | 'uk'])
                        .join(', ')}
                    </div>
                    <div className={styles.tableActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditSpeciality(specialty)}
                      >
                        <EditIcon />
                        {t('table.actions.edit')}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteSpecialty(specialty)}
                      >
                        <DeleteIcon />
                        {t('table.actions.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>
                {searchTerm ? t('table.noResults') : t('table.empty')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.scrollUpContainer}>
        <ScrollUp />
      </div>

      <EditSpecialtyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEditedSpeciality}
        specialty={editingSpeciality}
        sectors={sectors}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title={t('modals.delete.title')}
        message={t('modals.delete.message')}
      />
    </div>
  )
}

export default AddSpecialityPage
