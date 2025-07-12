import Hide from '@/assets/image/icons/hide.svg'
import UploadFile from '@/assets/image/icons/file.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import styles from './FormApplication.module.scss'

export function FormApplication() {
  return (
    <form className={styles.formApp} role='form' aria-label='Leave a request'>
      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='fullname'>
          <p className={styles.labelText}>ПІБ</p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <div className={styles.inputWrapper}>
          <Hide />

          <input
            type='text'
            id='fullname'
            name='fullname'
            placeholder='Попов Богдан Віталійович'
            className={styles.inputTextEmail}
            required
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='email'>
          <p className={styles.labelText}>Email</p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <div className={styles.inputWrapper}>
          <Hide />

          <input
            type='email'
            id='email'
            name='email'
            placeholder='example@gmail.com'
            className={styles.inputTextEmail}
            required
          />
        </div>
      </div>

      <div className={styles.smallFieldWrapper}>
        <label className={styles.label} htmlFor='faculty'>
          <p className={styles.labelText}>Факультет</p>
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
              Виберіть факультет
            </option>
          </select>

          <ArrowDown />
        </div>
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor='description'>
          <p className={styles.labelText}>Опис проблеми</p>
          <span className={styles.labelSpan}>*</span>
        </label>

        <textarea
          placeholder='У мене проблеми з'
          id='description'
          name='description'
          className={styles.textArea}
          required
        />
      </div>

      <div className={styles.bigFieldWrapper}>
        <label className={styles.label} htmlFor='file' id='fileLabel'>
          <p className={styles.labelText}>Фото проблеми</p>
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
              Натисніть сюди, щоб прикріпити фото...
            </span>
          </div>
        </label>
      </div>

      <button type='submit' className={styles.buttonLeave}>
        <p className={styles.buttonText}>Залишити заявку</p>
        <ArrowRight />
      </button>
    </form>
  )
}
