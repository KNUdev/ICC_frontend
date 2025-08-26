import { useTranslations } from 'next-intl'
import styles from './Form.module.scss'
import { FormApplication } from './FormApplication/FormApplication'
import { FormPoints } from './FormPoints/FormPoints'

export function Form() {
  const tFormText = useTranslations('form/text')

  return (
    <>
      <section className={styles.sectionContainer} id='formApplication'>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>{tFormText('heading')}</h1>
          <p className={styles.paragraph}>{tFormText('subheading')}</p>
        </div>

        <div className={styles.formContainer}>
          <FormApplication formId='main' />
          <FormPoints />
        </div>
      </section>
    </>
  )
}
