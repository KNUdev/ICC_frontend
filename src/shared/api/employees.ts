import { API } from '@/shared/config/api.config'

interface EmployeeName {
  firstName: string
  middleName: string
  lastName: string
}

interface WorkHours {
  startTime: string
  endTime: string
}

interface Employee {
  avatarUrl: string
  contractEndDate: [number, number, number]
  createdAt: [number, number, number, number, number, number, number]
  email: string
  id: string
  isStudent: boolean
  name: EmployeeName
  phoneNumber: string
  sector: {
    id: string
  }
  specialty: {
    id: string
  }
  workHours: WorkHours
}

interface EmployeesResponse {
  content: Employee[]
}

interface EmployeesParams {
  pageSize: number | 'all'
}

export async function getEmployees({
  pageSize,
}: EmployeesParams): Promise<Employee[]> {
  try {
    const formData = new FormData()
    formData.append(
      'pageSize',
      pageSize === 'all' ? String(999) : String(pageSize),
    )

    const response = await fetch(`${API}admin/employee/all`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: EmployeesResponse = await response.json()
    return result.content
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

interface SimpleEmployee {
  id: string
  fullName: string
}

interface AdminEmployeesParams {
  pageNumber: number
  pageSize: number
}

export async function getAdminEmployees(
  params: AdminEmployeesParams,
): Promise<SimpleEmployee[]> {
  try {
    const formData = new FormData()
    formData.append('pageNumber', params.pageNumber.toString())
    formData.append('pageSize', params.pageSize.toString())

    const response = await fetch(`${API}admin/employee/all`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Error fetching employees: ${response.status} ${response.statusText}\nServer responded: ${errorText}`,
      )
    }

    const result: EmployeesResponse = await response.json()

    const simplified: SimpleEmployee[] = result.content.map((emp) => ({
      id: emp.id,
      fullName: `${emp.name.firstName} ${emp.name.middleName} ${emp.name.lastName}`,
    }))

    return simplified
  } catch (error) {
    console.error('Error while loading employees:', error)
    throw error
  }
}
