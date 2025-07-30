'use client'

import React, { useState, useRef, useEffect } from 'react'
import ScrollUp from '@/common/components/Input/ScrollUp/ScrollUp'
import Select from '@/common/components/Input/Select/Select'
import styles from './page.module.scss'

const DownloadIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 22L5 15L6.4 13.575L11 18.175V11H13V18.175L17.6 13.6L19 15L12 22ZM11 9V6H13V9H11ZM11 4V2H13V4H11Z'
      fill='#FF525E'
    />
  </svg>
)

interface Report {
  id: string
  type: string
  info: string
  format: string
  sector: string
  dateFrom: string
  dateTo: string
  applicationStatus: string
}

const ReportsPage = () => {
  const [reportType, setReportType] = useState('')
  const [reportFormat, setReportFormat] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('')
  const [reports, setReports] = useState<Report[]>([])

  const [errors, setErrors] = useState({
    reportType: '',
    reportFormat: '',
    selectedSector: '',
    dateFrom: '',
    dateTo: '',
    applicationStatus: '',
  })

  const tableBodyContainerRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  const reportTypeOptions = [
    'Звіт по всіх робітників',
    'Звіт по сектору',
    'Звіт по заявкам на роботу',
  ]

  const reportFormatOptions = ['PDF', 'Excel', 'CSV', 'XML']

  const sectorOptions = [
    'Оператор машинного відділу',
    'Frontend розробник',
    'Backend розробник',
    'iOS розробник',
    'Android розробник',
  ]

  const applicationStatusOptions = [
    'Нові заявки',
    'В обробці',
    'Прийняті',
    'Відхилені',
    'Всі статуси',
  ]

  useEffect(() => {
    const updateScrollState = () => {
      if (tableBodyContainerRef.current) {
        const container = tableBodyContainerRef.current
        const { scrollTop, scrollHeight, clientHeight } = container

        const scrollable = scrollHeight > clientHeight
        setIsScrollable(scrollable)

        if (scrollable) {
          container.classList.add(styles.scrollable)

          const isScrolledToBottom =
            scrollTop + clientHeight >= scrollHeight - 10

          if (isScrolledToBottom) {
            container.classList.add(styles.scrolledToBottom)
          } else {
            container.classList.remove(styles.scrolledToBottom)
          }
        } else {
          container.classList.remove(styles.scrollable)
          container.classList.remove(styles.scrolledToBottom)
        }
      }
    }

    updateScrollState()

    const container = tableBodyContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollState)

      return () => {
        container.removeEventListener('scroll', updateScrollState)
      }
    }
  }, [reports])

  const getReportInfo = () => {
    switch (reportType) {
      case 'Звіт по всіх робітників':
        return '-'

      case 'Звіт по сектору':
        return selectedSector

      case 'Звіт по заявкам на роботу':
        return `${dateFrom} - ${dateTo}, ${applicationStatus}, ${selectedSector}`

      default:
        return '-'
    }
  }

  const validateForm = () => {
    const newErrors = {
      reportType: '',
      reportFormat: '',
      selectedSector: '',
      dateFrom: '',
      dateTo: '',
      applicationStatus: '',
    }

    let isValid = true

    if (!reportType) {
      newErrors.reportType = 'Потрібно обрати тип звіту'
      isValid = false
    }

    if (!reportFormat) {
      newErrors.reportFormat = 'Потрібно обрати формат звіту'
      isValid = false
    }

    switch (reportType) {
      case 'Звіт по всіх робітників':
        break

      case 'Звіт по сектору':
        if (!selectedSector) {
          newErrors.selectedSector = 'Потрібно обрати сектор'
          isValid = false
        }
        break

      case 'Звіт по заявкам на роботу':
        if (!dateFrom) {
          newErrors.dateFrom = 'Потрібно обрати дату початку'
          isValid = false
        }
        if (!dateTo) {
          newErrors.dateTo = 'Потрібно обрати дату закінчення'
          isValid = false
        }
        if (!applicationStatus) {
          newErrors.applicationStatus = 'Потрібно обрати статус заявок'
          isValid = false
        }
        if (!selectedSector) {
          newErrors.selectedSector = 'Потрібно обрати сектор'
          isValid = false
        }
        break

      default:
        newErrors.reportType = 'Невідомий тип звіту'
        isValid = false
        break
    }

    setErrors(newErrors)
    return isValid
  }

  const createSelectHandler =
    (setter: (value: string) => void, field: string) => (value: string) => {
      setter(value)
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const createDateHandler =
    (setter: (value: string) => void, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const clearForm = () => {
    setReportType('')
    setReportFormat('')
    setSelectedSector('')
    setDateFrom('')
    setDateTo('')
    setApplicationStatus('')
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType,
      format: reportFormat,
      info: getReportInfo(),
      sector: selectedSector,
      dateFrom,
      dateTo,
      applicationStatus,
    }

    setReports([...reports, newReport])
    clearForm()
  }

  const handleReportTypeChange = createSelectHandler(
    setReportType,
    'reportType',
  )
  const handleReportFormatChange = createSelectHandler(
    setReportFormat,
    'reportFormat',
  )
  const handleSelectedSectorChange = createSelectHandler(
    setSelectedSector,
    'selectedSector',
  )
  const handleApplicationStatusChange = createSelectHandler(
    setApplicationStatus,
    'applicationStatus',
  )

  const handleDateFromChange = createDateHandler(setDateFrom, 'dateFrom')
  const handleDateToChange = createDateHandler(setDateTo, 'dateTo')

  const handleDownloadReport = (report: Report) => {
    console.log('Завантаження звіту:', report)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>СТВОРИТИ ЗВІТ</h1>
        <p className={styles.subtitle}>
          На цій сторінці ви можете створити новий звіт, вказавши його тип,
          формат та необхідні параметри. Усі обов&apos;язкові поля позначені, а
          створені звіти можна завантажити пізніше.
        </p>
      </div>

      <div className={styles.headerToFormGap}></div>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
          <div className={styles.mainFormRow}>
            <div className={styles.leftColumn}>
              <div className={styles.inputGroup}>
                <Select
                  title='Тип звіту'
                  placeholder='Оберіть тип звіту'
                  options={reportTypeOptions}
                  isRequired={true}
                  value={reportType}
                  onChange={handleReportTypeChange}
                />
                {errors.reportType && (
                  <div className={styles.errorMessage}>{errors.reportType}</div>
                )}
              </div>

              {reportType === 'Звіт по сектору' && (
                <div className={styles.inputGroup}>
                  <Select
                    title='Обрати сектор'
                    placeholder='Оберіть сектор'
                    options={sectorOptions}
                    isRequired={true}
                    value={selectedSector}
                    onChange={handleSelectedSectorChange}
                  />
                  {errors.selectedSector && (
                    <div className={styles.errorMessage}>
                      {errors.selectedSector}
                    </div>
                  )}
                </div>
              )}

              {reportType === 'Звіт по заявкам на роботу' && (
                <>
                  <div className={styles.dateRow}>
                    <div className={styles.dateColumn}>
                      <label className={styles.label}>З якого числа</label>
                      <input
                        type='date'
                        className={`${styles.dateInput} ${
                          errors.dateFrom ? styles.dateInputError : ''
                        }`}
                        value={dateFrom}
                        onChange={handleDateFromChange}
                      />
                      {errors.dateFrom && (
                        <div className={styles.errorMessage}>
                          {errors.dateFrom}
                        </div>
                      )}
                    </div>
                    <div className={styles.dateColumn}>
                      <label className={styles.label}>По яке число</label>
                      <input
                        type='date'
                        className={`${styles.dateInput} ${
                          errors.dateTo ? styles.dateInputError : ''
                        }`}
                        value={dateTo}
                        onChange={handleDateToChange}
                      />
                      {errors.dateTo && (
                        <div className={styles.errorMessage}>
                          {errors.dateTo}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <Select
                      title='Обрати статус заявок'
                      placeholder='Оберіть статус заявок'
                      options={applicationStatusOptions}
                      isRequired={true}
                      value={applicationStatus}
                      onChange={handleApplicationStatusChange}
                    />
                    {errors.applicationStatus && (
                      <div className={styles.errorMessage}>
                        {errors.applicationStatus}
                      </div>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <Select
                      title='Обрати сектор'
                      placeholder='Оберіть сектор'
                      options={sectorOptions}
                      isRequired={true}
                      value={selectedSector}
                      onChange={handleSelectedSectorChange}
                    />
                    {errors.selectedSector && (
                      <div className={styles.errorMessage}>
                        {errors.selectedSector}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.inputGroup}>
                <Select
                  title='Формат звіту'
                  placeholder='Оберіть формат звіту'
                  options={reportFormatOptions}
                  isRequired={true}
                  value={reportFormat}
                  onChange={handleReportFormatChange}
                />
                {errors.reportFormat && (
                  <div className={styles.errorMessage}>
                    {errors.reportFormat}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className={styles.submitButton} onClick={handleSubmit}>
            Створити звіт
          </button>
        </div>
      </div>

      <div className={styles.formToSectorsGap}></div>

      <div className={styles.sectorsSection}>
        <div className={styles.sectorsHeader}>
          <h2 className={styles.sectorsTitle}>СПИСОК СТВОРЕНИХ ЗВІТІВ</h2>
        </div>

        <div className={styles.sectorsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Тип звіту</div>
            <div className={styles.headerCell}>Основна інформація</div>
            <div className={styles.headerCell}>Формат</div>
            <div className={styles.headerCell}></div>
          </div>

          {reports.length > 0 ? (
            <div
              className={styles.tableBodyContainer}
              ref={tableBodyContainerRef}
            >
              <div className={styles.tableBody}>
                {reports.map((report, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>{report.type}</div>
                    <div className={styles.tableCell}>{report.info}</div>
                    <div className={styles.tableCell}>{report.format}</div>
                    <div className={styles.tableActions}>
                      <button
                        className={styles.downloadButton}
                        onClick={() => handleDownloadReport(report)}
                      >
                        <DownloadIcon />
                        <span>Завантажити звіт</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>
                Поки що нічого не додано :(
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.scrollUpContainer}>
        <ScrollUp />
      </div>
    </div>
  )
}

export default ReportsPage
