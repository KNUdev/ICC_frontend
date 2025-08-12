'use client'

import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import { FieldError } from '@/common/components/FieldError/FieldError'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useCallback, useRef, useState } from 'react'
import { FileUpload } from './FileUpload'
import { ImageUpload } from './imageUpload'
import styles from './page.module.scss'

export default function AddPhoto() {
  const formId = 'add-photo-form'
  const tAddPhotoText = useTranslations('AddPhoto/common')
  const tFormApplication = useTranslations('form/application')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const validateForm = useCallback(
    (formData: FormData, file: File | null) => {
      const errors: {
        name?: string
        description?: string
        photo?: string
      } = {}

      const name = (formData.get('publicItemName') as string)?.trim()
      const description = (formData.get('itemDescription') as string)?.trim()

      if (!name) {
        errors.name = tFormApplication('validation.name')
      }

      if (!description) {
        errors.description = tFormApplication('validation.description')
      }

      if (!file) {
        errors.photo = tFormApplication('validation.photo')
      }

      return errors
    },
    [tFormApplication],
  )

  const handleSuccess = useCallback(() => {
    setShowSuccessModal(true)
    if (fileInputRef.current?.form) {
      fileInputRef.current.form.reset()
    }
  }, [])

  const {
    file,
    isSubmitting,
    errorMessage,
    formErrors,
    setFile,
    clearFieldError,
    validateAndSubmit,
  } = ImageUpload({
    validateForm,
    onSuccess: handleSuccess,
  })

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      await validateAndSubmit(formData)
    },
    [validateAndSubmit],
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] || null
      setFile(selectedFile)
      if (selectedFile) {
        clearFieldError('photo')
      }
    },
    [setFile, clearFieldError],
  )

  const handleFilePreview = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!file) return

      const fileURL = URL.createObjectURL(file)
      const newWindow = window.open(fileURL, '_blank')

      if (newWindow) {
        newWindow.addEventListener('beforeunload', () => {
          URL.revokeObjectURL(fileURL)
        })
      }
    },
    [file],
  )

  const handleFileDelete = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [setFile],
  )

  const handleCloseModal = useCallback(() => {
    setShowSuccessModal(false)
  }, [])

  return (
    <div className={styles.section + ' main-wrapper'}>
      <header className={styles.textContainer}>
        <h1 className={styles.heading}>{tAddPhotoText('heading')}</h1>
        <p className={styles.paragraph}>{tAddPhotoText('subheading')}</p>
      </header>

      <Form action='' onSubmit={handleSubmit} className={styles.formContainer}>
        <FileUpload
          ref={fileInputRef}
          file={file}
          onFileChange={handleFileChange}
          onFilePreview={handleFilePreview}
          onFileDelete={handleFileDelete}
          disabled={isSubmitting}
          id={`file-${formId}`}
          name='item'
        />

        <FieldError error={formErrors.photo} />

        <div className={styles.fieldWrapper}>
          <label className={styles.label} htmlFor={`name-${formId}`}>
            <span className={styles.labelText}>
              {tAddPhotoText('name.label')}
            </span>
            <span
              className={styles.labelSpan}
              title={tFormApplication('required')}
            >
              *
            </span>
          </label>

          <input
            type='text'
            id={`name-${formId}`}
            name='publicItemName'
            placeholder={tAddPhotoText('name.placeholder')}
            className='inputText'
            disabled={isSubmitting}
            onChange={() => clearFieldError('name')}
          />

          <FieldError error={formErrors.name} />
        </div>

        <div className={styles.fieldWrapper}>
          <label className={styles.label} htmlFor={`description-${formId}`}>
            <span className={styles.labelText}>
              {tAddPhotoText('description.label')}
            </span>
            <span
              className={styles.labelSpan}
              title={tFormApplication('required')}
            >
              *
            </span>
          </label>

          <textarea
            id={`description-${formId}`}
            name='itemDescription'
            placeholder={tAddPhotoText('description.placeholder')}
            className='inputText'
            disabled={isSubmitting}
            onChange={() => clearFieldError('description')}
          />

          <FieldError error={formErrors.description} />
        </div>

        <button type='submit' className='mainBtn' disabled={isSubmitting}>
          <span className={styles.buttonText}>
            {isSubmitting
              ? tFormApplication('loading')
              : tAddPhotoText('addButton')}
          </span>
          <ArrowRight />
        </button>

        {errorMessage && (
          <div className={`${styles.formMessage} ${styles.failure}`}>
            <p className={styles.failureText}>
              {tFormApplication('error')} {errorMessage}
            </p>
          </div>
        )}
      </Form>

      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className={styles.successIcon}
                >
                  <polyline points='20,6 9,17 4,12'></polyline>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>
                {tFormApplication('success.title')}
              </h3>
              <p className={styles.modalMessage}>
                {tFormApplication('success.message')}
              </p>
              <button
                type='button'
                className={styles.modalButton}
                onClick={handleCloseModal}
              >
                {tFormApplication('success.button')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
