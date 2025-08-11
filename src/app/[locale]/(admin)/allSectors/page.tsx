'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import InputText from '@/common/components/Input/InputText/InputText.module'
import Select from '@/common/components/Input/Select/Select'
import CloseButton from '@/common/components/Input/CloseButton/CloseButton'
import SearchInput from '@/common/components/Input/SearchInput/SearchInput'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import Modal from '@/common/components/Modal/Modal'
import ModalActions from '@/common/components/Modal/ModalActions/ModalActions'
import ModalButton from '@/common/components/Modal/ModalButton/ModalButton'
import DeleteConfirmModal from '@/common/components/Modal/DeleteConfirmModal/DeleteConfirmModal'
import SuccessMessage from '@/common/components/SuccessMessage/SuccessMessage'
import styles from './page.module.scss'

import enTranslations from '@/i18n/locales/en/AllSectors/common.json'
import ukTranslations from '@/i18n/locales/uk/AllSectors/common.json'

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
  const params = useParams()
  const locale = params.locale as string

  const translations = locale === 'en' ? enTranslations : ukTranslations

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

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

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSectorIndex, setSelectedSectorIndex] = useState<number | null>(
    null,
  )
  const [editingSectorName, setEditingSectorName] = useState('')
  const [editingSpecialities, setEditingSpecialities] = useState<string[]>([])
  const [editingSpeciality, setEditingSpeciality] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)

  const specialityOptions = translations.specialityOptions

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
    setEditingSectorName(sector.name)
    setEditingSpecialities([...sector.specialities])
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

  const confirmEdit = () => {
    if (
      selectedSectorIndex !== null &&
      editingSectorName &&
      editingSpecialities.length > 0
    ) {
      setSectors((prevSectors) =>
        prevSectors.map((sector, index) =>
          index === selectedSectorIndex
            ? { name: editingSectorName, specialities: editingSpecialities }
            : sector,
        ),
      )

      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
    setShowEditModal(false)
    setSelectedSectorIndex(null)
    setEditingSectorName('')
    setEditingSpecialities([])
    setEditingSpeciality('')
  }

  const closeModal = () => {
    setShowDeleteModal(false)
    setShowEditModal(false)
    setSelectedSectorIndex(null)
    setEditingSectorName('')
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
                title={t('form.sectorName.title')}
                placeholder={t('form.sectorName.placeholder')}
                isRequired={true}
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title={t('form.specialities.title')}
                placeholder={t('form.specialities.placeholder')}
                options={specialityOptions}
                isRequired={true}
                value={speciality}
                onChange={handleSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>
              {t('form.addedSpecialities.label')}
            </p>
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
                {t('form.addedSpecialities.empty')}
              </p>
            )}
          </div>

          <button className={styles.submitButton} onClick={handleSubmit}>
            {t('form.submitButton')}
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
          message={t('messages.success')}
          isVisible={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
        />

        <div className={styles.sectorsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>
              {t('table.headers.sectorName')}
            </div>
            <div className={styles.headerCell}>
              {t('table.headers.specialities')}
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
                    <div className={styles.tableCell}>{sector.name}</div>
                    <div className={styles.tableCell}>
                      {sector.specialities.join(', ')}
                    </div>
                    <div className={styles.tableActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditSector(index)}
                      >
                        <EditIcon />
                        {t('table.actions.edit')}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteSector(index)}
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
        message={t('modals.delete.message')}
        description={t('modals.delete.specialitiesLabel')}
        confirmText={t('modals.delete.confirm')}
        cancelText={t('modals.delete.cancel')}
        specialities={
          selectedSectorIndex !== null
            ? sectors[selectedSectorIndex]?.specialities || []
            : []
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
                title={t('modals.edit.form.sectorName.title')}
                placeholder={t('modals.edit.form.sectorName.placeholder')}
                isRequired={true}
                value={editingSectorName}
                onChange={(e) => setEditingSectorName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title={t('modals.edit.form.specialities.title')}
                placeholder={t('modals.edit.form.specialities.placeholder')}
                options={specialityOptions}
                isRequired={true}
                value={editingSpeciality}
                onChange={handleEditSpecialityChange}
              />
            </div>
          </div>

          <div className={styles.additionalSpecialities}>
            <p className={styles.additionalLabel}>
              {t('modals.edit.form.addedSpecialities.label')}
            </p>
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
                {t('modals.edit.form.addedSpecialities.empty')}
              </p>
            )}
          </div>
        </div>

        <ModalActions>
          <ModalButton variant='primary' onClick={confirmEdit}>
            {t('modals.edit.button')}
          </ModalButton>
        </ModalActions>
      </Modal>
    </div>
  )
}

export default AllSectorsPage
