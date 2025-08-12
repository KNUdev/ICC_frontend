export interface GalleryItem {
  creatorId: string
  itemId: string
  itemUrl: string
  itemName: string
  itemDescription: string
  uploadedAt: number[]
  updatedAt: number[] | null
}

export interface GalleryPagination {
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

export interface GalleryResponse {
  content: GalleryItem[]
  pageable: GalleryPagination
  totalElements: number
  totalPages: number
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

export interface GalleryParams {
  pageNumber?: number
  pageSize?: number
}
