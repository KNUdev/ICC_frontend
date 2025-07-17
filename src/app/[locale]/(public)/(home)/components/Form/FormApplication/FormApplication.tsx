'use client'

import type { Department } from '@/app/[locale]/(public)/(home)/components/Form/form.interfaces'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import UploadFile from '@/assets/image/icons/file.svg'
import { useLocale, useTranslations } from 'next-intl'
import { Golos_Text } from 'next/font/google'
import Form from 'next/form'
import { useRef, useState } from 'react'
import DropDownInput from '../../../../../../../common/components/Input/DropDownInput/DropDownInput'
import styles from './FormApplication.module.scss'

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-golos',
  display: 'swap',
})

interface FormApplicationProps {
  formId?: string
}

export function FormApplication({ formId = 'default' }: FormApplicationProps) {
  const [isFacultyValid, setIsFacultyValid] = useState(false)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null,
  )
  const [showError, setShowError] = useState(false)

  const [departments, setDepartments] = useState<Department[]>([])

  const [file, setFile] = useState<File | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false)
  const [showSubmissionError, setShowSubmissionError] = useState(false)
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null)

  const [dropdownError, setDropdownError] = useState<string | null>(null)

  const tFormApplication = useTranslations('form/application')

  const api = process.env.NEXT_PUBLIC_API_URL

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${api}department/all`, {
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
  }

  const locale = useLocale()

  const facultyOptions = departments.map((faculty) => ({
    value: faculty.id,
    label: faculty.name[locale as 'en' | 'uk'],
  }))

  const fetchForm = async (form: HTMLFormElement) => {
    const formData = new FormData(form)

    if (selectedFacultyId) {
      formData.append('departmentId', selectedFacultyId)
    }

    formData.delete('applicantName')

    const fullName = form.applicantName.value.trim().split(/\s+/)
    let lastName = '', firstName = '', middleName = ''
    if (fullName.length === 1) {
      lastName = fullName[0]
    } else if (fullName.length === 2) {
      lastName = fullName[0]
      firstName = fullName[1]
    } else if (fullName.length >= 3) {
      lastName = fullName[0]
      firstName = fullName[1]
      middleName = fullName.slice(2).join(' ') // Handle cases with multiple middle names
    }
    formData.append('applicantName.firstName', firstName)
    formData.append('applicantName.lastName', lastName)
    formData.append('applicantName.middleName', middleName)

    if (file) {
      formData.append('problemPhotoName', file.name)
      formData.set('problemPhoto', file)
    }

    formData.append('status', 'IN_QUEUE')

    try {
      const response = await fetch(`${api}application/create`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setShowSubmissionSuccess(true)
        setShowSubmissionError(false)
        clearForm(form)

        setTimeout(() => {
          setShowSubmissionSuccess(false)
        }, 3000)
      } else {
        const errorText = await response.text()
        setSubmissionErrorMessage(errorText || 'Unknown error')

        setShowSubmissionError(true)
        setShowSubmissionSuccess(false)

        setTimeout(() => {
          setShowSubmissionError(false)
        }, 3000)
      }
    } catch (err) {
      console.error('Error while sending: ', err)
      setShowSubmissionError(true)
      setShowSubmissionSuccess(false)

      setTimeout(() => {
        setShowSubmissionError(false)
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelect = () => {
    setIsFacultyValid(true)
  }

  const handleValidate = (isValid: boolean) => {
    setIsFacultyValid(isValid)
    if (isValid) {
      setShowError(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!isFacultyValid) {
      setShowError(true)
      return
    }

    setIsSubmitting(true)

    fetchForm(e.currentTarget)
  }

  const clearForm = (form: HTMLFormElement) => {
    form.reset()

    setFile(null)
    setIsFacultyValid(false)
    setShowError(false)
    setSelectedFacultyId(null)
  }

  const fileInput = useRef(null)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
  }

  return (
    <Form
      action='form'
      className={styles.formApp}
      role='form'
      aria-label='Leave a request'
      onSubmit={handleSubmit}
    >
      <div className={styles.smallFieldWrapper}>
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

      <div className={styles.smallFieldWrapper}>
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

      <div className={styles.smallFieldWrapper}>
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
          onSelect={(id: string | null) => {
            setSelectedFacultyId(id)
            handleSelect()
          }}
          onValidate={handleValidate}
          placeholder={tFormApplication('placeholders.faculty')}
          hasError={showError || !!dropdownError}
          errorMessage={dropdownError}
        />
      </div>

      <div className={styles.bigFieldWrapper}>
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
          className={`${styles.textArea} ${golos.variable}`}
          required
        />
      </div>

      <div className={styles.bigFieldWrapper}>
        <label
          className={styles.label}
          htmlFor={`file-${formId}`}
          id={`fileLabel-${formId}`}
        >
          <p className={styles.labelText}>{tFormApplication(`labels.photo`)}</p>
          <span className={styles.labelSpan} title={tFormApplication('required')}>
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
            onChange={onChange}
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
                className={styles.previewButton}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  const fileURL = URL.createObjectURL(file)
                  window.open(fileURL, '_blank')
                }}
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
                className={styles.deleteButton}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  setFile(null)
                }}
              >
                {tFormApplication('file.delete')}
              </button>
            </div>
          )}
        </label>
      </div>

      <button type='submit' className='mainBtn' disabled={isSubmitting}>
        <p className={styles.buttonText}>
          {isSubmitting ? tFormApplication('loading') : tFormApplication(`button`)}
        </p>
        <ArrowRight />
      </button>

      {showSubmissionError && (
        <div className={styles.formFailure}>
          <p className={styles.failureText}>
            {tFormApplication('error')}
            {submissionErrorMessage}
          </p>
        </div>
      )}

      {showSubmissionSuccess && (
        <div className={styles.formSuccess}>
          <p>{tFormApplication('success')}</p>
        </div>
      )}
    </Form>
  )
}
