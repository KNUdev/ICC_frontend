import { FormPoints } from './FormPoints/FormPoints'
import styles from './Form.module.scss'

export function Form() {
  return (
    <div className='main-wrapper'>
      <section className={styles.sectionContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>Маєте несправний пристрій?</h1>
          <p className={styles.paragraph}>
            Залишіть заявку і ми допоможемо вам!
          </p>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formApplications}></div>
          <FormPoints />
        </div>
      </section>
    </div>
  )
}
