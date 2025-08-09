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
}

const EditModal = ({ isOpen, onClose, onSave, speciality }: EditModalProps) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [sectors, setSectors] = useState<string[]>([])
  const [selectedSector, setSelectedSector] = useState('')

  const sectorOptions = [
    'Сектор мережевих технологій',
    'Сектор веб-розробки',
    'Сектор мобільних технологій',
    'Сектор штучного інтелекту',
    'Сектор кібербезпеки',
  ]

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Редагувати спеціальність'
    >
      <div className={styles.formFields}>
        <div className={styles.inputRow}>
          <div className={styles.inputColumn}>
            <InputText
              title='Назва спеціальності'
              placeholder='Оператор машинного відділу'
              isRequired={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={selectedSector}
              onChange={handleSectorChange}
            />
          </div>
        </div>

        <div className={styles.additionalSectors}>
          <p className={styles.additionalLabel}>Додані сектори:</p>
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
            <p className={styles.additionalText}>Поки що нічого не додано :(</p>
          )}
        </div>
      </div>

      <ModalActions>
        <ModalButton variant='primary' onClick={handleSave}>
          Завершити редагування
        </ModalButton>
      </ModalActions>
    </Modal>
  )
}

export default EditModal
