'use client'

import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import UploadFile from '@/assets/image/icons/file.svg'
import { FieldError } from '@/common/components/FieldError/FieldError'
import { API } from '@/shared/config/api.config'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import styles from './page.module.scss'

interface FormApplicationProps {
  formId?: string
}

export default function AddPhoto({ formId = 'default' }: FormApplicationProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmission, setShowSubmission] = useState<boolean | null>(null)
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null)
  const [formErrors, setFormErrors] = useState<{
    fullname?: string
    email?: string
    faculty?: string
    description?: string
    photo?: string
  }>({})

  const tAddPhotoText = useTranslations('add-photo/text')
  const tFormApplication = useTranslations('form/application')

  const router = useRouter()

  const setLastSubmissionTime = useCallback(() => {
    localStorage.setItem('lastFormSubmission', Date.now().toString())
  }, [])

  const showSubmissionMessage = useCallback(() => {
    setTimeout(() => setShowSubmission(null), 3000)
  }, [])

  const validateForm = useCallback(() => {
    const errors: typeof formErrors = {}

    if (!file) {
      errors.photo = tFormApplication('validation.photo')
    }

    return errors
  }, [tFormApplication, file])

  const clearFieldError = useCallback((fieldName: keyof typeof formErrors) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  const fetchForm = useCallback(
    async (form: HTMLFormElement) => {
      const formData = new FormData(form)

      if (file) {
        formData.append('problemPhotoName', file.name)
        formData.set('problemPhoto', file)
      }

      try {
        const response = await fetch(`${API}admin/gallery/image/upload`, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          setLastSubmissionTime()
          form.reset()
          setFile(null)
          setSubmissionErrorMessage(null)
          router.push('/success')
        } else {
          const errorText = await response.text()
          setSubmissionErrorMessage(errorText || 'Unknown error')
          setShowSubmission(false)
        }

        showSubmissionMessage()
      } catch (err) {
        console.error('Error while sending: ', err)
        setShowSubmission(false)
        showSubmissionMessage()
      } finally {
        setIsSubmitting(false)
      }
    },
    [file, showSubmissionMessage, router, setLastSubmissionTime],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (isSubmitting) {
        return
      }

      const form = e.currentTarget

      setFormErrors({})

      const errors = validateForm()

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setIsSubmitting(true)
      fetchForm(form)
    },
    [isSubmitting, validateForm, fetchForm],
  )

  const fileInput = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFile(event.target.files?.[0] || null)
      clearFieldError('photo')
    },
    [clearFieldError],
  )

  const handleFilePreview = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (file) {
        const fileURL = URL.createObjectURL(file)
        window.open(fileURL, '_blank')
      }
    },
    [file],
  )

  const handleFileDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFile(null)
  }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.textContainer}>
        <h1 className={styles.heading}>{tAddPhotoText('heading')}</h1>
        <p className={styles.paragraph}>{tAddPhotoText('subheading')}</p>
      </div>
      <Form
        action='form'
        onSubmit={handleSubmit}
        className={styles.formContainer}
      >
        <label className={styles.customFileUpload}>
          <input
            type='file'
            id={`file-${formId}`}
            name='problemPhoto'
            accept='image/*'
            aria-labelledby={`fileLabel-${formId}`}
            ref={fileInput}
            onChange={handleFileChange}
            disabled={!!file}
          />
          <div className={styles.uploadContent}>
            <UploadFile />
            {!file && (
              <span className={styles.uploadText}>
                {tFormApplication(`placeholders.photo`)}
              </span>
            )}
          </div>

          {file && (
            <div className={styles.fileStatusContainer}>
              <button
                type='button'
                className={styles.fileButton}
                onClick={handleFilePreview}
              >
                {tFormApplication('file.preview')}
              </button>

              <div className={styles.divider}></div>
              <p className={styles.fileStatusText}>
                {tFormApplication('file.uploaded')}
              </p>
              <div className={styles.divider}></div>

              <button
                type='button'
                className={styles.fileButton}
                onClick={handleFileDelete}
              >
                {tFormApplication('file.delete')}
              </button>
            </div>
          )}
        </label>

        <FieldError error={formErrors.photo} />

        <div className={`${styles.fieldWrapper} ${styles.small}`}>
          <label className={styles.label} htmlFor={`email-${formId}`}>
            <p className={styles.labelText}>
              {tFormApplication(`labels.email`)}
            </p>
            <span
              className={styles.labelSpan}
              title={tFormApplication('required')}
            >
              *
            </span>
          </label>

          <div className={styles.inputWrapper}>
            <input
              type='email'
              id={`email-${formId}`}
              name='applicantEmail'
              placeholder={tFormApplication(`placeholders.email`)}
              className='inputText'
              onChange={() => clearFieldError('email')}
            />
          </div>

          <FieldError error={formErrors.email} />
        </div>

        <button type='submit' className='mainBtn' disabled={isSubmitting}>
          <p className={styles.buttonText}>
            {isSubmitting
              ? tFormApplication('loading')
              : tFormApplication(`button`)}
          </p>
          <ArrowRight />
        </button>

        {showSubmission === false && (
          <div className={`${styles.formMessage} ${styles.failure}`}>
            <p className={styles.failureText}>
              {tFormApplication('error')}
              {submissionErrorMessage}
            </p>
          </div>
        )}
      </Form>
    </div>
  )
}
