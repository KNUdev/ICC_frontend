import { API } from '@/shared/config/api.config'

interface DepartmentName {
  en: string
  uk: string
}

interface Department {
  id: string
  name: DepartmentName
}

interface DepartmentsResponse {
  content: Department[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  first: boolean
  empty: boolean
}

interface GetDepartmentsParams {
  pageNumber: number
  pageSize: number
}

export async function getDepartments(
  params: GetDepartmentsParams,
): Promise<Department[]> {
  const response = await fetch(`${API}department/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch departments')
  }

  const data: DepartmentsResponse = await response.json()
  return data.content
}

export async function getDepartmentById(
  departmentId: string,
): Promise<Department> {
  const response = await fetch(`${API}department/${departmentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch department')
  }

  const data: Department = await response.json()
  return data
}
