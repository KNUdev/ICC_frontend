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
