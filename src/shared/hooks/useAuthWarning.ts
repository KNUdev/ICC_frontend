'use client'

import { usePathname, useRouter } from '@/i18n/navigation'

export function useAuthWarning() {
  const router = useRouter()
  const pathname = usePathname()

  const checkEmployeeConfirmation = () => {
    const confirmed = localStorage.getItem('employeeConfirmed')
    if (!confirmed && !pathname.includes('/warning')) {
      const fromPage = pathname.includes('SingIn') ? 'signIn' : 'signUp'
      localStorage.setItem('authWarningFrom', fromPage)
      router.push('/Auth/warning')
      return false
    }
    return true
  }

  const clearEmployeeConfirmation = () => {
    localStorage.removeItem('employeeConfirmed')
    localStorage.removeItem('authWarningFrom')
  }

  return {
    checkEmployeeConfirmation,
    clearEmployeeConfirmation,
  }
}
