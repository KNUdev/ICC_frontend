'use client'

import { updateEmployee } from '@/shared/api/adminEmployees'
import { getEmployeeById } from '@/shared/api/employee'
import { getEmployeeIdFromToken } from '@/shared/lib/jwt'
import type { Employee } from '@/shared/types/employee'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './page.module.scss'

interface EditingField {
  field: string
  value: string
}

const UserProfile = () => {
  const t = useTranslations('UserProfile/common')
  const locale = useLocale()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<EditingField | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{
    firstName?: string
    lastName?: string
    middleName?: string
    email?: string
    phoneNumber?: string
  }>({})

  const loadEmployeeData = useCallback(async () => {
    try {
      setLoading(true)
      const employeeId = getEmployeeIdFromToken()

      if (!employeeId) {
        setError(t('errors.notAuthorized'))
        return
      }

      const employeeData = await getEmployeeById(employeeId)

      if (!employeeData) {
        setError(t('errors.failedToLoadProfile'))
        return
      }

      setEmployee(employeeData)
      setError(null)
    } catch (err) {
      console.error('Error loading employee data:', err)
      setError(t('errors.failedToLoadProfile'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadEmployeeData()
  }, [loadEmployeeData])

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField({ field, value: currentValue })
    setFormErrors({})
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setFormErrors({})
  }

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'firstName':
        return !value.trim() ? t('errors.firstName') : null
      case 'lastName':
        return !value.trim() ? t('errors.lastName') : null
      case 'middleName':
        return !value.trim() ? t('errors.middleName') : null
      case 'email':
        if (!value.trim()) return t('errors.email')
        if (!value.endsWith('@knu.ua')) return t('errors.emailKnuOnly')
        return null
      default:
        return null
    }
  }

  const handleSaveField = async () => {
    if (!editingField || !employee) return

    const { field, value } = editingField
    const error = validateField(field, value)

    if (error) {
      setFormErrors({ [field]: error })
      return
    }

    try {
      setIsUpdating(true)

      const updatePayload: {
        id: string
        firstName?: string
        lastName?: string
        middleName?: string
        email?: string
        phoneNumber?: string
      } = { id: employee.id }

      if (field === 'firstName') {
        updatePayload.firstName = value.trim()
      } else if (field === 'lastName') {
        updatePayload.lastName = value.trim()
      } else if (field === 'middleName') {
        updatePayload.middleName = value.trim()
      } else if (field === 'email') {
        updatePayload.email = value.trim()
      } else if (field === 'phoneNumber') {
        updatePayload.phoneNumber = value.trim()
      }

      await updateEmployee(updatePayload)

      // Update local state
      setEmployee((prev) => {
        if (!prev) return prev

        if (
          field === 'firstName' ||
          field === 'lastName' ||
          field === 'middleName'
        ) {
          return {
            ...prev,
            name: {
              ...prev.name,
              [field]: value.trim(),
            },
          }
        } else {
          return {
            ...prev,
            [field]: value.trim(),
          }
        }
      })

      setEditingField(null)
      setShowSuccessModal(true)

      window.dispatchEvent(new Event('profile-updated'))
    } catch (err) {
      console.error('Error updating employee:', err)
      setFormErrors({ [field]: t('errors.failedToUpdateProfile') })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhotoFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSavePhoto = async () => {
    if (!photoFile || !employee) return

    try {
      setIsUpdating(true)

      await updateEmployee({
        id: employee.id,
        avatarFile: photoFile,
      })

      setEmployee((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          avatarUrl: photoPreview || prev.avatarUrl,
        }
      })

      setPhotoFile(null)
      setPhotoPreview(null)
      setShowSuccessModal(true)

      window.dispatchEvent(new Event('profile-updated'))
    } catch (err) {
      console.error('Error updating photo:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!employee) return

    try {
      setIsUpdating(true)

      await updateEmployee({
        id: employee.id,
        avatarFile: new File([''], 'empty'),
      })

      setEmployee((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          avatarUrl: null,
        }
      })

      setPhotoFile(null)
      setPhotoPreview(null)
      setShowSuccessModal(true)

      window.dispatchEvent(new Event('profile-updated'))
    } catch (err) {
      console.error('Error deleting photo:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateArray: number[]) => {
    if (!dateArray || dateArray.length < 3) return ''
    const [year, month, day] = dateArray
    return `${day.toString().padStart(2, '0')}.${month
      .toString()
      .padStart(2, '0')}.${year}`
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    return time.slice(0, 5)
  }

  const getRoleLabel = (role: string) => {
    return t(`role.options.${role}`) || role
  }

  if (loading) {
    return (
      <div className={styles.UserProfilePage + ' main-wrapper'}>
        <div className={styles.loadingSpinner}>{t('actions.loading')}...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.UserProfilePage + ' main-wrapper'}>
        <div className={styles.errorMessage}>
          <div className={styles.errorTitle}>Error</div>
          <div className={styles.errorText}>{error}</div>
        </div>
      </div>
    )
  }

  if (!employee) {
    return null
  }

  return (
    <div className={styles.UserProfilePage + ' main-wrapper'}>
      <div className={styles.startpage}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
        </div>
      </div>

      <div className={styles.pagecontin}>
        <div className={styles.form}>
          <div className={styles.formContent}>
            {/* Photo Section */}
            <div className={styles.formSection}>
              <div className={styles.sectionContent}>
                <div className={styles.photoSection}>
                  <h3>{t('photo.title')}</h3>
                  <div className={styles.photoUpload}>
                    <div className={styles.photoPlaceholder}>
                      {photoPreview || employee.avatarUrl ? (
                        <Image
                          src={photoPreview || employee.avatarUrl || ''}
                          alt='Profile'
                          width={400}
                          height={317}
                          className={styles.photoPreviewImg}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
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

                    {!photoFile ? (
                      <>
                        {!employee.avatarUrl ? (
                          <button
                            type='button'
                            className={styles.uploadBtn}
                            onClick={() =>
                              document.getElementById('photo-upload')?.click()
                            }
                            disabled={isUpdating}
                          >
                            {t('photo.uploadButton')}
                          </button>
                        ) : (
                          <div className={styles.editButtons}>
                            <button
                              type='button'
                              className={styles.changeBtn}
                              onClick={() =>
                                document.getElementById('photo-upload')?.click()
                              }
                              disabled={isUpdating}
                            >
                              {t('photo.changeButton')}
                            </button>
                            <button
                              type='button'
                              className={styles.deleteBtn}
                              onClick={handleDeletePhoto}
                              disabled={isUpdating}
                            >
                              {t('photo.deleteButton')}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={styles.editButtons}>
                        <button
                          type='button'
                          className={styles.changeBtn}
                          onClick={handleSavePhoto}
                          disabled={isUpdating}
                        >
                          {isUpdating ? t('actions.saving') : t('actions.save')}
                        </button>
                        <button
                          type='button'
                          className={styles.deleteBtn}
                          onClick={() => {
                            setPhotoFile(null)
                            setPhotoPreview(null)
                            const fileInput = document.getElementById(
                              'photo-upload',
                            ) as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          disabled={isUpdating}
                        >
                          {t('actions.cancel')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.sectionDivider}></div>

                <div className={styles.generalInfo}>
                  <h3>{t('generalInfo.title')}</h3>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('generalInfo.firstNameLabel')}
                          {editingField?.field !== 'firstName' && (
                            <button
                              type='button'
                              className={styles.editButton}
                              onClick={() =>
                                handleEditField(
                                  'firstName',
                                  employee.name.firstName,
                                )
                              }
                            >
                              {t('actions.edit')}
                            </button>
                          )}
                        </label>
                        {editingField?.field === 'firstName' ? (
                          <>
                            <input
                              type='text'
                              value={editingField.value}
                              onChange={(e) =>
                                setEditingField({
                                  ...editingField,
                                  value: e.target.value,
                                })
                              }
                              autoFocus
                            />
                            {formErrors.firstName && (
                              <span
                                style={{
                                  color: '#ff525e',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formErrors.firstName}
                              </span>
                            )}
                            <div className={styles.editActions}>
                              <button
                                type='button'
                                className={styles.saveButton}
                                onClick={handleSaveField}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? t('actions.saving')
                                  : t('actions.save')}
                              </button>
                              <button
                                type='button'
                                className={styles.cancelButton}
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                              >
                                {t('actions.cancel')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <input
                            type='text'
                            value={employee.name.firstName}
                            disabled
                          />
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('generalInfo.lastNameLabel')}
                          {editingField?.field !== 'lastName' && (
                            <button
                              type='button'
                              className={styles.editButton}
                              onClick={() =>
                                handleEditField(
                                  'lastName',
                                  employee.name.lastName,
                                )
                              }
                            >
                              {t('actions.edit')}
                            </button>
                          )}
                        </label>
                        {editingField?.field === 'lastName' ? (
                          <>
                            <input
                              type='text'
                              value={editingField.value}
                              onChange={(e) =>
                                setEditingField({
                                  ...editingField,
                                  value: e.target.value,
                                })
                              }
                              autoFocus
                            />
                            {formErrors.lastName && (
                              <span
                                style={{
                                  color: '#ff525e',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formErrors.lastName}
                              </span>
                            )}
                            <div className={styles.editActions}>
                              <button
                                type='button'
                                className={styles.saveButton}
                                onClick={handleSaveField}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? t('actions.saving')
                                  : t('actions.save')}
                              </button>
                              <button
                                type='button'
                                className={styles.cancelButton}
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                              >
                                {t('actions.cancel')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <input
                            type='text'
                            value={employee.name.lastName}
                            disabled
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('generalInfo.middleNameLabel')}
                          {editingField?.field !== 'middleName' && (
                            <button
                              type='button'
                              className={styles.editButton}
                              onClick={() =>
                                handleEditField(
                                  'middleName',
                                  employee.name.middleName,
                                )
                              }
                            >
                              {t('actions.edit')}
                            </button>
                          )}
                        </label>
                        {editingField?.field === 'middleName' ? (
                          <>
                            <input
                              type='text'
                              value={editingField.value}
                              onChange={(e) =>
                                setEditingField({
                                  ...editingField,
                                  value: e.target.value,
                                })
                              }
                              autoFocus
                            />
                            {formErrors.middleName && (
                              <span
                                style={{
                                  color: '#ff525e',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formErrors.middleName}
                              </span>
                            )}
                            <div className={styles.editActions}>
                              <button
                                type='button'
                                className={styles.saveButton}
                                onClick={handleSaveField}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? t('actions.saving')
                                  : t('actions.save')}
                              </button>
                              <button
                                type='button'
                                className={styles.cancelButton}
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                              >
                                {t('actions.cancel')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <input
                            type='text'
                            value={employee.name.middleName}
                            disabled
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('generalInfo.emailLabel')}
                          {editingField?.field !== 'email' && (
                            <button
                              type='button'
                              className={styles.editButton}
                              onClick={() =>
                                handleEditField('email', employee.email)
                              }
                            >
                              {t('actions.edit')}
                            </button>
                          )}
                        </label>
                        {editingField?.field === 'email' ? (
                          <>
                            <input
                              type='email'
                              value={editingField.value}
                              onChange={(e) =>
                                setEditingField({
                                  ...editingField,
                                  value: e.target.value,
                                })
                              }
                              autoFocus
                            />
                            {formErrors.email && (
                              <span
                                style={{
                                  color: '#ff525e',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formErrors.email}
                              </span>
                            )}
                            <div className={styles.editActions}>
                              <button
                                type='button'
                                className={styles.saveButton}
                                onClick={handleSaveField}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? t('actions.saving')
                                  : t('actions.save')}
                              </button>
                              <button
                                type='button'
                                className={styles.cancelButton}
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                              >
                                {t('actions.cancel')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <input type='email' value={employee.email} disabled />
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('generalInfo.phoneLabel')}
                          {editingField?.field !== 'phoneNumber' && (
                            <button
                              type='button'
                              className={styles.editButton}
                              onClick={() =>
                                handleEditField(
                                  'phoneNumber',
                                  employee.phoneNumber,
                                )
                              }
                            >
                              {t('actions.edit')}
                            </button>
                          )}
                        </label>
                        {editingField?.field === 'phoneNumber' ? (
                          <>
                            <input
                              type='tel'
                              value={editingField.value}
                              onChange={(e) =>
                                setEditingField({
                                  ...editingField,
                                  value: e.target.value,
                                })
                              }
                              autoFocus
                            />
                            {formErrors.phoneNumber && (
                              <span
                                style={{
                                  color: '#ff525e',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formErrors.phoneNumber}
                              </span>
                            )}
                            <div className={styles.editActions}>
                              <button
                                type='button'
                                className={styles.saveButton}
                                onClick={handleSaveField}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? t('actions.saving')
                                  : t('actions.save')}
                              </button>
                              <button
                                type='button'
                                className={styles.cancelButton}
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                              >
                                {t('actions.cancel')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <input
                            type='tel'
                            value={employee.phoneNumber}
                            disabled
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('generalInfo.isStudentLabel')}
                        </label>
                        <span className={styles.checkboxLabel}>
                          {employee.isStudent
                            ? t('generalInfo.yes')
                            : t('generalInfo.no')}
                        </span>
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
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('salary.label')}
                        </label>
                        <input
                          type='number'
                          value={employee.salaryInUAH}
                          disabled
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
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('specialty.specialtyLabel')}
                        </label>
                        <input
                          type='text'
                          value={employee.specialty.name[locale as 'en' | 'uk']}
                          disabled
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('specialty.sectorLabel')}
                        </label>
                        <input
                          type='text'
                          value={employee.sector.name[locale as 'en' | 'uk']}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.roleSection}>
                  <h3>{t('role.title')}</h3>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('role.label')}
                        </label>
                        <input
                          type='text'
                          value={getRoleLabel(employee.role)}
                          disabled
                        />
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
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('workingHours.fromLabel')}
                        </label>
                        <input
                          type='time'
                          value={formatTime(employee.workHours.startTime)}
                          disabled
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('workingHours.toLabel')}
                        </label>
                        <input
                          type='time'
                          value={formatTime(employee.workHours.endTime)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.contractInfo}>
                  <h3>{t('contract.title')}</h3>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>
                          {t('contract.endDateLabel')}
                        </label>
                        <input
                          type='text'
                          value={formatDate(employee.contractEndDate)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {showSuccessModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowSuccessModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <svg
                  className={styles.successIcon}
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className={styles.modalTitle}>{t('success.title')}</h3>
              <p className={styles.modalMessage}>{t('success.message')}</p>
              <button
                type='button'
                className={styles.modalButton}
                onClick={() => setShowSuccessModal(false)}
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

export default UserProfile
