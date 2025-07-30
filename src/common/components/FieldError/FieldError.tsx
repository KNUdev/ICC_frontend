import styles from './FieldError.module.scss'

interface FieldErrorProps {
  error?: string
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null

  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>{error}</p>
    </div>
  )
}
