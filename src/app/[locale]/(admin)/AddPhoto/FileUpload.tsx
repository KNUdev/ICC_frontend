import UploadFile from '@/assets/image/icons/file.svg'
import { useTranslations } from 'next-intl'
import React, { forwardRef } from 'react'
import styles from './page.module.scss'

interface FileUploadProps {
  file: File | null
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFilePreview: (e: React.MouseEvent) => void
  onFileDelete: (e: React.MouseEvent) => void
  disabled?: boolean
  accept?: string
  id?: string
  name?: string
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      file,
      onFileChange,
      onFilePreview,
      onFileDelete,
      disabled = false,
      accept = 'image/*',
      id = 'file-upload',
      name = 'file',
    },
    ref,
  ) {
    const tFormApplication = useTranslations('form/application')

    return (
      <label className={styles.customFileUpload}>
        <input
          ref={ref}
          type='file'
          id={id}
          name={name}
          accept={accept}
          onChange={onFileChange}
          disabled={disabled}
        />

        <div className={styles.uploadContent}>
          <UploadFile />
          {!file && (
            <span className={styles.uploadText}>
              {tFormApplication('placeholders.photo')}
            </span>
          )}
        </div>

        {file && (
          <div className={styles.fileStatusContainer}>
            <button
              type='button'
              className={styles.fileButton}
              onClick={onFilePreview}
              disabled={disabled}
            >
              {tFormApplication('file.preview')}
            </button>

            <div className={styles.divider} />

            <p className={styles.fileStatusText}>
              {tFormApplication('file.uploaded')}
            </p>

            <div className={styles.divider} />

            <button
              type='button'
              className={styles.fileButton}
              onClick={onFileDelete}
              disabled={disabled}
            >
              {tFormApplication('file.delete')}
            </button>
          </div>
        )}
      </label>
    )
  },
)
