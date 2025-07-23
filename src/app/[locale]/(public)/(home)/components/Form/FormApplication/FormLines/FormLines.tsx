import { AnimationProvider } from '@/common/animations/FormLines/AnimationContext'
import FormLinesLeftWrapper from '@/common/animations/FormLines/FormLinesLeftWrapper'
import FormLinesRightWrapper from '@/common/animations/FormLines/FormLinesRightWrapper'
import { useTranslations } from 'next-intl'
import { FormApplication } from '../FormApplication'
import styles from './FormLines.module.scss'

export function FormLines() {
  const tFormText = useTranslations('form/text')

  return (
    <AnimationProvider>
      <section className={styles.sectionLines}>
        <div>
          <FormLinesLeftWrapper />
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.formHeading}>{tFormText('linesHeading')}</h1>
          <FormApplication formId='lines' />
        </div>

        <div>
          <FormLinesRightWrapper />
        </div>
      </section>
    </AnimationProvider>
  )
}
