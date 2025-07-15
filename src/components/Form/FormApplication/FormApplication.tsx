'use client'

import UploadFile from '@/assets/image/icons/file.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import styles from './FormApplication.module.scss'
import { useTranslations } from 'next-intl'
import DropDownInput from '../../../common/components/DropDownInput/DropDownInput'
import ErrorIcon from '@/assets/image/icons/error.svg'
import { useState, useRef } from 'react'
import type { Department } from '@/config/form.config'
import { useLocale } from 'next-intl'

export function FormApplication() {
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
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

    const fullName = form.fullName.value.trim().split(' ')
    formData.append('applicantName.firstName', fullName[0] || '')
    formData.append('applicantName.lastName', fullName[1] || '')
    formData.append('applicantName.middleName', fullName[2] || '')

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

      console.log(response.status)

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
    <form
      className={styles.formApp}
      role='form'
      aria-label='Leave a request'
      onSubmit={handleSubmit}
    >
      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='fullname'>
          <p className={styles.labelText}>
            {tFormApplication(`labels.fullname`)}
          </p>
          <span className={styles.labelSpan} title='This field is required'>
            *
          </span>
        </label>

        <div className={styles.inputWrapper}>
          <input
            type='text'
            id='fullName'
            name='applicantName'
            placeholder={tFormApplication(`placeholders.fullname`)}
            className='inputText'
            required
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='email'>
          <p className={styles.labelText}>{tFormApplication(`labels.email`)}</p>
          <span className={styles.labelSpan} title='This field is required'>
            *
          </span>
        </label>

        <div className={styles.inputWrapper}>
          <input
            type='email'
            id='email'
            name='applicantEmail'
            placeholder={tFormApplication(`placeholders.email`)}
            className='inputText'
            required
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='faculty'>
          <p className={styles.labelText}>
            {tFormApplication(`labels.faculty`)}
          </p>
          <span className={styles.labelSpan} title='This field is required'>
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
          hasError={showError}
        />

        {showError && (
          <div className={styles.errorContainer}>
            <ErrorIcon></ErrorIcon>
            <p className={styles.errorText}>{tFormApplication('validation')}</p>
          </div>
        )}
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor='description'>
          <p className={styles.labelText}>
            {tFormApplication(`labels.description`)}
          </p>
          <span className={styles.labelSpan} title='This field is required'>
            *
          </span>
        </label>

        <textarea
          placeholder={tFormApplication(`placeholders.description`)}
          id='description'
          name='problemDescription'
          className={styles.textArea}
          required
        />
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor='file' id='fileLabel'>
          <p className={styles.labelText}>{tFormApplication(`labels.photo`)}</p>
          <span className={styles.labelSpan} title='This field is required'>
            *
          </span>
        </label>

        <label className={styles.customFileUpload}>
          <input
            type='file'
            id='file'
            name='problemPhoto'
            accept='image/*'
            aria-labelledby='fileLabel'
            ref={fileInput}
            onChange={onChange}
            required
          />
          <div className={styles.uploadContent}>
            <UploadFile />
            {file ? (
              <span className={styles.uploadText}>{file.name}</span>
            ) : (
              <span className={styles.uploadText}>
                {tFormApplication(`placeholders.photo`)}
              </span>
            )}
          </div>
        </label>
      </div>

      <button type='submit' className='mainBtn' disabled={isSubmitting}>
        <p className={styles.buttonText}>
          {isSubmitting ? 'Loading...' : tFormApplication(`button`)}
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
    </form>
  )
}
