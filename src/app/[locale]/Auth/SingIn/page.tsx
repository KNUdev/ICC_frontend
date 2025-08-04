'use client'

import { useAuthWarning } from '@/shared/hooks/useAuthWarning'
import { useEffect } from 'react'
import styles from './page.module.scss'

export default function SignInPage() {
  const { checkEmployeeConfirmation } = useAuthWarning()

  useEffect(() => {
    checkEmployeeConfirmation()
  }, [checkEmployeeConfirmation])

  return (
    <div className={styles.signInContainer}>
      <h1>Вхід до системи</h1>
      <p>Тут буде форма входу для працівників ІОЦ</p>
    </div>
  )
}
