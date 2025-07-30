import Modal from '../Modal'
import ModalActions from '../ModalActions/ModalActions'
import ModalButton from '../ModalButton/ModalButton'
import styles from './DeleteConfirmModal.module.scss'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  specialities?: string[]
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Видалити елемент',
  message = 'Ви впевнені, що хочете видалити цей елемент? Цю дію неможливо скасувати.',
  confirmText = 'Так, видалити спеціальність',
  specialities = [],
}: DeleteConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className={styles.confirmText}>{message}</p>

      {specialities.length > 0 && (
        <div className={styles.specialitiesSection}>
          <p className={styles.specialitiesLabel}>
            Наразі, в сектор входять такі спеціальності:
          </p>
          <div className={styles.specialityTags}>
            {specialities.map((speciality, index) => (
              <div key={index} className={styles.specialityTag}>
                <span>{speciality}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ModalActions>
        <ModalButton variant='primary' onClick={onConfirm}>
          {confirmText}
        </ModalButton>
      </ModalActions>
    </Modal>
  )
}

export default DeleteConfirmModal
