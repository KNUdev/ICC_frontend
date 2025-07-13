'use client'

import UploadFile from '@/assets/image/icons/file.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import styles from './FormApplication.module.scss'
import { useTranslations } from 'next-intl'
import DropDownInput from './DropDownInput/DropDownInput'
import { useState } from 'react'

export function FormApplication() {
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)
  const [isFacultyValid, setIsFacultyValid] = useState(false)

  const tFormApplication = useTranslations('form/application')
  const tCommon = useTranslations('common')

  const facultyKeys = [
    'GEOGRAPHY',
    'ECONOMICS',
    'HISTORY',
    'MECHMATH',
    'INFOTECH',
  ]

  const options = facultyKeys.map((key) => ({
    value: key,
    label: tCommon(`faculties.${key}`),
  }))

  const handleSelect = (value: string) => {
    setSelectedFaculty(value)
    setIsFacultyValid(true)
  }

  const handleValidate = (isValid: boolean) => {
    setIsFacultyValid(isValid)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isFacultyValid) {
      e.preventDefault()
      alert(tFormApplication('validation'))
    }
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
          options={options}
          onSelect={handleSelect}
          onValidate={handleValidate}
          placeholder={tFormApplication('placeholders.faculty')}
        />
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
            required
          />
          <div className={styles.uploadContent}>
            <UploadFile />
            <span className={styles.uploadText}>
              {tFormApplication(`placeholders.photo`)}
            </span>
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
