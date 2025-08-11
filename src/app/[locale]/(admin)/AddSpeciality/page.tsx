'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import InputText from '@/common/components/Input/InputText/InputText.module'
import Select from '@/common/components/Input/Select/Select'
import CloseButton from '@/common/components/Input/CloseButton/CloseButton'
import SearchInput from '@/common/components/Input/SearchInput/SearchInput'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import EditModal from '@/common/components/Modal/EditModal/EditModal'
import DeleteConfirmModal from '@/common/components/Modal/DeleteConfirmModal/DeleteConfirmModal'
import SuccessMessage from '@/common/components/SuccessMessage/SuccessMessage'
import styles from './page.module.scss'

import enTranslations from '@/i18n/locales/en/AddSpeciality/common.json'
import ukTranslations from '@/i18n/locales/uk/AddSpeciality/common.json'

interface TranslationsType {
  sectors: string[]
  [key: string]: any
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

const AddSpecialityPage = () => {
  const params = useParams()
  const locale = params.locale as string

  const translations: TranslationsType =
    locale === 'en' ? enTranslations : ukTranslations

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

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

  const sectorOptions = translations.sectors

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

  const handleEditSpeciality = (
    specialityIndex: number,
    sectorIndex: number,
  ) => {
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
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.headerToFormGap}></div>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <InputText
                title={t('form.specialityName.title')}
                placeholder={t('form.specialityName.placeholder')}
                isRequired={true}
                value={specialityName}
                onChange={(e) => setSpecialityName(e.target.value)}
              />
            </div>
            <div className={styles.inputColumn}>
              <InputText
                title={t('form.category.title')}
                placeholder={t('form.category.placeholder')}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputColumn}>
              <Select
                title={t('form.sector.title')}
                placeholder={t('form.sector.placeholder')}
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
                {t('form.addedSectors.empty')}
              </p>
            )}
          </div>

          <button className={styles.submitButton} onClick={handleSubmit}>
            {t('form.submitButton')}
          </button>
        </div>
      </div>

      <div className={styles.formToSpecialtiesGap}></div>

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
          message={t('messages.success')}
          isVisible={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
        />

        <div className={styles.specialtiesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>
              {t('table.headers.speciality')}
            </div>
            <div className={styles.headerCell}>
              {t('table.headers.category')}
            </div>
            <div className={styles.headerCell}>{t('table.headers.sector')}</div>
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
                        onClick={() =>
                          handleEditSpeciality(
                            item.originalIndex,
                            item.sectorIndex,
                          )
                        }
                      >
                        <EditIcon />
                        {t('table.actions.edit')}
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

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEditedSpeciality}
        speciality={editingSpeciality}
        title={t('modals.edit.title')}
        saveText={t('modals.edit.button')}
        cancelText={t('modals.edit.cancel')}
        formLabels={{
          specialityName: t('modals.edit.form.specialityName.title'),
          category: t('modals.edit.form.category.title'),
          sector: t('modals.edit.form.sector.title'),
          addedSectors: t('modals.edit.form.addedSectors.label'),
        }}
        formPlaceholders={{
          specialityName: t('modals.edit.form.specialityName.placeholder'),
          category: t('modals.edit.form.category.placeholder'),
          sector: t('modals.edit.form.sector.placeholder'),
          emptyMessage: t('modals.edit.form.addedSectors.empty'),
        }}
        sectorOptions={translations.sectors}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title={t('modals.delete.title')}
        message={t('modals.delete.message')}
        confirmText={t('modals.delete.confirm')}
        cancelText={t('modals.delete.cancel')}
      />
    </div>
  )
}

export default AddSpecialityPage
