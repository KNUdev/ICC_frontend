'use client'

import type { Department } from '@/app/[locale]/(public)/(home)/components/Form/form.interfaces'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import { getDepartmentById, getDepartments } from '@/shared/api/departments'
import { useLocale, useTranslations } from 'next-intl'
import { Golos_Text } from 'next/font/google'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  onChange?: (updatedData: Application) => void
}

export const ApplicationForm = ({
  formId,
  initialData,
  isDisabled,
  isDropDownInput,
  onChange,
}: ApplicationFormProps) => {
  const safeFormId = formId ?? 'application-form'

  const [formData, setFormData] = useState(initialData)
  const [departmentName, setDepartmentName] = useState('')

  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null,
  )
  const [departments, setDepartments] = useState<Department[]>([])
  const [dropdownError, setDropdownError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')

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
      const departments = await getDepartments({
        pageNumber: 0,
        pageSize: 10,
      })
      setDepartments(departments)
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
    const { firstName, middleName, lastName } = formData.applicantName
    const nameString = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(' ')
    setFullName(nameString)
  }, [formData.applicantName])

  const isInitial = useRef(true)

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }

    onChange?.(formData)
  }, [formData, onChange])

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
        const department = await getDepartmentById(formData.departmentId)
        setDepartmentName(department.name[locale as 'en' | 'uk'])
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

  const facultyErrorId = dropdownError
    ? `faculty-error-${safeFormId}`
    : undefined

  return (
    <form className={styles.formPanel} aria-describedby={facultyErrorId}>
      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor={`fullname-${formId}`}>
          <p className={styles.labelText}>
            {tFormApplication('labels.fullname')}
          </p>

          <span
            className={styles.labelSpan}
            aria-hidden='true'
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
            value={fullName}
            onChange={(e) => {
              const inputValue = e.target.value
              setFullName(inputValue)

              const [firstName = '', middleName = '', lastName = ''] =
                inputValue.trim().split(' ')
              setFormData((prev) => ({
                ...prev,
                applicantName: { firstName, middleName, lastName },
              }))
            }}
            className='inputText'
            disabled={isDisabled}
            autoComplete='name'
            inputMode='text'
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor={`email-${formId}`}>
          <p className={styles.labelText}>{tFormApplication('labels.email')}</p>

          <span
            className={styles.labelSpan}
            aria-hidden='true'
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
            autoComplete='email'
            inputMode='email'
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
            aria-hidden='true'
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

              if (value !== null) {
                setFormData((prev) => ({
                  ...prev,
                  departmentId: value,
                }))
              }

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
            aria-hidden='true'
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
