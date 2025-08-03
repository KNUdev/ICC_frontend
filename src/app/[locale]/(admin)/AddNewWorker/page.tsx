'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import styles from './page.module.scss'

const AddNewWorker = () => {
  const t = useTranslations('AddNewWorker/common')
  const [hasPhoto, setHasPhoto] = useState(false)

  const handlePhotoUpload = () => {
    setHasPhoto(true)
  }

  const handleDeletePhoto = () => {
    setHasPhoto(false)
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
          <div className={styles.form}>
            <div className={styles.formContent}>
              <div className={styles.formSection}>
                <div className={styles.sectionContent}>
                  <div className={styles.photoSection}>
                    <h3>{t('photo.title')}</h3>
                    <div className={styles.photoUpload}>
                      <div className={styles.photoPlaceholder}>
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
                      </div>
                      <button
                        type='button'
                        className={styles.uploadBtn}
                        onClick={handlePhotoUpload}
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
                  </div>

                  <div className={styles.sectionDivider}></div>

                  <div className={styles.generalInfo}>
                    <h3>{t('generalInfo.title')}</h3>
                    <div className={styles.inputsContainer}>
                      <div className={styles.inputGroup}>
                        <div className={styles.inputRow}>
                          <input
                            placeholder={t('generalInfo.firstName')}
                            required
                          />
                          <input
                            placeholder={t('generalInfo.lastName')}
                            required
                          />
                          <input
                            placeholder={t('generalInfo.middleName')}
                            required
                          />
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <div className={styles.checkboxRow}>
                          <div className={styles.checkboxGroup}>
                            <input
                              type='checkbox'
                              id='isStudent'
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
                          <input
                            placeholder={t('generalInfo.email')}
                            required
                          />
                        </div>
                        <div className={styles.inputRow}>
                          <div className={styles.inputGroup}>
                            <label>{t('generalInfo.phoneLabel')}</label>
                            <input
                              type='tel'
                              placeholder={t('generalInfo.phonePlaceholder')}
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
                <div className={styles.sectionContent}>
                  <div className={styles.salarySection}>
                    <h3>{t('salary.title')}</h3>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label>{t('salary.label')}</label>
                        <input
                          type='number'
                          placeholder={t('salary.placeholder')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.sectionDivider}></div>

                  <div className={styles.specialtySection}>
                    <h3>{t('specialty.title')}</h3>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label>{t('specialty.specialtyLabel')}</label>
                        <select>
                          <option>{t('specialty.specialtyPlaceholder')}</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label>{t('specialty.categoryLabel')}</label>
                        <select>
                          <option>{t('specialty.categoryPlaceholder')}</option>
                        </select>
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
                        <input type='time' defaultValue='16:00' />
                      </div>
                      <div className={styles.inputField}>
                        <div className={styles.fieldLabel}>
                          {t('workingHours.toLabel')}
                        </div>
                        <input type='time' defaultValue='20:00' />
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
                          {t('contract.startDateLabel')}
                        </div>
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
                          <input type='date' defaultValue='2022-06-25' />
                        </div>
                      </div>
                      <div className={styles.inputField}>
                        <div className={styles.fieldLabel}>
                          {t('contract.endDateLabel')}
                        </div>
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
                          <input type='date' defaultValue='2023-06-25' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button type='submit' className={styles.submitBtn}>
                    {t('actions.submit')}
                  </button>
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
      </div>
    </div>
  )
}

export default AddNewWorker
