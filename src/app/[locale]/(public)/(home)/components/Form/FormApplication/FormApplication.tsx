'use client'

import type { Department } from '@/app/[locale]/(public)/(home)/components/Form/form.interfaces'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import UploadFile from '@/assets/image/icons/file.svg'
import { FieldError } from '@/common/components/FieldError/FieldError'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import { useRouter } from '@/i18n/navigation'
import { createApplication } from '@/shared/api/applications'
import { getDepartments } from '@/shared/api/departments'
import { useLocale, useTranslations } from 'next-intl'
import Form from 'next/form'
import { useCallback, useMemo, useRef, useState } from 'react'
import { CooldownModal } from './CooldownModal/CooldownModal'
import styles from './FormApplication.module.scss'

interface FormApplicationProps {
  formId?: string
}

export function FormApplication({ formId = 'default' }: FormApplicationProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null,
  )
  const [departments, setDepartments] = useState<Department[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmission, setShowSubmission] = useState<boolean | null>(null)
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null)
  const [dropdownError, setDropdownError] = useState<string | null>(null)
  const [showCooldownModal, setShowCooldownModal] = useState(false)
  const [cooldownRemainingTime, setCooldownRemainingTime] = useState(0)
  const [formErrors, setFormErrors] = useState<{
    fullname?: string
    email?: string
    faculty?: string
    description?: string
    photo?: string
  }>({})

  const tFormApplication = useTranslations('form/application')
  const locale = useLocale()
  const router = useRouter()

  const COOLDOWN_DURATION = 5 * 60 * 1000

  const facultyOptions = useMemo(
    () =>
      departments.map((faculty) => ({
        value: faculty.id,
        label: faculty.name[locale as 'en' | 'uk'],
      })),
    [departments, locale],
  )

  const showSubmissionMessage = useCallback(() => {
    setTimeout(() => setShowSubmission(null), 3000)
  }, [])

  const checkCooldown = useCallback(() => {
    const lastSubmissionTime = localStorage.getItem('lastFormSubmission')
    if (!lastSubmissionTime) return { canSubmit: true, remainingTime: 0 }

    const timeSinceLastSubmission = Date.now() - parseInt(lastSubmissionTime)
    const remainingTime = COOLDOWN_DURATION - timeSinceLastSubmission

    if (remainingTime > 0) {
      return { canSubmit: false, remainingTime }
    }

    return { canSubmit: true, remainingTime: 0 }
  }, [COOLDOWN_DURATION])

  const setLastSubmissionTime = useCallback(() => {
    localStorage.setItem('lastFormSubmission', Date.now().toString())
  }, [])

  const validateForm = useCallback(
    (form: HTMLFormElement) => {
      const errors: typeof formErrors = {}

      const fullname = form.applicantName.value.trim()
      if (!fullname) {
        errors.fullname = tFormApplication('validation.fullname')
      }

      const email = form.applicantEmail.value.trim()
      if (!email) {
        errors.email = tFormApplication('validation.email')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = tFormApplication('validation.email')
      }

      if (!selectedFacultyId) {
        errors.faculty = tFormApplication('validation.faculty')
      }

      const description = form.problemDescription.value.trim()
      if (!description) {
        errors.description = tFormApplication('validation.description')
      }

      if (!file) {
        errors.photo = tFormApplication('validation.photo')
      }

      return errors
    },
    [tFormApplication, selectedFacultyId, file],
  )

  const clearFieldError = useCallback((fieldName: keyof typeof formErrors) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  const fetchDepartments = useCallback(async () => {
    try {
      const departments = await getDepartments({
        pageNumber: 0,
        pageSize: 10,
      })
      setDepartments(departments)
      setDropdownError(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        setDropdownError(tFormApplication('error'))
      }
    }
  }, [tFormApplication])

  const parseFullName = useCallback((fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    return {
      lastName: parts[0] || '',
      firstName: parts[1] || '',
      middleName: parts.slice(2).join(' ') || '',
    }
  }, [])

  const fetchForm = useCallback(
    async (form: HTMLFormElement) => {
      if (!selectedFacultyId) {
        console.error('No faculty selected')
        return
      }

      const { lastName, firstName, middleName } = parseFullName(
        form.applicantName.value,
      )

      try {
        await createApplication({
          applicantName: {
            firstName,
            lastName,
            middleName,
          },
          applicantEmail: form.applicantEmail.value,
          departmentId: selectedFacultyId,
          problemDescription: form.problemDescription.value,
          problemPhoto: file || undefined,
          problemPhotoName: file?.name,
          status: 'IN_QUEUE',
        })

        setLastSubmissionTime()
        form.reset()
        setFile(null)
        setSelectedFacultyId(null)
        setSubmissionErrorMessage(null)
        router.push('/success')
      } catch (err) {
        console.error('Error while sending: ', err)
        if (err instanceof Error) {
          setSubmissionErrorMessage(err.message)
        } else {
          setSubmissionErrorMessage('Unknown error')
        }
        setShowSubmission(false)
      } finally {
        setIsSubmitting(false)
        showSubmissionMessage()
      }
    },
    [
      selectedFacultyId,
      file,
      parseFullName,
      showSubmissionMessage,
      router,
      setLastSubmissionTime,
    ],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (isSubmitting) {
        return
      }

      const form = e.currentTarget

      setFormErrors({})

      const errors = validateForm(form)

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      const { canSubmit, remainingTime } = checkCooldown()

      if (!canSubmit) {
        setCooldownRemainingTime(remainingTime)
        setShowCooldownModal(true)
        return
      }

      setIsSubmitting(true)
      fetchForm(form)
    },
    [isSubmitting, validateForm, checkCooldown, fetchForm],
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

  const handleCooldownConfirm = useCallback(() => {
    setShowCooldownModal(false)
    setIsSubmitting(true)
    const form = document.querySelector('form') as HTMLFormElement
    if (form) {
      fetchForm(form)
    }
  }, [fetchForm])

  const handleCooldownCancel = useCallback(() => {
    setShowCooldownModal(false)
  }, [])

  return (
    <Form
      action='form'
      className={styles.formApp}
      role='form'
      aria-label='Leave a request'
      onSubmit={handleSubmit}
    >
      <div className={`${styles.fieldWrapper} ${styles.small}`}>
        <label className={styles.label} htmlFor={`fullname-${formId}`}>
          <p className={styles.labelText}>
            {tFormApplication(`labels.fullname`)}
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
            type='text'
            id={`applicantName-${formId}`}
            name='applicantName'
            placeholder={tFormApplication(`placeholders.fullname`)}
            className='inputText'
            onChange={() => clearFieldError('fullname')}
          />
        </div>

        <FieldError error={formErrors.fullname} />
      </div>

      <div className={`${styles.fieldWrapper} ${styles.small}`}>
        <label className={styles.label} htmlFor={`email-${formId}`}>
          <p className={styles.labelText}>{tFormApplication(`labels.email`)}</p>
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

      <div className={`${styles.fieldWrapper} ${styles.small}`}>
        <label className={styles.label} htmlFor={`faculty-${formId}`}>
          <p className={styles.labelText}>
            {tFormApplication(`labels.faculty`)}
          </p>
          <span
            className={styles.labelSpan}
            title={tFormApplication('required')}
          >
            *
          </span>
        </label>

        <DropDownInput
          options={facultyOptions}
          value={selectedFacultyId}
          onOpen={() => {
            if (departments.length === 0) {
              fetchDepartments()
            }
          }}
          onSelect={(value) => {
            setSelectedFacultyId(value)
            clearFieldError('faculty')
          }}
          placeholder={tFormApplication('placeholders.faculty')}
          hasError={!!dropdownError || !!formErrors.faculty}
          errorMessage={dropdownError || formErrors.faculty}
        />

        <FieldError error={formErrors.faculty} />
      </div>

      <div className={`${styles.fieldWrapper} ${styles.big}`}>
        <label className={styles.label} htmlFor={`description-${formId}`}>
          <p className={styles.labelText}>
            {tFormApplication(`labels.description`)}
          </p>
          <span
            className={styles.labelSpan}
            title={tFormApplication('required')}
          >
            *
          </span>
        </label>

        <textarea
          placeholder={tFormApplication(`placeholders.description`)}
          id={`description-${formId}`}
          name='problemDescription'
          className={`${styles.textArea} `}
          onChange={() => clearFieldError('description')}
        />

        <FieldError error={formErrors.description} />
      </div>

      <div className={`${styles.fieldWrapper} ${styles.big}`}>
        <label
          className={styles.label}
          htmlFor={`file-${formId}`}
          id={`fileLabel-${formId}`}
        >
          <p className={styles.labelText}>{tFormApplication(`labels.photo`)}</p>
          <span
            className={styles.labelSpan}
            title={tFormApplication('required')}
          >
            *
          </span>
        </label>

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

      <CooldownModal
        isOpen={showCooldownModal}
        remainingTime={cooldownRemainingTime}
        onConfirm={handleCooldownConfirm}
        onCancel={handleCooldownCancel}
      />
    </Form>
  )
}
