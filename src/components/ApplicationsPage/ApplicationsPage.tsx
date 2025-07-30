'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useFocusTrap } from './useFocusTrap/useFocusTrap'
import { ApplicationForm } from './ApplicationForm/ApplicationForm'
import ArrowTopIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import FilterIcon from '@/assets/image/icons/form/filter.svg'
import EditIcon from '@/assets/image/icons/form/edit.svg'
import DeleteIcon from '@/assets/image/icons/form/delete.svg'
import { useTranslations, useLocale } from 'next-intl'
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

const emptyApplication: Application = {
  id: '',
  applicantName: {
    firstName: '',
    middleName: '',
    lastName: '',
  },
  applicantEmail: '',
  receivedAt: [],
  completedAt: new Date().toISOString(),
  problemDescription: '',
  problemPhoto: '',
  status: 'IN_PROGRESS',
  departmentId: '',
  assignedEmployeeIds: [],
}

const api = process.env.NEXT_PUBLIC_API_URL

export function ApplicationsPage() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [applications, setApplications] = useState<Application[]>([])

  const [deletePanel, showDeletePanel] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deletePanelRef = useFocusTrap(deletePanel)

  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const editPanelRef = useFocusTrap(Boolean(editingApp))

  const [filterPanel, showFilterPanel] = useState(false)
  const filterPanelRef = useFocusTrap(filterPanel)

  const [editingAppData, setEditingAppData] = useState<Application | null>(null)

  const [originalApplications, setOriginalApplications] = useState<
    Application[]
  >([])

  const tApplications = useTranslations('admin/applications')
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

        setApplications(result.content)
        setOriginalApplications(result.content)
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

  useEffect(() => {
    const query = searchValue.toLowerCase()

    const filtered = originalApplications.filter((app) => {
      const fullName =
        `${app.applicantName.firstName} ${app.applicantName.middleName} ${app.applicantName.lastName}`.toLowerCase()
      const email = app.applicantEmail.toLowerCase()
      const description = app.problemDescription.toLowerCase()
      const departmentId = app.departmentId.toLowerCase()

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        description.includes(query) ||
        departmentId.includes(query)
      )
    })

    setApplications(filtered)
  }, [searchValue, originalApplications])

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
    console.log('Updating with:', updatedAppData)

    const formData = new FormData()

    formData.append('id', updatedAppData.id)
    formData.append('applicantEmail', updatedAppData.applicantEmail)
    formData.append('firstName', updatedAppData.applicantName.firstName)
    formData.append('middleName', updatedAppData.applicantName.middleName)
    formData.append('lastName', updatedAppData.applicantName.lastName)
    formData.append('departmentId', updatedAppData.departmentId)
    formData.append('problemDescription', updatedAppData.problemDescription)

    try {
      const response = await fetch(`${api}admin/application/update`, {
        method: 'PATCH',
        body: formData,
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

  const handleApplyFilter = async () => {
    const form = document.querySelector('.' + styles.editPanel + ' form')
    if (!form) return

    const fullName = (
      form.querySelector('[name="applicantName"]') as HTMLInputElement
    )?.value
      .trim()
      .toLowerCase()
    const [firstName = '', middleName = '', lastName = ''] = fullName.split(' ')

    const email = (
      form.querySelector('[name="applicantEmail"]') as HTMLInputElement
    )?.value
      .trim()
      .toLowerCase()

    const description = (
      form.querySelector('[name="problemDescription"]') as HTMLTextAreaElement
    )?.value
      .trim()
      .toLowerCase()

    const departmentText = (
      form.querySelector(
        'input[type="text"][placeholder*="faculty"]',
      ) as HTMLInputElement
    )?.value
      .trim()
      .toLowerCase()

    let departments: { id: string; name: Record<string, string> }[] = []

    try {
      const res = await fetch(`${api}department/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageNumber: 0, pageSize: 100 }),
      })

      if (!res.ok) throw new Error('Unable to retrieve list of faculties')
      const data = await res.json()
      departments = data.content
    } catch (error) {
      console.error('Faculty retrieval error:', error)
    }

    const locale = document.documentElement.lang || 'en'

    const matchingDepartment = departments.find((dep) =>
      dep.name[locale]?.toLowerCase().includes(departmentText),
    )

    const matchingDepartmentId = matchingDepartment?.id || null

    const filtered = applications.filter((app) => {
      const matchesName =
        app.applicantName.firstName.toLowerCase().includes(firstName) &&
        app.applicantName.middleName.toLowerCase().includes(middleName) &&
        app.applicantName.lastName.toLowerCase().includes(lastName)

      const matchesEmail = app.applicantEmail.toLowerCase().includes(email)
      const matchesDescription = app.problemDescription
        .toLowerCase()
        .includes(description)

      const matchesDepartment = matchingDepartmentId
        ? app.departmentId === matchingDepartmentId
        : true

      return (
        matchesName && matchesEmail && matchesDescription && matchesDepartment
      )
    })

    setApplications(filtered)
    showFilterPanel(false)
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

          <button className='mainBtn' onClick={() => showFilterPanel(true)}>
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
                alt={tApplications('problemPhotoName')}
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

            <div className={styles.applicationFormContainer}>
              <ApplicationForm
                initialData={app}
                formId={'default-form'}
                isDisabled={true}
                isDropDownInput={false}
              />

              <div className={styles.buttonContainer}>
                <button
                  className='mainBtn'
                  type='button'
                  onClick={() => {
                    setEditingApp(app)
                    setEditingAppData(app)
                  }}
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
            </div>
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
        <div className={styles.editPanelContainer} ref={editPanelRef}>
          <div className={styles.editPanel}>
            <div className={styles.header}>
              <h1 className={styles.heading}>
                {tApplications('editPanel.heading')}
              </h1>
              <button
                type='button'
                className='closeBtn'
                onClick={() => setEditingApp(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <ApplicationForm
              initialData={editingApp}
              isDisabled={false}
              isDropDownInput={true}
              formId='edit-form'
              onChange={(updated) => setEditingAppData(updated)}
            />

            <button
              className={`mainBtn ${styles.centerText}`}
              type='button'
              onClick={() =>
                editingAppData && handleUpdateApplication(editingAppData)
              }
            >
              {tApplications('editPanel.save')}
            </button>
          </div>
        </div>
      )}

      {filterPanel && (
        <div className={styles.editPanelContainer} ref={filterPanelRef}>
          <div className={styles.editPanel}>
            <div className={styles.header}>
              <h1 className={styles.heading}>
                {tApplications('filterPanel.heading')}
              </h1>
              <button
                type='button'
                className='closeBtn'
                onClick={() => showFilterPanel(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <ApplicationForm
              initialData={emptyApplication}
              isDisabled={false}
              isDropDownInput={true}
              formId='filter-form'
            />

            <button
              className={`mainBtn ${styles.centerText}`}
              type='button'
              onClick={handleApplyFilter}
            >
              {tApplications('filterPanel.apply')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
