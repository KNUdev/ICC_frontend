import { API } from '@/shared/config/api.config'

export interface Specialty {
  id: string
  name: {
    en: string
    uk: string
  }
  category?: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR'
  sectors: Array<{
    id: string
    name: {
      en: string
      uk: string
    }
    createdAt?: number[]
    updatedAt?: number[] | null
  }>
  createdAt?: number[]
  updatedAt?: number[] | null
}

export interface CreateSpecialtyRequest {
  name: {
    en: string
    uk: string
  }
  category?: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR'
  sectors: Array<{ id: string }>
}

export interface UpdateSpecialtyRequest {
  id: string
  name: {
    en: string
    uk: string
  }
  category?: 'FIRST' | 'SECOND' | 'LEAD' | 'SENIOR'
  sectors: Array<{ id: string }>
}

export interface GetSpecialtiesRequest {
  pageNumber: number
  pageSize: number
}

export interface SpecialtiesResponse {
  content: Specialty[]
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

export const createSpecialty = async (data: CreateSpecialtyRequest) => {
  const response = await fetch(`${API}admin/specialty/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create specialty')
  }

  return response.json()
}

export const getAllSpecialties = async (
  params: GetSpecialtiesRequest,
): Promise<SpecialtiesResponse> => {
  const response = await fetch(`${API}admin/specialty/getAll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch specialties')
  }

  return response.json()
}

export const updateSpecialty = async (data: UpdateSpecialtyRequest) => {
  const response = await fetch(`${API}admin/specialty/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update specialty')
  }

  return response.json()
}

export const deleteSpecialty = async (specialtyId: string) => {
  const response = await fetch(`${API}admin/specialty/${specialtyId}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete specialty')
  }

  if (response.status === 204) {
    return true
  }

  return response.json()
}
