'use client'

import type { Department } from '@/app/[locale]/(public)/(home)/components/Form/form.interfaces'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import UploadFile from '@/assets/image/icons/file.svg'
import { API } from '@/shared/config/api.config'
import { useLocale, useTranslations } from 'next-intl'
import Form from 'next/form'
import { useCallback, useMemo, useRef, useState } from 'react'
import DropDownInput from '../../../../../../../common/components/Input/DropDownInput/DropDownInput'
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

  const tFormApplication = useTranslations('form/application')
  const locale = useLocale()

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

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${API}department/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageNumber: 0,
          pageSize: 10,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch departments')
      }

      const data = await response.json()
      setDepartments(data.content)
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
      const formData = new FormData(form)

      if (selectedFacultyId) {
        formData.append('departmentId', selectedFacultyId)
      }

      formData.delete('applicantName')

      const { lastName, firstName, middleName } = parseFullName(
        form.applicantName.value,
      )
      formData.append('applicantName.firstName', firstName)
      formData.append('applicantName.lastName', lastName)
      formData.append('applicantName.middleName', middleName)

      if (file) {
        formData.append('problemPhotoName', file.name)
        formData.set('problemPhoto', file)
      }

      formData.append('status', 'IN_QUEUE')

      try {
        const response = await fetch(`${API}application/create`, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          setShowSubmission(true)
          form.reset()
          setFile(null)
          setSelectedFacultyId(null)
          setShowSubmission(null)
          setSubmissionErrorMessage(null)
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
    [selectedFacultyId, file, parseFullName, showSubmissionMessage],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (isSubmitting || !selectedFacultyId) {
        return
      }

      setIsSubmitting(true)
      fetchForm(e.currentTarget)
    },
    [isSubmitting, selectedFacultyId, fetchForm],
  )

  const fileInput = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFile(event.target.files?.[0] || null)
    },
    [],
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
            required
          />
        </div>
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
            required
          />
        </div>
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
          onSelect={setSelectedFacultyId}
          placeholder={tFormApplication('placeholders.faculty')}
          hasError={!!dropdownError}
          errorMessage={dropdownError}
        />
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
          required
        />
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
            required
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

      {showSubmission === true && (
        <div className={`${styles.formMessage} ${styles.success}`}>
          <p>{tFormApplication('success')}</p>
        </div>
      )}
    </Form>
  )
}
