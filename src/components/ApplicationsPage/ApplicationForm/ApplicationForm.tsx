'use client'

import { forwardRef, useState, useEffect } from 'react'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import { Golos_Text } from 'next/font/google'
import { useTranslations, useLocale } from 'next-intl'
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
  heading: string
  buttonText: string
  initialData: Application
  onSubmit: (data: Application) => Promise<void>
  onClose: () => void
  formId?: string
}

const api = process.env.NEXT_PUBLIC_API_URL

export const ApplicationForm = forwardRef<HTMLDivElement, ApplicationFormProps>(
  (
    {
      formId = 'application-form',
      heading,
      buttonText,
      initialData,
      onSubmit,
      onClose,
    },
    ref,
  ) => {
    const [formData, setFormData] = useState(initialData)
    const [departmentName, setDepartmentName] = useState('')

    const tFormApplication = useTranslations('form/application')

    const locale = useLocale()

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

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      await onSubmit(formData)
    }

    return (
      <div className={styles.editPanelContainer} ref={ref}>
        <form className={styles.editPanel} onSubmit={handleSubmit}>
          <div className={styles.header}>
            <h1 className={styles.heading}>{heading}</h1>
            <button type='button' className='closeBtn' onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

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
              />
            </div>
          </div>

          <div className={styles.smallFieldWrapper}>
            <label className={styles.label} htmlFor={`email-${formId}`}>
              <p className={styles.labelText}>
                {tFormApplication('labels.email')}
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
                value={formData.applicantEmail}
                onChange={handleChange}
                className='inputText'
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

            <div className={styles.inputWrapper}>
              <input
                type='text'
                id={`department-${formId}`}
                name='departmentId'
                value={departmentName}
                className='inputText'
                readOnly
              />
            </div>
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
              value={formData.problemDescription}
              onChange={handleChange}
              className={`${styles.textArea} ${golos.variable}`}
            />
          </div>

          <button className={`mainBtn ${styles.centerText}`} type='submit'>
            {buttonText}
          </button>
        </form>
      </div>
    )
  },
)

ApplicationForm.displayName = 'ApplicationForm'
