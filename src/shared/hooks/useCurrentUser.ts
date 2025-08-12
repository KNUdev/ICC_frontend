'use client'

import { getEmployeeById } from '@/shared/api/employee'
import { getEmployeeIdFromToken } from '@/shared/lib/jwt'
import type { Employee } from '@/shared/types/employee'
import { useEffect, useState } from 'react'

interface UseCurrentUserReturn {
  employee: Employee | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)

      const employeeId = getEmployeeIdFromToken()

      if (!employeeId) {
        setIsAuthenticated(false)
        setEmployee(null)
        setIsLoading(false)
        return
      }

      setIsAuthenticated(true)

      const employeeData = await getEmployeeById(employeeId)
      setEmployee(employeeData)
      setIsLoading(false)
    }

    loadUserData()

    const handleAuthStateChange = () => {
      loadUserData()
    }

    window.addEventListener('auth-state-changed', handleAuthStateChange)

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChange)
    }
  }, [])

  return {
    employee,
    isLoading,
    isAuthenticated,
  }
}
