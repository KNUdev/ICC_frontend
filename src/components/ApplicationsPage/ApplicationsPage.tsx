'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Form from 'next/form'
import Search from '@/assets/image/icons/form/search.svg'
import Close from '@/assets/image/icons/form/close.svg'
import Filter from '@/assets/image/icons/form/filter.svg'
import Edit from '@/assets/image/icons/form/edit.svg'
import Delete from '@/assets/image/icons/form/delete.svg'
import { useTranslations } from 'next-intl'
import { Golos_Text } from 'next/font/google'
import styles from './ApplicationsPage.module.scss'

interface Application {
  id: string
  applicantName: string
  applicantEmail: string
  receivedAt: number[]
  completedAt: string
  problemDescription: string
  problemPhoto: string
  status: string
  departmentId: string
  assignedEmployeeIds: string[]
}

interface FormApplicationProps {
  formId?: string
}

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-golos',
  display: 'swap',
})

const api = process.env.NEXT_PUBLIC_API_URL

export function ApplicationsPage({
  formId = 'application-default',
}: FormApplicationProps) {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [applications, setApplications] = useState<Application[]>([])

  const tApplications = useTranslations('admin/applications')
  const tFormApplication = useTranslations('form/application')

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await fetch(`${api}admin/application/all`, {
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
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Success:', result)

        setApplications(result.content)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    postData()
  }, [])

  function formatDate(arr: number[]): string {
    const [year, month, day, hours, minutes] = arr
    const paddedDay = String(day).padStart(2, '0')
    const paddedMonth = String(month).padStart(2, '0')
    const paddedHours = String(hours).padStart(2, '0')
    const paddedMinutes = String(minutes).padStart(2, '0')
    return `${paddedDay}.${paddedMonth}.${year} ${paddedHours}:${paddedMinutes}`
  }

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  return (
    <section>
      <div className={styles.headingContainer}>
        <h1 className={styles.heading}>
          {tApplications('header.application')}
        </h1>

        <div className={styles.searchFilterContainer}>
          <div className='searchContainer'>
            <Search />

            <input
              type='search'
              placeholder={tApplications('header.search')}
              className='searchInput'
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {searchValue && (
              <button type='button' className='clearBtn' onClick={handleClear}>
                <Close />
              </button>
            )}
          </div>

          <button className='mainBtn'>
            <Filter />

            {tApplications('header.filter')}
          </button>
        </div>
      </div>

      <section className={styles.applicationsContainer}>
        {applications.length === 0 ? (
          <p>{tApplications('noResults')}</p>
        ) : (
          applications.map((app) => (
            <article key={app.id} className={styles.applicationContainer}>
              <div className={styles.applicationPhotoContainer}>
                {/* <Image
                  src={app.problemPhoto}
                  alt='Фото проблемы'
                  width={150}
                  height={150}
                /> */}

                <div className={styles.applicationPhotoDates}>
                  <p>
                    Created:
                    <strong> {formatDate(app.receivedAt)}</strong>
                  </p>

                  <p>
                    Updated:
                    <strong> {formatDate(app.receivedAt)}</strong>
                  </p>
                </div>
              </div>

              <div className={styles.divider} />

              <Form action='form' className={styles.applicationForm}>
                <div className={styles.smallFieldWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={`fullname-${formId}`}
                  >
                    <p className={styles.labelText}>
                      {tFormApplication(`labels.fullname`)}
                    </p>
                    <span className={styles.labelSpan}>*</span>
                  </label>
                </div>

                <div className={styles.inputWrapper}>
                  <input
                    type='text'
                    id={`applicantName-${formId}`}
                    name='applicantName'
                    placeholder='asdasdas' //TODO: change to {app.applicantName}
                    className='inputText'
                    disabled
                  />
                </div>

                <div className={styles.smallFieldWrapper}>
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
                      placeholder='' //TODO: change to {app.applicantEmail}
                      className='inputText'
                      disabled
                    />
                  </div>
                </div>

                <div className={styles.smallFieldWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={`department-${formId}`}
                  >
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

                  <input
                    type='text'
                    id={`department-${formId}`}
                    name='departmentId'
                    placeholder='' //TODO: for future, replace with faculty name which admin uses to see applications
                    className='inputText'
                    disabled
                  />
                </div>

                <div className={styles.bigFieldWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={`description-${formId}`}
                  >
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
                    placeholder='' //TODO: {app.problemDescription}
                    id={`description-${formId}`}
                    name='problemDescription'
                    className={`${styles.textArea} ${golos.variable}`}
                    disabled
                  />
                </div>

                <div className={styles.buttonContainer}>
                  <button className='mainBtn'>
                    <Edit />
                    {tApplications('buttons.edit')}
                  </button>

                  <button className='//TODO: make white mainBtn, separate styles'>
                    <Delete />
                    {tApplications('buttons.delete')}
                  </button>
                </div>
              </Form>
            </article>
          ))
        )}
      </section>
    </section>
  )
}
