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
import {
  createSector,
  deleteSector,
  getAllSectors,
  updateSector,
  type CreateSectorRequest,
  type Sector,
  type UpdateSectorRequest,
} from '@/shared/api/sectors'
import { getAllSpecialties, type Specialty } from '@/shared/api/specialties'
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

const AllSectorsPage = () => {
  const [sectorNameUk, setSectorNameUk] = useState('')
  const [sectorNameEn, setSectorNameEn] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [addedSpecialities, setAddedSpecialities] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sectors, setSectors] = useState<Sector[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('AddSectors/common')
  const locale = useLocale()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [editingSectorNameUk, setEditingSectorNameUk] = useState('')
  const [editingSectorNameEn, setEditingSectorNameEn] = useState('')
  const [editingSpecialities, setEditingSpecialities] = useState<string[]>([])
  const [editingSpeciality, setEditingSpeciality] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)

  const specialtyOptions = specialties.map(
    (specialty) => specialty.name[locale as 'en' | 'uk'],
  )

  const filteredSectors = sectors.filter(
    (sector) =>
      sector.name[locale as 'en' | 'uk']
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sector.name[locale === 'en' ? 'uk' : 'en']
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sector.specialties.some(
        (spec) =>
          spec.name[locale as 'en' | 'uk']
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          spec.name[locale === 'en' ? 'uk' : 'en']
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [sectorsData, specialtiesData] = await Promise.all([
          getAllSectors({ pageNumber: 0, pageSize: 100 }),
          getAllSpecialties({ pageNumber: 0, pageSize: 100 }),
        ])

        setSectors(sectorsData.content || sectorsData || [])
        setSpecialties(specialtiesData.content || specialtiesData || [])
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
  }, [filteredSectors])

  const handleSpecialityChange = (selectedSpecialityName: string) => {
    setSpeciality(selectedSpecialityName)
    const selectedSpecialty = specialties.find(
      (spec) => spec.name[locale as 'en' | 'uk'] === selectedSpecialityName,
    )
    if (
      selectedSpecialty &&
      !addedSpecialities.includes(selectedSpecialty.id)
    ) {
      setAddedSpecialities([...addedSpecialities, selectedSpecialty.id])
    }
  }

  const removeSpeciality = (specialityIdToRemove: string) => {
    setAddedSpecialities(
      addedSpecialities.filter((specId) => specId !== specialityIdToRemove),
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
          specialties: addedSpecialities.map((id) => ({ id })),
        }

        await createSector(createData)

        const data = await getAllSectors({ pageNumber: 0, pageSize: 100 })
        setSectors(data.content || data || [])

        setSectorNameUk('')
        setSectorNameEn('')
        setSpeciality('')
        setAddedSpecialities([])

        setSuccessMessage(t('messages.success.created'))
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError(t('messages.error.create'))
        console.error('Error creating sector:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteSector = (sector: Sector) => {
    setSelectedSector(sector)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (selectedSector !== null) {
      try {
        setLoading(true)
        setError(null)

        await deleteSector(selectedSector.id)

        const data = await getAllSectors({ pageNumber: 0, pageSize: 100 })
        setSectors(data.content || data || [])

        setSuccessMessage(t('messages.success.deleted'))
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError(t('messages.error.delete'))
        console.error('Error deleting sector:', err)
      } finally {
        setLoading(false)
      }
    }
    setShowDeleteModal(false)
    setSelectedSector(null)
  }

  const handleEditSector = (sector: Sector) => {
    setSelectedSector(sector)
    setEditingSectorNameUk(sector.name.uk)
    setEditingSectorNameEn(sector.name.en)
    setEditingSpecialities(sector.specialties.map((spec) => spec.id))
    setEditingSpeciality('')
    setShowEditModal(true)
  }

  const handleEditSpecialityChange = (selectedSpecialityName: string) => {
    setEditingSpeciality(selectedSpecialityName)
    const selectedSpecialty = specialties.find(
      (spec) => spec.name[locale as 'en' | 'uk'] === selectedSpecialityName,
    )
    if (
      selectedSpecialty &&
      !editingSpecialities.includes(selectedSpecialty.id)
    ) {
      setEditingSpecialities([...editingSpecialities, selectedSpecialty.id])
    }
  }

  const removeEditingSpeciality = (specialityIdToRemove: string) => {
    setEditingSpecialities(
      editingSpecialities.filter((specId) => specId !== specialityIdToRemove),
    )
  }

  const confirmEdit = async () => {
    if (selectedSector !== null && editingSectorNameUk && editingSectorNameEn) {
      try {
        setLoading(true)
        setError(null)

        const updateData: UpdateSectorRequest = {
          id: selectedSector.id,
          name: {
            uk: editingSectorNameUk,
            en: editingSectorNameEn,
          },
          specialties: editingSpecialities.map((id) => ({ id })),
        }

        await updateSector(updateData)

        const data = await getAllSectors({ pageNumber: 0, pageSize: 100 })
        setSectors(data.content || data || [])

        setSuccessMessage(t('messages.success.updated'))
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } catch (err) {
        setError(t('messages.error.update'))
        console.error('Error updating sector:', err)
      } finally {
        setLoading(false)
      }
    }
    setShowEditModal(false)
    setSelectedSector(null)
    setEditingSectorNameUk('')
    setEditingSectorNameEn('')
    setEditingSpecialities([])
    setEditingSpeciality('')
  }

  const closeModal = () => {
    setShowDeleteModal(false)
    setShowEditModal(false)
    setSelectedSector(null)
    setEditingSectorNameUk('')
    setEditingSectorNameEn('')
    setEditingSpecialities([])
    setEditingSpeciality('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.headerToFormGap}></div>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title={t('form.sectorNameUk.title')}
                placeholder={t('form.sectorNameUk.placeholder')}
                isRequired={true}
                value={sectorNameUk}
                onChange={(e) => setSectorNameUk(e.target.value)}
              />

              <InputText
                title={t('form.sectorNameEn.title')}
                placeholder={t('form.sectorNameEn.placeholder')}
                isRequired={true}
                value={sectorNameEn}
                onChange={(e) => setSectorNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title={t('form.specialties.title')}
                placeholder={t('form.specialties.placeholder')}
                options={specialtyOptions}
                isRequired={false}
                value={speciality}
                onChange={handleSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>
              {t('form.addedSpecialties.label')}
            </p>
            {addedSpecialities.length > 0 ? (
              <div className={styles.specialityTags}>
                {addedSpecialities.map((specialtyId) => {
                  const specialty = specialties.find(
                    (s) => s.id === specialtyId,
                  )
                  return (
                    <div key={specialtyId} className={styles.specialityTag}>
                      <span>
                        {specialty?.name[locale as 'en' | 'uk'] || specialtyId}
                      </span>
                      <div className={styles.divider}></div>
                      <CloseButton
                        onClick={() => removeSpeciality(specialtyId)}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className={styles.additionalText}>
                {t('form.addedSpecialties.empty')}
              </p>
            )}
          </div>

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || !sectorNameUk || !sectorNameEn}
          >
            {loading ? t('form.submitting') : t('form.submitButton')}
          </button>
        </div>
      </div>

      <div className={styles.formToSectorsGap}></div>

      <div className={styles.sectorsSection}>
        <div className={styles.sectorsHeader}>
          <h2 className={styles.sectorsTitle}>{t('table.title')}</h2>

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

        <div className={styles.sectorsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>
              {t('table.headers.sectorName')}
            </div>
            <div className={styles.headerCell}>
              {t('table.headers.specialties')}
            </div>
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
                      {sector.specialties
                        .map((spec) => spec.name.uk)
                        .join(', ')}
                    </div>
                    <div className={styles.tableActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditSector(sector)}
                      >
                        <EditIcon />
                        {t('table.actions.edit')}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteSector(sector)}
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

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title={t('modals.delete.title')}
        confirmText={t('modals.delete.confirmText')}
        specialities={
          selectedSector?.specialties.map((spec) => spec.name.uk) || []
        }
      />

      <Modal
        isOpen={showEditModal}
        onClose={closeModal}
        title={t('modals.edit.title')}
      >
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title={t('form.sectorNameUk.title')}
                placeholder={t('form.sectorNameUk.placeholder')}
                isRequired={true}
                value={editingSectorNameUk}
                onChange={(e) => setEditingSectorNameUk(e.target.value)}
              />

              <InputText
                title={t('form.sectorNameEn.title')}
                placeholder={t('form.sectorNameEn.placeholder')}
                isRequired={true}
                value={editingSectorNameEn}
                onChange={(e) => setEditingSectorNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title={t('form.specialties.title')}
                placeholder={t('form.specialties.placeholder')}
                options={specialtyOptions}
                isRequired={false}
                value={editingSpeciality}
                onChange={handleEditSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>
              {t('form.addedSpecialties.label')}
            </p>
            {editingSpecialities.length > 0 ? (
              <div className={styles.specialityTags}>
                {editingSpecialities.map((specialtyId) => {
                  const specialty = specialties.find(
                    (s) => s.id === specialtyId,
                  )
                  return (
                    <div key={specialtyId} className={styles.specialityTag}>
                      <span>{specialty?.name.uk || specialtyId}</span>
                      <div className={styles.divider}></div>
                      <CloseButton
                        onClick={() => removeEditingSpeciality(specialtyId)}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className={styles.additionalText}>
                {t('form.addedSpecialties.empty')}
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
            {loading ? t('modals.edit.saving') : t('modals.edit.button')}
          </ModalButton>
        </ModalActions>
      </Modal>
    </div>
  )
}

export default AllSectorsPage
