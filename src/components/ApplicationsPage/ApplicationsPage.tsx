'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Form from 'next/form'
import { FocusTrap } from './FocusTrap/FocusTrap'
import { ApplicationForm } from './ApplicationForm/ApplicationForm'
import ArrowTopIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import FilterIcon from '@/assets/image/icons/form/filter.svg'
import EditIcon from '@/assets/image/icons/form/edit.svg'
import DeleteIcon from '@/assets/image/icons/form/delete.svg'
import { useTranslations, useLocale } from 'next-intl'
import { Golos_Text } from 'next/font/google'
import styles from './ApplicationsPage.module.scss'

interface Application {
  id: string
  applicantName: {
    firstName: string
    middleName: string
    lastName: string
  }
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
  const [departmentName, setDepartmentName] = useState<string>('')

  const [deletePanel, showDeletePanel] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deletePanelRef = FocusTrap(deletePanel)

  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const editPanelRef = FocusTrap(Boolean(editingApp))

  const tApplications = useTranslations('admin/applications')
  const tFormApplication = useTranslations('form/application')
  const locale = useLocale()

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

        const departmentId = result.content[0].departmentId

        const secondResponse = await fetch(`${api}department/${departmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        setApplications(result.content)

        if (!secondResponse.ok) {
          throw new Error(`HTTP error! status: ${secondResponse.status}`)
        }

        const secondResult = await secondResponse.json()
        console.log('Second fetch success:', secondResult)

        setDepartmentName(secondResult.name[locale])
      } catch (error) {
        console.error('Error:', error)
      }
    }

    postData()
  }, [locale])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (deletePanel || editingApp) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [deletePanel, editingApp])

  function formatDate(arr: number[]): string {
    const [year, month, day] = arr
    const paddedDay = String(day).padStart(2, '0')
    const paddedMonth = String(month).padStart(2, '0')
    return `${paddedDay}.${paddedMonth}.${year}`
  }

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  const handleDeleteApplication = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(
        `${api}admin/application/${deleteId}/delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const resultText = await response.text()
      if (!response.ok) {
        console.error('❌ Delete failed:', response.status, resultText)
        throw new Error('Delete failed')
      }

      setApplications((prev) => prev.filter((app) => app.id !== deleteId))
      showDeletePanel(false)
      setDeleteId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateApplication = async (updatedAppData: Application) => {
    try {
      const response = await fetch(`${api}admin/application/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAppData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Update failed:', response.status, errorText)
        throw new Error(`Error updating: ${response.status}`)
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === updatedAppData.id ? updatedAppData : app,
        ),
      )

      setEditingApp(null)
    } catch (err) {
      console.error('Error while updating application', err)
    }
  }

  return (
    <section className={styles.applicationSection}>
      <div className={styles.headingContainer}>
        <h1 className={styles.heading}>
          {tApplications('header.application')}
        </h1>

        <div className={styles.searchFilterContainer}>
          <div className='searchContainer'>
            <SearchIcon />

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
                <CloseIcon />
              </button>
            )}
          </div>

          <button className='mainBtn'>
            <FilterIcon />

            {tApplications('header.filter')}
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <p>{tApplications('noResults')}</p>
      ) : (
        applications.map((app) => (
          <article key={app.id} className={styles.applicationArticle}>
            <div className={styles.applicationPhotoContainer}>
              <Image
                src={app.problemPhoto}
                alt='Фото проблемы'
                width={150}
                height={150}
                unoptimized
                className={styles.problemPhoto}
              />

              <div className={styles.applicationPhotoDates}>
                <p className={styles.photoDate}>
                  {tApplications('dateParas.create')}{' '}
                  <span className={styles.photoDateSpan}>
                    {formatDate(app.receivedAt)}
                  </span>
                </p>

                <p className={styles.photoDate}>
                  {tApplications('dateParas.update')}{' '}
                  <span className={styles.photoDateSpan}>
                    {formatDate(app.receivedAt)}
                  </span>
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            <Form action='form' className={styles.applicationForm}>
              <div className={styles.smallFieldWrapper}>
                <label className={styles.label} htmlFor={`fullname-${formId}`}>
                  <p className={styles.labelText}>
                    {tFormApplication(`labels.fullname`)}
                  </p>
                  <span className={styles.labelSpan}>*</span>
                </label>

                <div className={styles.inputWrapper}>
                  <input
                    type='text'
                    id={`fullname-${formId}`}
                    name='applicantName'
                    className='inputText'
                    value={[
                      app.applicantName.firstName,
                      app.applicantName.middleName,
                      app.applicantName.lastName,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled
                  />
                </div>
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
                    value={app.applicantEmail}
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

                <div className={styles.inputWrapper}>
                  <input
                    type='text'
                    id={`department-${formId}`}
                    name='departmentId'
                    value={departmentName}
                    className='inputText'
                    disabled
                  />
                </div>
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
                  value={app.problemDescription}
                  id={`description-${formId}`}
                  name='problemDescription'
                  className={`${styles.textArea} ${golos.variable}`}
                  disabled
                />
              </div>

              <div className={styles.buttonContainer}>
                <button
                  className='mainBtn'
                  type='button'
                  onClick={() => setEditingApp(app)}
                >
                  <EditIcon />
                  {tApplications('buttons.edit')}
                </button>

                <button
                  className='mainBtnWhite'
                  type='button'
                  onClick={() => {
                    setDeleteId(app.id)
                    showDeletePanel(true)
                  }}
                >
                  <DeleteIcon />
                  {tApplications('buttons.delete')}
                </button>
              </div>
            </Form>
          </article>
        ))
      )}

      <div
        className={styles.toTopContainer}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowTopIcon />
        <p className={styles.toTopParagraph}>{tApplications('top')}</p>
      </div>

      {deletePanel && (
        <div className={styles.deletePanelContainer} ref={deletePanelRef}>
          <div className={styles.deletePanel}>
            <div className={styles.deletePanelHeader}>
              <h1 className={styles.deletePanelHeading}>
                {tApplications('deletePanel.question')}
              </h1>
              <button
                type='button'
                className='closeBtn'
                onClick={() => showDeletePanel(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type='button'
                className={`mainBtn ${styles.centerText}`}
                onClick={handleDeleteApplication}
              >
                {tApplications('deletePanel.delete')}
              </button>

              <button
                type='button'
                className={`mainBtnWhite ${styles.centerText}`}
                onClick={() => {
                  showDeletePanel(false)
                  setDeleteId(null)
                }}
              >
                {tApplications('deletePanel.keep')}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingApp && (
        <ApplicationForm
          ref={editPanelRef}
          heading={tApplications('editPanel.heading')}
          buttonText={tApplications('editPanel.save')}
          initialData={editingApp}
          onClose={() => setEditingApp(null)}
          onSubmit={handleUpdateApplication}
        />
      )}
    </section>
  )
}
