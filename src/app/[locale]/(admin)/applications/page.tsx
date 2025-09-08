'use client'

import ArrowTopIcon from '@/assets/image/icons/align-arrow-up-line.svg'
import CloseIcon from '@/assets/image/icons/form/close.svg'
import DeleteIcon from '@/assets/image/icons/form/delete.svg'
import EditIcon from '@/assets/image/icons/form/edit.svg'
import FilterIcon from '@/assets/image/icons/form/filter.svg'
import SearchIcon from '@/assets/image/icons/form/search.svg'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import {
  assignEmployeeToApplication,
  deleteApplication,
  getAdminApplications,
  removeEmployeeFromApplication,
  updateApplication,
} from '@/shared/api/applications'
import { getDepartments } from '@/shared/api/departments'
import { getAdminEmployees } from '@/shared/api/employees'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ApplicationForm } from './ApplicationForm/ApplicationForm'
import { AssignToApplication } from './AssignToApplication/AssignToApplication'
import { AssignedEmployees } from './AssignedEmployees/AssignedEmployees'
import HelpBubble from './HelpBubble/HelpBubble'
import styles from './page.module.scss'
import { useFocusTrap } from './useFocusTrap/useFocusTrap'

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

interface Employee {
  id: string
  fullName: string
}

export default function ApplicationsPage() {
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

  const [allEmployees, setAllEmployees] = useState<Employee[]>([])

  const tApplications = useTranslations('admin/applications')
  const locale = useLocale()

  const statusOptions = [
    { value: 'IN_QUEUE', label: tApplications('status.IN_QUEUE') },
    { value: 'IN_WORK', label: tApplications('status.IN_WORK') },
    { value: 'REJECTED', label: tApplications('status.REJECTED') },
    { value: 'DONE', label: tApplications('status.DONE') },
  ]

  const dialogIds = {
    delete: 'delete-dialog',
    deleteHeading: 'delete-dialog-title',
    deleteDesc: 'delete-dialog-desc',
    edit: 'edit-dialog',
    editHeading: 'edit-dialog-title',
    filter: 'filter-dialog',
    filterHeading: 'filter-dialog-title',
  }

  useEffect(() => {
    fetchApplications()
  }, [locale])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await getAdminEmployees({
          pageNumber: 0,
          pageSize: 10,
        })
        setAllEmployees(employees)
      } catch (err) {
        console.error('Failed to fetch employees', err)
      }
    }

    fetchEmployees()
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (deletePanel || editingApp || filterPanel) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [deletePanel, editingApp, filterPanel])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deletePanel) showDeletePanel(false)
        if (editingApp) setEditingApp(null)
        if (filterPanel) showFilterPanel(false)
      }
    },
    [deletePanel, editingApp, filterPanel],
  )

  useEffect(() => {
    if (deletePanel || editingApp || filterPanel) {
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }
  }, [deletePanel, editingApp, filterPanel, onKeyDown])

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

  const fetchApplications = async () => {
    try {
      const applications = await getAdminApplications({
        pageNumber: 0,
        pageSize: 10,
      })
      setApplications(applications)
      setOriginalApplications(applications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

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
      await deleteApplication(deleteId)
      setApplications((prev) => prev.filter((app) => app.id !== deleteId))
      showDeletePanel(false)
      setDeleteId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateApplication = async (updatedAppData: Application) => {
    try {
      await updateApplication({
        id: updatedAppData.id,
        applicantEmail: updatedAppData.applicantEmail,
        applicantName: updatedAppData.applicantName,
        departmentId: updatedAppData.departmentId,
        problemDescription: updatedAppData.problemDescription,
        status: updatedAppData.status,
      })

      await fetchApplications()
      setEditingApp(null)
    } catch (err) {
      console.error('Error while updating application', err)
    }
  }

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      const targetApp = applications.find((app) => app.id === applicationId)
      if (!targetApp) return

      const updatedApp = { ...targetApp, status: newStatus }

      await updateApplication({
        id: updatedApp.id,
        applicantEmail: updatedApp.applicantEmail,
        applicantName: updatedApp.applicantName,
        departmentId: updatedApp.departmentId,
        problemDescription: updatedApp.problemDescription,
        status: updatedApp.status,
      })

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updatedApp : app)),
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleUpdateAssignedEmployees = async (
    applicationId: string,
    employeeIds: string[],
  ) => {
    try {
      const results = await Promise.allSettled(
        employeeIds.map(async (employeeId) => {
          await assignEmployeeToApplication(applicationId, employeeId)
        }),
      )

      const rejected = results.filter((r) => r.status === 'rejected')
      if (rejected.length > 0) {
        console.error('Some assignments failed:', rejected)
      }

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId
            ? { ...app, assignedEmployeeIds: employeeIds }
            : app,
        ),
      )
    } catch (err) {
      console.error('Error assigning employees:', err)
    }
  }

  const handleRemoveEmployee = async (
    applicationId: string,
    employeeId: string,
  ) => {
    try {
      await removeEmployeeFromApplication(applicationId, employeeId)

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                assignedEmployeeIds: app.assignedEmployeeIds.filter(
                  (id) => id !== employeeId,
                ),
              }
            : app,
        ),
      )
    } catch (error) {
      console.error('Error removing assigned employee:', error)
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

    let departments: { id: string; name: { en: string; uk: string } }[] = []

    try {
      const departmentsData = await getDepartments({
        pageNumber: 0,
        pageSize: 100,
      })
      departments = departmentsData
    } catch (error) {
      console.error('Faculty retrieval error:', error)
    }

    const locale = document.documentElement.lang || 'en'

    const matchingDepartment = departments.find((dep) =>
      dep.name[locale as 'en' | 'uk']?.toLowerCase().includes(departmentText),
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
          <HelpBubble
            helpText={tApplications('searchHelpText')}
            ariaLabel={tApplications('aria-labels.searchHelp')}
            position='left'
          />

          <div
            className='searchContainer'
            role='search'
            aria-label={tApplications('header.search')}
          >
            <span aria-hidden='true'>
              <SearchIcon />
            </span>

            <input
              type='search'
              placeholder={tApplications('header.search')}
              className='searchInput'
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label={tApplications('header.search')}
            />

            {searchValue && (
              <button
                type='button'
                className='clearBtn'
                onClick={handleClear}
                aria-label={tApplications('aria-labels.clearSearch')}
              >
                <span aria-hidden='true'>
                  <CloseIcon />
                </span>
              </button>
            )}
          </div>

          <button
            className='mainBtn'
            onClick={() => showFilterPanel(true)}
            aria-controls={dialogIds.filter}
          >
            <span aria-hidden='true'>
              <FilterIcon />
            </span>

            {tApplications('header.filter')}
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <p role='status'>{tApplications('noResults')}</p>
      ) : (
        applications.map((app) => (
          <article key={app.id} className={styles.applicationArticle}>
            <section className={styles.applicationFormData}>
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

                <DropDownInput
                  options={statusOptions}
                  value={app.status}
                  onOpen={() => {}}
                  onSelect={(newStatus) => {
                    if (newStatus !== null) {
                      handleStatusChange(app.id, newStatus)
                    }
                  }}
                  placeholder={tApplications('status.placeholder')}
                  hasError={false}
                  status={
                    app.status as 'DONE' | 'REJECTED' | 'IN_WORK' | 'IN_QUEUE'
                  }
                />
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
                    aria-controls={dialogIds.edit}
                    aria-haspopup='dialog'
                  >
                    <span aria-hidden='true'>
                      <EditIcon />
                    </span>
                    {tApplications('buttons.edit')}
                  </button>

                  <button
                    className='mainBtnWhite'
                    type='button'
                    onClick={() => {
                      setDeleteId(app.id)
                      showDeletePanel(true)
                    }}
                    aria-controls={dialogIds.delete}
                    aria-haspopup='dialog'
                  >
                    <span aria-hidden='true'>
                      <DeleteIcon />
                    </span>
                    {tApplications('buttons.delete')}
                  </button>
                </div>
              </div>
            </section>

            <div className={styles.horizontalDivider} />

            <section className={styles.assignSection}>
              <AssignToApplication
                onAssign={(selected) => {
                  handleUpdateAssignedEmployees(
                    app.id,
                    selected.map((emp) => emp.id),
                  )
                }}
                placeholder={tApplications('assign')}
              />

              <h2 className={styles.heading}>
                {tApplications('assignedEmployees.heading')}
              </h2>

              <div className={styles.assignedEmployeesContainer}>
                <AssignedEmployees
                  app={app}
                  allEmployees={allEmployees}
                  onRemoveEmployee={handleRemoveEmployee}
                />
              </div>
            </section>
          </article>
        ))
      )}

      <div className={styles.toTopContainer}>
        <button
          type='button'
          className={styles.toTopParagraph}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={tApplications('top')}
        >
          <span aria-hidden='true'>
            <ArrowTopIcon />
          </span>
          <span>{tApplications('top')}</span>
        </button>
      </div>

      {deletePanel && (
        <div
          className={styles.deletePanelContainer}
          ref={deletePanelRef}
          role='dialog'
          aria-modal='true'
          id={dialogIds.delete}
          aria-labelledby={dialogIds.deleteHeading}
          aria-describedby={dialogIds.deleteDesc}
        >
          <div className={styles.deletePanel}>
            <div className={styles.deletePanelHeader}>
              <h2
                className={styles.deletePanelHeading}
                id={dialogIds.deleteHeading}
              >
                {tApplications('deletePanel.question')}
              </h2>
              <button
                type='button'
                className='closeBtn'
                onClick={() => showDeletePanel(false)}
                aria-label={tApplications('aria-labels.closeDialog')}
              >
                <span aria-hidden='true'>
                  <CloseIcon />
                </span>
              </button>
            </div>

            <p id={dialogIds.deleteDesc} className='sr-only'>
              {tApplications('aria-labels.deleteDialogDesc')}
            </p>

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
        <div
          className={styles.editPanelContainer}
          ref={editPanelRef}
          role='dialog'
          aria-modal='true'
          id={dialogIds.edit}
          aria-labelledby={dialogIds.editHeading}
        >
          <div className={styles.editPanel}>
            <div className={styles.header}>
              <h2 className={styles.heading} id={dialogIds.editHeading}>
                {tApplications('editPanel.heading')}
              </h2>
              <button
                type='button'
                className='closeBtn'
                onClick={() => setEditingApp(null)}
                aria-label={tApplications('aria-labels.closeDialog')}
              >
                <span aria-hidden='true'>
                  <CloseIcon />
                </span>
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
        <div
          className={styles.editPanelContainer}
          ref={filterPanelRef}
          role='dialog'
          aria-modal='true'
          id={dialogIds.filter}
          aria-labelledby={dialogIds.filterHeading}
        >
          <div className={styles.editPanel}>
            <div className={styles.header}>
              <h2 className={styles.heading} id={dialogIds.filterHeading}>
                {tApplications('filterPanel.heading')}
              </h2>
              <button
                type='button'
                className='closeBtn'
                onClick={() => showFilterPanel(false)}
                aria-label={tApplications('aria-labels.closeDialog')}
              >
                <span aria-hidden='true'>
                  <CloseIcon />
                </span>
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
