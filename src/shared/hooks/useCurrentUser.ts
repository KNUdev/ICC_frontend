'use client'

import { getEmployeeById } from '@/shared/api/employee'
import { getEmployeeIdFromToken } from '@/shared/lib/jwt'
import type { Employee } from '@/shared/types/employee'
import { useEffect, useState } from 'react'

interface UseCurrentUserReturn {
  employee: Employee | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUserData: () => Promise<void>
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  const refreshUserData = async () => {
    await loadUserData()
  }

  useEffect(() => {
    loadUserData()

    const handleAuthStateChange = () => {
      loadUserData()
    }

    const handleProfileUpdate = () => {
      loadUserData()
    }

    window.addEventListener('auth-state-changed', handleAuthStateChange)
    window.addEventListener('profile-updated', handleProfileUpdate)

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChange)
      window.removeEventListener('profile-updated', handleProfileUpdate)
    }
  }, [])

  return {
    employee,
    isLoading,
    isAuthenticated,
    refreshUserData,
  }
}
