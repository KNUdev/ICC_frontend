import { API } from '@/shared/config/api.config'

export interface Sector {
  id: string
  name: {
    en: string
    uk: string
  }
  specialties: Array<{
    id: string
    name: {
      en: string
      uk: string
    }
  }>
  createdAt?: number[]
  updatedAt?: number[] | null
}

export interface CreateSectorRequest {
  name: {
    en: string
    uk: string
  }
  specialties: Array<{ id: string }>
}

export interface UpdateSectorRequest {
  id: string
  name: {
    en: string
    uk: string
  }
  specialties: Array<{ id: string }>
}

export interface GetSectorsRequest {
  pageNumber: number
  pageSize: number
}

export interface SectorsResponse {
  content: Sector[]
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

export const createSector = async (data: CreateSectorRequest) => {
  const response = await fetch(`${API}admin/sector/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create sector')
  }

  return response.json()
}

export const getAllSectors = async (
  params: GetSectorsRequest,
): Promise<SectorsResponse> => {
  const response = await fetch(`${API}admin/sector/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch sectors')
  }

  return response.json()
}

export const updateSector = async (data: UpdateSectorRequest) => {
  const response = await fetch(`${API}admin/sector/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update sector')
  }

  return response.json()
}

export const deleteSector = async (sectorId: string) => {
  const response = await fetch(`${API}admin/sector/${sectorId}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete sector')
  }

  if (response.status === 204) {
    return true
  }

  return response.json()
}
