import { API } from '@/shared/config/api.config'
import type { Employee } from '@/shared/types/employee'

export async function getEmployeeById(
  employeeId: string,
): Promise<Employee | null> {
  try {
    const response = await fetch(`${API}employee/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch employee data:', response.status)
      return null
    }

    const employee: Employee = await response.json()
    return employee
  } catch (error) {
    console.error('Error fetching employee data:', error)
    return null
  }
}
