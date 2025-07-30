'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Golos_Text } from 'next/font/google'
import { useTranslations, useLocale } from 'next-intl'
import type { Department } from '@/app/[locale]/(public)/(home)/components/Form/form.interfaces'
import DropDownInput from '@/common/components/Input/DropDownInput'
import styles from './ApplicationForm.module.scss'

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-golos',
})

interface Application {
  id: string
  applicantName: {
    firstName: string
    middleName: string
    lastName: string
  }
  applicantEmail: string
  completedAt: string
  problemDescription: string
  problemPhoto: string
  status: string
  departmentId: string
  receivedAt: number[]
  assignedEmployeeIds: string[]
}

interface ApplicationFormProps {
  initialData: Application
  formId?: string
  isDisabled: boolean
  isDropDownInput: boolean
}

const api = process.env.NEXT_PUBLIC_API_URL

export const ApplicationForm = ({
  formId,
  initialData,
  isDisabled,
  isDropDownInput,
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState(initialData)
  const [departmentName, setDepartmentName] = useState('')

  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null,
  )
  const [departments, setDepartments] = useState<Department[]>([])
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

  const fetchDepartments = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  useEffect(() => {
    if (initialData?.departmentId && departments.length > 0) {
      const exists = departments.some((d) => d.id === initialData.departmentId)
      if (exists) {
        setSelectedFacultyId(initialData.departmentId)
      }
    }
  }, [initialData, departments])

  useEffect(() => {
    if (!initialData) return

    setFormData(initialData)
  }, [initialData])

  useEffect(() => {
    async function fetchDepartmentName() {
      if (!formData.departmentId) return

      try {
        const res = await fetch(`${api}department/${formData.departmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) throw new Error('Failed to fetch department name')

        const data = await res.json()
        setDepartmentName(data.name[locale])
      } catch (error) {
        console.error(error)
        setDepartmentName('Unknown')
      }
    }

    fetchDepartmentName()
  }, [formData.departmentId, locale])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    if (name.startsWith('applicantName.')) {
      const key = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        applicantName: {
          ...prev.applicantName,
          [key]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <form className={styles.formPanel}>
      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor={`fullname-${formId}`}>
          <p className={styles.labelText}>
            {tFormApplication('labels.fullname')}
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
            id={`fullname-${formId}`}
            name='applicantName'
            placeholder={tFormApplication('placeholders.fullname')}
            value={`${formData.applicantName.firstName} ${formData.applicantName.middleName} ${formData.applicantName.lastName}`.trim()}
            onChange={(e) => {
              const [firstName = '', middleName = '', lastName = ''] =
                e.target.value.trim().split(' ')
              setFormData((prev) => ({
                ...prev,
                applicantName: { firstName, middleName, lastName },
              }))
            }}
            className='inputText'
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor={`email-${formId}`}>
          <p className={styles.labelText}>{tFormApplication('labels.email')}</p>

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
            placeholder={tFormApplication('placeholders.email')}
            value={formData.applicantEmail}
            onChange={handleChange}
            className='inputText'
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor={`department-${formId}`}>
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

        {isDropDownInput ? (
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
              setDropdownError(null)
            }}
            placeholder={tFormApplication('placeholders.faculty')}
            hasError={!!dropdownError}
            errorMessage={dropdownError}
          />
        ) : (
          <div className={styles.inputWrapper}>
            <input
              type='text'
              id={`department-${formId}`}
              name='departmentId'
              value={departmentName}
              className='inputText'
              readOnly
              disabled={isDisabled}
            />
          </div>
        )}
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor={`description-${formId}`}>
          <p className={styles.labelText}>
            {tFormApplication('labels.description')}
          </p>

          <span
            className={styles.labelSpan}
            title={tFormApplication('required')}
          >
            *
          </span>
        </label>

        <textarea
          name='problemDescription'
          id={`description-${formId}`}
          placeholder={tFormApplication('placeholders.description')}
          value={formData.problemDescription}
          onChange={handleChange}
          className={`${styles.textArea} ${golos.variable}`}
          disabled={isDisabled}
        />
      </div>
    </form>
  )
}

ApplicationForm.displayName = 'ApplicationForm'
