import { useTranslations } from 'next-intl'
import styles from './Form.module.scss'
import { FormPoints } from './FormPoints/FormPoints'

export function Form() {
  const tFormText = useTranslations('form/text')

  return (
    <div className='main-wrapper'>
      <section className={styles.sectionContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>{tFormText('heading')}</h1>
          <p className={styles.paragraph}>{tFormText('subheading')}</p>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formApplications}></div>
          <FormPoints />
        </div>
      </section>
    </div>
  )
}
