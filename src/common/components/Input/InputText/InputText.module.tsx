import styles from './InputText.module.scss'

interface InputTextProps {
  title: string
  placeholder: string
  downText?: string
  isRequired?: boolean
  IconComponentLeft?: React.ComponentType
  IconComponentRight?: React.ComponentType
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputText = ({
  title,
  placeholder,
  downText,
  isRequired = false,
  IconComponentLeft,
  IconComponentRight,
  value,
  onChange,
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
          <input 
            type='text' 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
          />
          {IconComponentRight && <IconComponentRight />}
        </div>
      </div>
      <p>{downText}</p>
    </div>
  )
}

export default InputText
