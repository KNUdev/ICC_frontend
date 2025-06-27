import styles from './InputText.module.scss'

interface InputTextProps {
  title: string
  placeholder: string
  downText?: string
  isRequired?: boolean
  IconComponentLeft?: React.ComponentType
  IconComponentRight?: React.ComponentType
}

const InputText = ({
  title,
  placeholder,
  downText,
  isRequired = false,
  IconComponentLeft,
  IconComponentRight,
}: InputTextProps) => {
  return (
    <div className={styles.inputText}>
      <div className={styles.inputContainer}>
        <label>
          {title}
          {isRequired && <span>*</span>}
        </label>
        <div className={styles.inputWrapper}>
          {IconComponentLeft && <IconComponentLeft />}
          <input type='text' placeholder={placeholder} />
          {IconComponentRight && <IconComponentRight />}
        </div>
      </div>
      <p>{downText}</p>
    </div>
  )
}

export default InputText
