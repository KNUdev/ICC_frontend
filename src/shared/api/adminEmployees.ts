import { API } from '@/shared/config/api.config'

export interface PaginatedResponse<T> {
  content: T[]
  pageNumber?: number
  pageSize?: number
  totalElements?: number
  totalPages?: number
}

export interface Specialty {
  id: string
  name: { en: string; uk: string }
}

export interface Sector {
  id: string
  name: { en: string; uk: string }
}

export interface CreateEmployeePayload {
  firstName: string
  lastName: string
  middleName: string
  email: string
  phoneNumber: string
  salaryInUAH: string | number
  isStudent: boolean
  specialtyId: string
  sectorId: string
  role: string
  startTime: string
  endTime: string
  contractEndDate: string
  avatarFile?: File
}

export interface ApiFieldErrors {
  [key: string]: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export async function getSpecialties(pageNumber = 0, pageSize = 10) {
  const res = await fetch(`${API}admin/specialty/getAll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageNumber, pageSize }),
  })
  if (!res.ok) throw new Error('Failed to fetch specialties')
  return (await res.json()) as PaginatedResponse<Specialty>
}

export async function getSectors(pageNumber = 0, pageSize = 10) {
  const res = await fetch(`${API}admin/sector/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageNumber, pageSize }),
  })
  if (!res.ok) throw new Error('Failed to fetch sectors')
  return (await res.json()) as PaginatedResponse<Sector>
}

export async function createEmployee(payload: CreateEmployeePayload) {
  const formData = new FormData()

  formData.append('fullName.firstName', payload.firstName)
  formData.append('fullName.lastName', payload.lastName)
  formData.append('fullName.middleName', payload.middleName)
  formData.append('email', payload.email)
  formData.append(
    'phoneNumber',
    String(payload.phoneNumber).trim().replace(/^\+/, ''),
  )
  formData.append('salaryInUAH', String(payload.salaryInUAH ?? '0'))
  formData.append('isStudent', String(!!payload.isStudent))
  formData.append('specialty.id', payload.specialtyId)
  formData.append('sector.id', payload.sectorId)
  formData.append('role', payload.role)
  formData.append('workHours.startTime', payload.startTime)
  formData.append('workHours.endTime', payload.endTime)
  formData.append('contractEndDate', payload.contractEndDate)

  if (payload.avatarFile) {
    formData.append('avatarFile', payload.avatarFile)
  }

  const res = await fetch(`${API}admin/employee/create`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    let errorJson: unknown
    try {
      errorJson = await res.json()
    } catch {
      throw new Error('Failed to create employee')
    }

    if (
      isRecord(errorJson) &&
      'fieldErrors' in errorJson &&
      isRecord((errorJson as Record<string, unknown>).fieldErrors)
    ) {
      const fieldErrors = (errorJson as Record<string, unknown>)
        .fieldErrors as Record<string, unknown>
      const apiErrors: ApiFieldErrors = {}
      for (const [key, val] of Object.entries(fieldErrors)) {
        if (typeof val === 'string') apiErrors[key] = val
      }
      const message =
        isRecord(errorJson) && typeof errorJson.message === 'string'
          ? errorJson.message
          : 'Validation error'
      const apiErr = new Error(message) as Error & {
        fieldErrors?: ApiFieldErrors
      }
      apiErr.fieldErrors = apiErrors
      throw apiErr
    }

    const message =
      isRecord(errorJson) && typeof errorJson.message === 'string'
        ? errorJson.message
        : 'Failed to create employee'
    throw new Error(message)
  }

  return await res.json()
}
