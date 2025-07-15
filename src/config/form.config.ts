export const api = 'http://localhost:5003'

export interface DepartmentName {
  en: string
  uk: string
}

export interface Department {
  id: string
  name: DepartmentName
}

export interface DepartmentResponse {
  content: Department[]
}
