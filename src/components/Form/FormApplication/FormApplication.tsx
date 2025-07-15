'use client'

import UploadFile from '@/assets/image/icons/file.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import styles from './FormApplication.module.scss'
import { useTranslations } from 'next-intl'
import DropDownInput from './DropDownInput/DropDownInput'
import ErrorIcon from '@/assets/image/icons/error.svg'
import { useEffect, useState, useRef } from 'react'
import type { Department } from '@/config/form.config'
import { api } from '@/config/form.config'
import { useLocale } from 'next-intl'

export function FormApplication() {
  const [isFacultyValid, setIsFacultyValid] = useState(false)
  const [showError, setShowError] = useState(false)

  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [file, setFile] = useState<File | null>(null)

  const tFormApplication = useTranslations('form/application')

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${api}/department/all`, {
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
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const locale = useLocale()

  const facultyOptions = departments.map((faculty) => ({
    value: faculty.id,
    label: faculty.name[locale as 'en' | 'uk'],
  }))

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
    if (!isFacultyValid) {
      e.preventDefault()
      setShowError(true)
    }
  }

  const fileInput = useRef(null)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

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
            id='fullname'
            name='fullname'
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
            name='email'
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
          onSelect={handleSelect}
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
          name='description'
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
            name='file'
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

      <button type='submit' className='mainBtn'>
        <p className={styles.buttonText}>{tFormApplication(`button`)}</p>
        <ArrowRight />
      </button>
    </form>
  )
}
