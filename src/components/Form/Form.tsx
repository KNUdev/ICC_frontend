import { FormPoints } from './FormPoints/FormPoints'
import styles from './Form.module.scss'

export function Form() {
  return (
    <section className={styles.formContainer}>
      <div className={styles.container}>
        <div className={styles.formApplications}></div>
        <FormPoints />
      </div>
    </section>
  )
}
