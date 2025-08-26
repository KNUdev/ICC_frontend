export interface EmployeeName {
  firstName: string
  middleName: string
  lastName: string
}

export interface WorkHours {
  startTime: string
  endTime: string
}

export interface LocalizedName {
  en: string
  uk: string
}

export interface Specialty {
  id: string
  name: LocalizedName
  createdAt: number[]
  updatedAt: number[] | null
  category: string
}

export interface Sector {
  id: string
  name: LocalizedName
  createdAt: number[]
  updatedAt: number[] | null
}

export interface Employee {
  id: string
  name: EmployeeName
  email: string
  phoneNumber: string
  createdAt: number[]
  updatedAt: number[] | null
  salaryInUAH: number
  isStudent: boolean
  avatarUrl: string | null
  contractEndDate: number[]
  workHours: WorkHours
  role: string
  specialty: Specialty & {
    sectors: Sector[]
  }
  sector: Sector & {
    specialties: Specialty[]
  }
}
