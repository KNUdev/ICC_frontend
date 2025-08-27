import { type Sector } from '@/shared/api/sectors'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import CloseButton from '../../Input/CloseButton/CloseButton'
import InputText from '../../Input/InputText/InputText.module'
import Select from '../../Input/Select/Select'
import Modal from '../Modal'
import ModalActions from '../ModalActions/ModalActions'
import ModalButton from '../ModalButton/ModalButton'
import styles from './EditSpecialtyModal.module.scss'

interface EditSpecialtyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (specialty: {
    nameUk: string
    nameEn: string
    category: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | ''
    sectors: string[]
  }) => void
  specialty: {
    id: string
    nameUk: string
    nameEn: string
    category: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | ''
    sectors: string[]
  } | null
  sectors: Sector[]
}

const EditSpecialtyModal = ({
  isOpen,
  onClose,
  onSave,
  specialty,
  sectors,
}: EditSpecialtyModalProps) => {
  const [nameUk, setNameUk] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [category, setCategory] = useState<
    'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR' | ''
  >('')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedSector, setSelectedSector] = useState('')

  const t = useTranslations('AddSpeciality/common')

  const categoryOptions = ['FIRST', 'SECOND', 'LEAD', 'SENIOR']
  const sectorOptions = sectors.map((sector) => sector.name.uk)

  useEffect(() => {
    if (specialty) {
      setNameUk(specialty.nameUk)
      setNameEn(specialty.nameEn)
      setCategory(specialty.category)
      setSelectedSectors([...specialty.sectors])
    }
  }, [specialty])

  const handleSectorChange = (selectedSectorName: string) => {
    setSelectedSector(selectedSectorName)
    // Find the sector by name and get its ID
    const selectedSectorObj = sectors.find(
      (sec) => sec.name.uk === selectedSectorName,
    )
    if (selectedSectorObj && !selectedSectors.includes(selectedSectorObj.id)) {
      setSelectedSectors([...selectedSectors, selectedSectorObj.id])
    }
  }

  const removeSector = (sectorIdToRemove: string) => {
    setSelectedSectors(
      selectedSectors.filter((secId) => secId !== sectorIdToRemove),
    )
  }

  const handleSave = () => {
    if (nameUk && nameEn && selectedSectors.length > 0) {
      onSave({
        nameUk,
        nameEn,
        category,
        sectors: selectedSectors,
      })
      setSelectedSector('')
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedSector('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('modals.edit.title')}>
      <div className={styles.formFields}>
        <div className={styles.inputRow}>
          <div className={styles.inputColumn}>
            <InputText
              title={t('form.specialtyNameUk.title')}
              placeholder={t('form.specialtyNameUk.placeholder')}
              isRequired={true}
              value={nameUk}
              onChange={(e) => setNameUk(e.target.value)}
            />
          </div>
          <div className={styles.inputColumn}>
            <InputText
              title={t('form.specialtyNameEn.title')}
              placeholder={t('form.specialtyNameEn.placeholder')}
              isRequired={true}
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
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
              value={selectedSector}
              onChange={handleSectorChange}
            />
          </div>
        </div>

        <div className={styles.additionalSectors}>
          <p className={styles.additionalLabel}>
            {t('form.addedSectors.label')}
          </p>
          {selectedSectors.length > 0 ? (
            <div className={styles.sectorTags}>
              {selectedSectors.map((sectorId) => {
                const sector = sectors.find((s) => s.id === sectorId)
                return (
                  <div key={sectorId} className={styles.sectorTag}>
                    <span>{sector?.name.uk || sectorId}</span>
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
      </div>

      <ModalActions>
        <ModalButton variant='primary' onClick={handleSave}>
          {t('modals.edit.button')}
        </ModalButton>
      </ModalActions>
    </Modal>
  )
}

export default EditSpecialtyModal
