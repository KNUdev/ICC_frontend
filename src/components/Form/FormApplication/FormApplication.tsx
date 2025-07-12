import Hide from '@/assets/image/icons/hide.svg'
import UploadFile from '@/assets/image/icons/file.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import styles from './FormApplication.module.scss'
import { useTranslations } from 'next-intl'

export function FormApplication() {
  const tFormApplication = useTranslations('form/application')
  const tCommon = useTranslations('common')

  const FACULTIES = [
    'GEOGRAPHY',
    'ECONOMICS',
    'HISTORY',
    'MECHMATH',
    'INFOTECH',
  ] as const

  return (
    <form className={styles.formApp} role='form' aria-label='Leave a request'>
      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='fullname'>
          <p className={styles.labelText}>
            {tFormApplication(`labels.fullname`)}
          </p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <div className={styles.inputWrapper}>
          <Hide />

          <input
            type='text'
            id='fullname'
            name='fullname'
            placeholder={tFormApplication(`placeholders.fullname`)}
            className={styles.inputTextEmail}
            required
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='email'>
          <p className={styles.labelText}>{tFormApplication(`labels.email`)}</p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <div className={styles.inputWrapper}>
          <Hide />

          <input
            type='email'
            id='email'
            name='email'
            placeholder={tFormApplication(`placeholders.email`)}
            className={styles.inputTextEmail}
            required
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='faculty'>
          <p className={styles.labelText}>
            {tFormApplication(`labels.faculty`)}
          </p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            id='faculty'
            name='faculty'
            required
          >
            <option value='' disabled selected hidden>
              {tFormApplication(`placeholders.faculty`)}
            </option>
            {FACULTIES.map((key) => (
              <option key={key} value={key}>
                {tCommon(`faculties.${key}`)}
              </option>
            ))}
          </select>

          <ArrowDown />
        </div>
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor='description'>
          <p className={styles.labelText}>
            {tFormApplication(`labels.description`)}
          </p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <textarea
          placeholder={tFormApplication(`placeholders.description`)}
          id='description'
          name='description'
          className={styles.textArea}
          required
        />
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor='file' id='fileLabel'>
          <p className={styles.labelText}>{tFormApplication(`labels.photo`)}</p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <label className={styles.customFileUpload}>
          <input
            type='file'
            id='file'
            name='file'
            accept='image/*'
            aria-labelledby='fileLabel'
            required
          />
          <div className={styles.uploadContent}>
            <UploadFile />
            <span className={styles.uploadText}>
              {tFormApplication(`placeholders.photo`)}
            </span>
          </div>
        </label>
      </div>

      <button type='submit' className={styles.buttonLeave}>
        <p className={styles.buttonText}>{tFormApplication(`button`)}</p>
        <ArrowRight />
      </button>
    </form>
  )
}
