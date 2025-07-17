import LinesLeft from '@/assets/image/icons/lines-left.svg'
import LinesRight from '@/assets/image/icons/lines-right.svg'
import { useTranslations } from 'next-intl'
import { FormApplication } from '../FormApplication'
import styles from './FormLines.module.scss'

export function FormLines() {
  const tFormText = useTranslations('form/text')

  return (
    <section className={styles.sectionLines}>
      <LinesLeft className={styles.linesLeft} />

      <div className={styles.formContainer}>
        <h1 className={styles.formHeading}>{tFormText('linesHeading')}</h1>
        <FormApplication formId='lines' />
      </div>

      <LinesRight className={styles.linesRight} />
    </section>
  )
}
