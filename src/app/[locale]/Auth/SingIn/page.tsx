'use client'

import EyeCloseIcon from '@/assets/image/icons/eye-close.svg'
import EyeOpenIcon from '@/assets/image/icons/eye-open.svg'
import { FieldError } from '@/common/components/FieldError/FieldError'
import { loginUser } from '@/shared/api/auth'
import { useAuthWarning } from '@/shared/hooks/useAuthWarning'
import { setAuthTokens } from '@/shared/lib/auth'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.scss'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function SignInPage() {
  const { checkEmployeeConfirmation } = useAuthWarning()
  const router = useRouter()
  const t = useTranslations('Auth/singIn')

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    checkEmployeeConfirmation()
  }, [checkEmployeeConfirmation])

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return t('validation.email.required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return t('validation.email.invalid')
    }

    if (!email.endsWith('@knu.ua')) {
      return t('validation.email.domain')
    }

    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return t('validation.password.required')
    }

    return undefined
  }

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)

    setErrors(newErrors)

    return !Object.values(newErrors).some((error) => error !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const { accessToken, refreshToken } = await loginUser({
        email: formData.email,
        password: formData.password,
      })

      setAuthTokens(accessToken, refreshToken)
      router.push('/')
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : t('error.general'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.signInContainer}>
      <div className={styles.backLink}>
        <Link href='/'>{t('backLink')}</Link>
      </div>

      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>

        <Form action='form' onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t('labels.email')}{' '}
              <span className={styles.required}>{t('required')}</span>
            </label>
            <input
              type='email'
              placeholder={t('placeholders.email')}
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`inputText ${errors.email ? styles.inputError : ''}`}
            />
            <div className={styles.helperText}>{t('helpers.email')}</div>
            <FieldError error={errors.email} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t('labels.password')}{' '}
              <span className={styles.required}>{t('required')}</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('placeholders.password')}
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`inputText ${
                  errors.password ? styles.inputError : ''
                }`}
              />
              <button
                type='button'
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
              </button>
            </div>
            <FieldError error={errors.password} />
          </div>

          {errors.general && (
            <div className={styles.generalError}>
              <FieldError error={errors.general} />
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='mainBtn'
            style={{ color: '#fff', justifyContent: 'center' }}
          >
            {isLoading ? t('button.loading') : t('button.submit')}
          </button>
        </Form>
      </div>
    </div>
  )
}
