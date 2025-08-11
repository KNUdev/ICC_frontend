import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import ModalActions from '../ModalActions/ModalActions'
import ModalButton from '../ModalButton/ModalButton'
import InputText from '../../Input/InputText/InputText.module'
import Select from '../../Input/Select/Select'
import CloseButton from '../../Input/CloseButton/CloseButton'
import styles from './EditModal.module.scss'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (speciality: {
    name: string
    category: string
    sectors: string[]
  }) => void
  speciality: {
    name: string
    category: string
    sectors: string[]
    index: number
  } | null
  title?: string
  saveText?: string
  cancelText?: string
  formLabels?: {
    specialityName?: string
    category?: string
    sector?: string
    addedSectors?: string
  }
  formPlaceholders?: {
    specialityName?: string
    category?: string
    sector?: string
    emptyMessage?: string
  }
  sectorOptions?: string[]
}

const EditModal = ({
  isOpen,
  onClose,
  onSave,
  speciality,
  title = 'Редагувати спеціальність',
  saveText = 'Завершити редагування',
  formLabels = {},
  formPlaceholders = {},
  sectorOptions = [
    'Сектор мережевих технологій',
    'Сектор веб-розробки',
    'Сектор мобільних технологій',
    'Сектор штучного інтелекту',
    'Сектор кібербезпеки',
  ],
}: EditModalProps) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [sectors, setSectors] = useState<string[]>([])
  const [selectedSector, setSelectedSector] = useState('')

  useEffect(() => {
    if (speciality) {
      setName(speciality.name)
      setCategory(speciality.category)
      setSectors([...speciality.sectors])
    }
  }, [speciality])

  const handleSectorChange = (selectedSector: string) => {
    setSelectedSector(selectedSector)
    if (selectedSector && !sectors.includes(selectedSector)) {
      setSectors([...sectors, selectedSector])
    }
  }

  const removeSector = (sectorToRemove: string) => {
    setSectors(sectors.filter((sector) => sector !== sectorToRemove))
  }

  const handleSave = () => {
    if (name && sectors.length > 0) {
      onSave({ name, category, sectors })
      setSelectedSector('')
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedSector('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className={styles.formFields}>
        <div className={styles.inputRow}>
          <div className={styles.inputColumn}>
            <InputText
              title={formLabels.specialityName || 'Назва спеціальності'}
              placeholder={
                formPlaceholders.specialityName || 'Оператор машинного відділу'
              }
              isRequired={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputColumn}>
            <InputText
              title={
                formLabels.category || 'Категорія (якщо потрібно вказувати)'
              }
              placeholder={formPlaceholders.category || '1 категорія'}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputColumn}>
            <Select
              title={formLabels.sector || 'Сектор'}
              placeholder={
                formPlaceholders.sector || 'Сектор мережевих технологій'
              }
              options={sectorOptions}
              isRequired={true}
              value={selectedSector}
              onChange={handleSectorChange}
            />
          </div>
        </div>

        <div className={styles.additionalSectors}>
          <p className={styles.additionalLabel}>
            {formLabels.addedSectors || 'Додані сектори:'}
          </p>
          {sectors.length > 0 ? (
            <div className={styles.sectorTags}>
              {sectors.map((sector) => (
                <div key={sector} className={styles.sectorTag}>
                  <span>{sector}</span>
                  <div className={styles.divider}></div>
                  <CloseButton onClick={() => removeSector(sector)} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.additionalText}>
              {formPlaceholders.emptyMessage || 'Поки що нічого не додано :('}
            </p>
          )}
        </div>
      </div>

      <ModalActions>
        <ModalButton variant='primary' onClick={handleSave}>
          {saveText}
        </ModalButton>
      </ModalActions>
    </Modal>
  )
}

export default EditModal
