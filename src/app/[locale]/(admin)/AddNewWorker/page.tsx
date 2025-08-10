'use client'

import { FieldError } from '@/common/components/FieldError/FieldError'
import DropDownInput from '@/common/components/Input/DropDownInput/DropDownInput'
import { API } from '@/shared/config/api.config'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import styles from './page.module.scss'

interface Specialty {
  id: string
  name: {
    en: string
    uk: string
  }
}

interface Sector {
  id: string
  name: {
    en: string
    uk: string
  }
}

const AddNewWorker = () => {
  const t = useTranslations('AddNewWorker/common')
  const locale = useLocale()
  const [hasPhoto, setHasPhoto] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(
    null,
  )
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [dropdownErrors, setDropdownErrors] = useState<{
    specialty?: string
    sector?: string
  }>({})
  const [formErrors, setFormErrors] = useState<{
    firstName?: string
    lastName?: string
    middleName?: string
    email?: string
    phone?: string
    phoneNumber?: string
    salary?: string
    salaryInUAH?: string
    photo?: string
    specialty?: string
    sector?: string
    role?: string
    workHours?: string
    startTime?: string
    endTime?: string
    contractEndDate?: string
  }>({})

  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false)

  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('18:00')

  const addMinutes = useCallback((time: string, minutes: number) => {
    if (!time) return time
    const [h, m] = time.split(':').map((n) => parseInt(n || '0', 10))
    const d = new Date(2000, 0, 1, h || 0, m || 0, 0)
    d.setMinutes(d.getMinutes() + minutes)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }, [])

  const getTomorrowLocalDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const roleOptions = [
    { value: 'COMMON_USER', label: t('role.options.commonUser') },
    { value: 'SECRETARY', label: t('role.options.secretary') },
    { value: 'SITE_MANAGER', label: t('role.options.siteManager') },
    { value: 'HEAD_MANAGER', label: t('role.options.headManager') },
  ]

  const specialtyOptions = useMemo(
    () =>
      specialties.map((specialty) => ({
        value: specialty.id,
        label: specialty.name[locale as 'en' | 'uk'],
      })),
    [specialties, locale],
  )

  const sectorOptions = useMemo(
    () =>
      sectors.map((sector) => ({
        value: sector.id,
        label: sector.name[locale as 'en' | 'uk'],
      })),
    [sectors, locale],
  )

  const clearFieldError = (fieldName: keyof typeof formErrors) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const fetchSpecialties = useCallback(async () => {
    try {
      const response = await fetch(`${API}admin/specialty/getAll`, {
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
        throw new Error('Failed to fetch specialties')
      }

      const data = await response.json()
      setSpecialties(data.content)
      setDropdownErrors((prev) => ({ ...prev, specialty: undefined }))
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        setDropdownErrors((prev) => ({
          ...prev,
          specialty: 'Failed to load specialties',
        }))
      }
    }
  }, [])

  const fetchSectors = useCallback(async () => {
    try {
      const response = await fetch(`${API}admin/sector/all`, {
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
        throw new Error('Failed to fetch sectors')
      }

      const data = await response.json()
      setSectors(data.content)
      setDropdownErrors((prev) => ({ ...prev, sector: undefined }))
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        setDropdownErrors((prev) => ({
          ...prev,
          sector: 'Failed to load sectors',
        }))
      }
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    setHasSubmittedOnce(true)

    const form = event.currentTarget
    const formData = new FormData()

    const firstName = (
      form.querySelector('input[name="firstName"]') as HTMLInputElement
    )?.value
    const lastName = (
      form.querySelector('input[name="lastName"]') as HTMLInputElement
    )?.value
    const middleName = (
      form.querySelector('input[name="middleName"]') as HTMLInputElement
    )?.value
    const email = (
      form.querySelector('input[name="email"]') as HTMLInputElement
    )?.value
    const phoneNumber = (
      form.querySelector('input[name="phoneNumber"]') as HTMLInputElement
    )?.value
    const salaryInUAH = (
      form.querySelector('input[name="salaryInUAH"]') as HTMLInputElement
    )?.value
    const isStudent = (
      form.querySelector('input[name="isStudent"]') as HTMLInputElement
    )?.checked
    const formStartTime = (
      form.querySelector('input[name="startTime"]') as HTMLInputElement
    )?.value
    const formEndTime = (
      form.querySelector('input[name="endTime"]') as HTMLInputElement
    )?.value
    const contractEndDate = (
      form.querySelector('input[name="contractEndDate"]') as HTMLInputElement
    )?.value

    const formatTimeToHHmmss = (timeValue: string) => {
      if (!timeValue) return ''
      const [hours, minutes] = timeValue.split(':')
      return `${hours}:${minutes}:00`
    }

    const chosenStart = (formStartTime || startTime || '').slice(0, 5)
    const chosenEnd = (formEndTime || endTime || '').slice(0, 5)
    const formattedStartTime = formatTimeToHHmmss(chosenStart)
    const formattedEndTime = formatTimeToHHmmss(chosenEnd)

    const errors: typeof formErrors = {}
    if (!firstName) errors.firstName = t('errors.firstName')
    if (!lastName) errors.lastName = t('errors.lastName')
    if (!middleName) errors.middleName = t('errors.middleName')
    if (!email) {
      errors.email = t('errors.email')
    } else if (!email.endsWith('@knu.ua')) {
      errors.email = t('errors.emailKnuOnly')
    }
    if (!photoFile) errors.photo = t('errors.photo')
    if (!selectedSpecialtyId) errors.specialty = t('errors.specialty')
    if (!selectedSectorId) errors.sector = t('errors.sector')
    if (!selectedRole) errors.role = t('errors.role')
    if (!contractEndDate) errors.contractEndDate = t('errors.contractEndDate')

    if (chosenStart && chosenEnd && chosenEnd <= chosenStart) {
      errors.endTime = 'End time must be after start time'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      formData.append('fullName.firstName', firstName || '')
      formData.append('fullName.lastName', lastName || '')
      formData.append('fullName.middleName', middleName || '')
      formData.append('email', email || '')
      const sanitizedPhone = (phoneNumber || '').trim().replace(/^\+/, '')
      formData.append('phoneNumber', sanitizedPhone)
      formData.append('salaryInUAH', salaryInUAH || '0')
      formData.append('isStudent', isStudent?.toString() || 'false')
      formData.append('specialty.id', selectedSpecialtyId || '')
      formData.append('sector.id', selectedSectorId || '')
      formData.append('role', selectedRole || '')
      formData.append('workHours.startTime', formattedStartTime)
      formData.append('workHours.endTime', formattedEndTime)
      formData.append('contractEndDate', contractEndDate || '')

      if (photoFile) {
        formData.append('avatarFile', photoFile)
      }

      const response = await fetch(`${API}admin/employee/create`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setShowSuccessModal(true)
        form.reset()
        setHasPhoto(false)
        setPhotoFile(null)
        setPhotoPreview(null)
        setSelectedSpecialtyId(null)
        setSelectedSectorId(null)
        setSelectedRole(null)
        setFormErrors({})
        setHasSubmittedOnce(false)
      } else {
        const errorData = await response.json()

        if (errorData.fieldErrors) {
          const apiErrors: typeof formErrors = {}

          const fieldMapping: Record<string, keyof typeof formErrors> = {
            firstName: 'firstName',
            lastName: 'lastName',
            middleName: 'middleName',
            email: 'email',
            phoneNumber: 'phoneNumber',
            salaryInUAH: 'salaryInUAH',
            specialty: 'specialty',
            sector: 'sector',
            role: 'role',
            'workHours.startTime': 'startTime',
            'workHours.endTime': 'endTime',
            contractEndDate: 'contractEndDate',
          }

          Object.entries(errorData.fieldErrors).forEach(
            ([apiField, errorMessage]) => {
              const formField = fieldMapping[apiField]
              if (formField && typeof errorMessage === 'string') {
                apiErrors[formField] = errorMessage
              }
            },
          )

          setFormErrors(apiErrors)
        } else {
          throw new Error(
            errorData.message || t('errors.failedToCreateEmployee'),
          )
        }
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      setFormErrors({
        email:
          error instanceof Error
            ? error.message
            : t('errors.failedToCreateEmployee'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setHasPhoto(true)
      clearFieldError('photo')

      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = () => {
    setHasPhoto(false)
    setPhotoFile(null)
    setPhotoPreview(null)

    const fileInput = document.getElementById(
      'photo-upload',
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleChangePhoto = () => {
    const fileInput = document.getElementById(
      'photo-upload',
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStartTime(value)
    clearFieldError('startTime')
    if (endTime && value && endTime <= value) {
      setEndTime(addMinutes(value, 1))
    }
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    clearFieldError('endTime')
    if (startTime && value && value <= startTime) {
      setEndTime(addMinutes(startTime, 1))
    } else {
      setEndTime(value)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <div className={styles.startpage}>
          <div className={styles.content}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.description}>{t('description')}</p>
          </div>
        </div>

        <div className={styles.pagecontin}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              <div className={styles.formSection}>
                <div className={styles.sectionContent}>
                  <div className={styles.photoSection}>
                    <h3>{t('photo.title')}</h3>
                    <div className={styles.photoUpload}>
                      <div className={styles.photoPlaceholder}>
                        {hasPhoto && photoPreview ? (
                          <Image
                            src={photoPreview}
                            alt='Photo preview'
                            width={150}
                            height={150}
                            className={styles.photoPreviewImg}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='80'
                            height='81'
                            viewBox='0 0 80 81'
                            fill='none'
                          >
                            <path
                              d='M40 40.5C36.3333 40.5 33.1945 39.1945 30.5833 36.5833C27.9722 33.9722 26.6667 30.8333 26.6667 27.1667C26.6667 23.5 27.9722 20.3611 30.5833 17.75C33.1945 15.1389 36.3333 13.8333 40 13.8333C43.6667 13.8333 46.8056 15.1389 49.4167 17.75C52.0278 20.3611 53.3333 23.5 53.3333 27.1667C53.3333 30.8333 52.0278 33.9722 49.4167 36.5833C46.8056 39.1945 43.6667 40.5 40 40.5ZM13.3333 67.1667V57.8333C13.3333 55.9445 13.8195 54.2083 14.7917 52.625C15.7639 51.0417 17.0556 49.8333 18.6667 49C22.1111 47.2778 25.6111 45.9861 29.1667 45.125C32.7222 44.2639 36.3333 43.8333 40 43.8333C43.6667 43.8333 47.2778 44.2639 50.8333 45.125C54.3889 45.9861 57.8889 47.2778 61.3333 49C62.9445 49.8333 64.2361 51.0417 65.2083 52.625C66.1806 54.2083 66.6667 55.9445 66.6667 57.8333V67.1667H13.3333Z'
                              fill='#6D6D6D'
                            />
                          </svg>
                        )}
                      </div>

                      <input
                        type='file'
                        id='photo-upload'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                      />

                      <button
                        type='button'
                        className={styles.uploadBtn}
                        onClick={
                          hasPhoto
                            ? handleChangePhoto
                            : () => {
                                const fileInput = document.getElementById(
                                  'photo-upload',
                                ) as HTMLInputElement
                                if (fileInput) {
                                  fileInput.click()
                                }
                              }
                        }
                      >
                        {hasPhoto ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='19'
                            viewBox='0 0 20 19'
                            fill='none'
                            className={styles.uploadIcon}
                          >
                            <path
                              d='M0.5 19V14.75L15.125 0.174988L19.3 4.44999L4.75 19H0.5ZM15.1 5.79999L16.5 4.39999L15.1 2.99999L13.7 4.39999L15.1 5.79999Z'
                              fill='white'
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='25'
                            height='24'
                            viewBox='0 0 25 24'
                            fill='none'
                            className={styles.uploadIcon}
                          >
                            <path
                              d='M11.5 16V6.85L8.4 9.95L7 8.55L12.5 3.05L18 8.55L16.6 9.95L13.5 6.85V16H11.5ZM6.5 20C5.95 20 5.479 19.804 5.087 19.412C4.695 19.02 4.499 18.549 4.5 18V14.35H6.5V18H18.5V14.35H20.5V18C20.5 18.55 20.304 19.021 19.912 19.413C19.52 19.805 19.049 20.001 18.5 20H6.5Z'
                              fill='white'
                            />
                          </svg>
                        )}
                        {hasPhoto
                          ? t('photo.changeButton')
                          : t('photo.uploadButton')}
                      </button>
                      {hasPhoto && (
                        <button
                          type='button'
                          className={styles.deleteBtn}
                          onClick={handleDeletePhoto}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            className={styles.deleteIcon}
                          >
                            <path
                              d='M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z'
                              fill='#D32F2F'
                            />
                          </svg>
                          {t('photo.deleteButton')}
                        </button>
                      )}
                    </div>
                    <FieldError
                      error={hasSubmittedOnce ? formErrors.photo : undefined}
                    />
                  </div>

                  <div className={styles.sectionDivider}></div>

                  <div className={styles.generalInfo}>
                    <h3>{t('generalInfo.title')}</h3>
                    <div className={styles.inputsContainer}>
                      <div className={styles.inputGroup}>
                        <div className={styles.inputRow}>
                          <div className={styles.inputGroup}>
                            <label>{t('generalInfo.firstNameLabel')}</label>
                            <div className={styles.fieldWrapper}>
                              <div className={styles.inputWrapper}>
                                <input
                                  type='text'
                                  name='firstName'
                                  placeholder={t('generalInfo.firstName')}
                                  className='inputText'
                                  onChange={() => clearFieldError('firstName')}
                                />
                              </div>
                              <FieldError
                                error={
                                  hasSubmittedOnce
                                    ? formErrors.firstName
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.inputGroup}>
                            <label>{t('generalInfo.lastNameLabel')}</label>
                            <div className={styles.fieldWrapper}>
                              <div className={styles.inputWrapper}>
                                <input
                                  type='text'
                                  name='lastName'
                                  placeholder={t('generalInfo.lastName')}
                                  className='inputText'
                                  onChange={() => clearFieldError('lastName')}
                                />
                              </div>
                              <FieldError
                                error={
                                  hasSubmittedOnce
                                    ? formErrors.lastName
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.inputGroup}>
                            <label>{t('generalInfo.middleNameLabel')}</label>
                            <div className={styles.fieldWrapper}>
                              <div className={styles.inputWrapper}>
                                <input
                                  type='text'
                                  name='middleName'
                                  placeholder={t('generalInfo.middleName')}
                                  className='inputText'
                                  onChange={() => clearFieldError('middleName')}
                                />
                              </div>
                              <FieldError
                                error={
                                  hasSubmittedOnce
                                    ? formErrors.middleName
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <div className={styles.checkboxRow}>
                          <div className={styles.checkboxGroup}>
                            <input
                              type='checkbox'
                              id='isStudent'
                              name='isStudent'
                              className={styles.checkbox}
                            />
                            <label
                              htmlFor='isStudent'
                              className={styles.checkboxLabel}
                            >
                              {t('generalInfo.isStudent')}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <div className={styles.inputRow}>
                          <div className={styles.inputGroup}>
                            <label>{t('generalInfo.emailLabel')}</label>
                            <div className={styles.fieldWrapper}>
                              <div className={styles.inputWrapper}>
                                <input
                                  type='email'
                                  name='email'
                                  placeholder={t('generalInfo.email')}
                                  className='inputText'
                                  onChange={() => clearFieldError('email')}
                                />
                              </div>
                              <FieldError
                                error={
                                  hasSubmittedOnce
                                    ? formErrors.email
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles.inputRow}>
                          <div className={styles.inputGroup}>
                            <label>{t('generalInfo.phoneLabel')}</label>
                            <div className={styles.fieldWrapper}>
                              <div className={styles.inputWrapper}>
                                <input
                                  type='tel'
                                  name='phoneNumber'
                                  placeholder={t(
                                    'generalInfo.phonePlaceholder',
                                  )}
                                  className='inputText'
                                  inputMode='tel'
                                  pattern='\+?\d*'
                                  onChange={() =>
                                    clearFieldError('phoneNumber')
                                  }
                                />
                              </div>
                              <FieldError
                                error={
                                  hasSubmittedOnce
                                    ? formErrors.phone || formErrors.phoneNumber
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionDividerHorizontal}></div>

              <div className={styles.formSection}>
                <div className={styles.sectionContent}>
                  <div className={styles.salarySection}>
                    <h3>{t('salary.title')}</h3>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label>{t('salary.label')}</label>
                        <div className={styles.fieldWrapper}>
                          <div className={styles.inputWrapper}>
                            <input
                              type='number'
                              name='salaryInUAH'
                              placeholder={t('salary.placeholder')}
                              className='inputText'
                              onChange={() => clearFieldError('salary')}
                            />
                          </div>
                          <FieldError
                            error={
                              hasSubmittedOnce
                                ? formErrors.salary || formErrors.salaryInUAH
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.sectionDivider}></div>

                  <div className={styles.specialtySection}>
                    <h3>{t('specialty.title')}</h3>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label>{t('specialty.specialtyLabel')}</label>
                        <div className={styles.fieldWrapper}>
                          <DropDownInput
                            options={specialtyOptions}
                            value={selectedSpecialtyId}
                            onOpen={() => {
                              if (specialties.length === 0) {
                                fetchSpecialties()
                              }
                            }}
                            onSelect={(value) => {
                              setSelectedSpecialtyId(value)
                              clearFieldError('specialty')
                            }}
                            placeholder={t('specialty.specialtyPlaceholder')}
                            hasError={
                              !!dropdownErrors.specialty ||
                              !!formErrors.specialty
                            }
                            errorMessage={
                              dropdownErrors.specialty || formErrors.specialty
                            }
                          />
                          <FieldError
                            error={
                              hasSubmittedOnce
                                ? formErrors.specialty
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <label>{t('specialty.sectorLabel')}</label>
                        <div className={styles.fieldWrapper}>
                          <DropDownInput
                            options={sectorOptions}
                            value={selectedSectorId}
                            onOpen={() => {
                              if (sectors.length === 0) {
                                fetchSectors()
                              }
                            }}
                            onSelect={(value) => {
                              setSelectedSectorId(value)
                              clearFieldError('sector')
                            }}
                            placeholder={t('specialty.sectorPlaceholder')}
                            hasError={
                              !!dropdownErrors.sector || !!formErrors.sector
                            }
                            errorMessage={
                              dropdownErrors.sector || formErrors.sector
                            }
                          />
                          <FieldError
                            error={
                              hasSubmittedOnce ? formErrors.sector : undefined
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.sectionDivider}></div>

                    <div className={styles.roleSection}>
                      <h3>{t('role.title')}</h3>
                      <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                          <label>{t('role.label')}</label>
                          <div className={styles.fieldWrapper}>
                            <DropDownInput
                              options={roleOptions}
                              value={selectedRole}
                              onOpen={() => {}}
                              onSelect={(value) => {
                                setSelectedRole(value)
                                clearFieldError('role')
                              }}
                              placeholder={t('role.placeholder')}
                              hasError={!!formErrors.role}
                              errorMessage={formErrors.role}
                            />
                            <FieldError
                              error={
                                hasSubmittedOnce ? formErrors.role : undefined
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionDividerHorizontal}></div>

              <div className={styles.formSection}>
                <div className={`${styles.sectionContent} ${styles.fullWidth}`}>
                  <div className={styles.workingHours}>
                    <h3>{t('workingHours.title')}</h3>
                    <div className={styles.inputRow}>
                      <div className={styles.inputField}>
                        <div className={styles.fieldLabel}>
                          {t('workingHours.fromLabel')}
                        </div>
                        <div className={styles.fieldWrapper}>
                          <div className={styles.inputWrapper}>
                            <input
                              type='time'
                              name='startTime'
                              value={startTime}
                              max={
                                endTime ? addMinutes(endTime, -1) : undefined
                              }
                              className='inputText'
                              onChange={handleStartTimeChange}
                            />
                          </div>
                          <FieldError
                            error={
                              hasSubmittedOnce
                                ? formErrors.startTime
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.inputField}>
                        <div className={styles.fieldLabel}>
                          {t('workingHours.toLabel')}
                        </div>
                        <div className={styles.fieldWrapper}>
                          <div className={styles.inputWrapper}>
                            <input
                              type='time'
                              name='endTime'
                              value={endTime}
                              min={
                                startTime ? addMinutes(startTime, 1) : undefined
                              }
                              className='inputText'
                              onChange={handleEndTimeChange}
                            />
                          </div>
                          <FieldError
                            error={
                              hasSubmittedOnce ? formErrors.endTime : undefined
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionDividerHorizontal}></div>

              <div className={`${styles.formSection} ${styles.withButton}`}>
                <div className={`${styles.sectionContent} ${styles.fullWidth}`}>
                  <div className={styles.contractInfo}>
                    <h3>{t('contract.title')}</h3>
                    <div className={styles.inputRow}>
                      <div className={styles.inputField}>
                        <div className={styles.fieldLabel}>
                          {t('contract.endDateLabel')}
                        </div>
                        <div className={styles.fieldWrapper}>
                          <div className={styles.dateInputWrapper}>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='20'
                              height='21'
                              viewBox='0 0 20 21'
                              fill='none'
                              className={styles.calendarIcon}
                            >
                              <path
                                d='M9.16667 12.1666V10.5H10.8333V12.1666H9.16667ZM5.83333 12.1666V10.5H7.5V12.1666H5.83333ZM12.5 12.1666V10.5H14.1667V12.1666H12.5ZM9.16667 15.5V13.8333H10.8333V15.5H9.16667ZM5.83333 15.5V13.8333H7.5V15.5H5.83333ZM12.5 15.5V13.8333H14.1667V15.5H12.5ZM2.5 18.8333V3.83329H5V2.16663H6.66667V3.83329H13.3333V2.16663H15V3.83329H17.5V18.8333H2.5ZM4.16667 17.1666H15.8333V8.83329H4.16667V17.1666Z'
                                fill='#272727'
                              />
                            </svg>
                            <div className={styles.inputWrapper}>
                              <input
                                type='date'
                                name='contractEndDate'
                                min={getTomorrowLocalDate()}
                                className='inputText'
                                onChange={() =>
                                  clearFieldError('contractEndDate')
                                }
                              />
                            </div>
                          </div>
                          <FieldError
                            error={
                              hasSubmittedOnce
                                ? formErrors.contractEndDate
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button
                    type='submit'
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('actions.submitting')
                      : t('actions.submit')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div
          className={styles.scrollToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            className={styles.scrollIcon}
          >
            <path
              d='M5.87498 7.25247C5.95237 7.32995 6.04428 7.39141 6.14545 7.43335C6.24661 7.47529 6.35505 7.49687 6.46456 7.49687C6.57408 7.49687 6.68251 7.47529 6.78368 7.43335C6.88484 7.39141 6.97675 7.32995 7.05415 7.25247L9.16665 5.13913V12.5C9.16665 12.721 9.25444 12.9329 9.41072 13.0892C9.567 13.2455 9.77897 13.3333 9.99998 13.3333C10.221 13.3333 10.433 13.2455 10.5892 13.0892C10.7455 12.9329 10.8333 12.721 10.8333 12.5V5.13913L12.9466 7.25247C13.0241 7.32984 13.116 7.3912 13.2171 7.43305C13.3183 7.4749 13.4267 7.49642 13.5361 7.49639C13.6456 7.49635 13.7539 7.47475 13.8551 7.43283C13.9562 7.3909 14.048 7.32948 14.1254 7.25205C14.2028 7.17462 14.2641 7.08272 14.306 6.98158C14.3478 6.88044 14.3694 6.77205 14.3693 6.66259C14.3693 6.55313 14.3477 6.44475 14.3058 6.34364C14.2638 6.24253 14.2024 6.15067 14.125 6.0733L10.5891 2.5383C10.4329 2.38207 10.2209 2.29431 9.99998 2.29431C9.77901 2.29431 9.56709 2.38207 9.41081 2.5383L5.87498 6.0733C5.7975 6.15069 5.73603 6.2426 5.6941 6.34377C5.65216 6.44493 5.63057 6.55337 5.63057 6.66288C5.63057 6.7724 5.65216 6.88083 5.6941 6.982C5.73603 7.08316 5.7975 7.17507 5.87498 7.25247ZM15.8333 17.5C16.0543 17.5 16.2663 17.4122 16.4226 17.2559C16.5788 17.0996 16.6666 16.8876 16.6666 16.6666C16.6666 16.4456 16.5788 16.2337 16.4226 16.0774C16.2663 15.9211 16.0543 15.8333 15.8333 15.8333H4.16665C3.94563 15.8333 3.73367 15.9211 3.57739 16.0774C3.42111 16.2337 3.33331 16.4456 3.33331 16.6666C3.33331 16.8876 3.42111 17.0996 3.57739 17.2559C3.73367 17.4122 3.94563 17.5 4.16665 17.5H15.8333Z'
              fill='#FF525E'
            />
          </svg>
          <span className={styles.scrollText}>{t('actions.scrollToTop')}</span>
        </div>
      </div>

      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className={styles.successIcon}
                >
                  <polyline points='20,6 9,17 4,12'></polyline>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>{t('success.title')}</h3>
              <p className={styles.modalMessage}>{t('success.message')}</p>
              <button
                type='button'
                className={styles.modalButton}
                onClick={handleCloseModal}
              >
                {t('success.button')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddNewWorker
