import { API } from '@/shared/config/api.config'
import { getFullImageUrl } from '@/shared/lib/imageUrl'

interface ApplicantName {
  firstName: string
  lastName: string
  middleName: string
}

interface CreateApplicationParams {
  applicantName: ApplicantName
  applicantEmail: string
  departmentId: string
  problemDescription: string
  problemPhoto?: File
  problemPhotoName?: string
  status: 'IN_QUEUE'
}

export async function createApplication(
  params: CreateApplicationParams,
): Promise<void> {
  const formData = new FormData()

  formData.append('applicantName.firstName', params.applicantName.firstName)
  formData.append('applicantName.lastName', params.applicantName.lastName)
  formData.append('applicantName.middleName', params.applicantName.middleName)
  formData.append('applicantEmail', params.applicantEmail)
  formData.append('departmentId', params.departmentId)
  formData.append('problemDescription', params.problemDescription)
  formData.append('status', params.status)

  if (params.problemPhoto) {
    formData.append('problemPhoto', params.problemPhoto)
    formData.append(
      'problemPhotoName',
      params.problemPhotoName || params.problemPhoto.name,
    )
  }

  const response = await fetch(`${API}application/create`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to create application')
  }
}

interface Application {
  id: string
  applicantName: ApplicantName
  applicantEmail: string
  receivedAt: number[]
  completedAt: string
  problemDescription: string
  problemPhoto: string | null
  status: string
  departmentId: string
  assignedEmployeeIds: string[]
}

interface ApplicationsResponse {
  content: Application[]
}

interface GetApplicationsParams {
  pageNumber: number
  pageSize: number
}

export async function getAdminApplications(
  params: GetApplicationsParams,
): Promise<Application[]> {
  const response = await fetch(`${API}admin/application/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: ApplicationsResponse = await response.json()

  const processedApplications = result.content.map((app) => ({
    ...app,
    problemPhoto: getFullImageUrl(app.problemPhoto),
  }))

  return processedApplications
}

export async function deleteApplication(applicationId: string): Promise<void> {
  const response = await fetch(
    `${API}admin/application/${applicationId}/delete`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    const resultText = await response.text()
    throw new Error(`Delete failed: ${response.status} ${resultText}`)
  }
}

interface UpdateApplicationParams {
  id: string
  applicantEmail: string
  applicantName: ApplicantName
  departmentId: string
  problemDescription: string
  status: string
}

export async function updateApplication(
  params: UpdateApplicationParams,
): Promise<void> {
  const formData = new FormData()

  formData.append('id', params.id)
  formData.append('applicantEmail', params.applicantEmail)
  formData.append('firstName', params.applicantName.firstName)
  formData.append('middleName', params.applicantName.middleName)
  formData.append('lastName', params.applicantName.lastName)
  formData.append('departmentId', params.departmentId)
  formData.append('problemDescription', params.problemDescription)
  formData.append('status', params.status)

  const response = await fetch(`${API}admin/application/update`, {
    method: 'PATCH',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error updating: ${response.status} ${errorText}`)
  }
}

export async function assignEmployeeToApplication(
  applicationId: string,
  employeeId: string,
): Promise<void> {
  const formData = new FormData()
  formData.append('applicationId', applicationId)
  formData.append('employeeId', employeeId)

  const response = await fetch(`${API}admin/application/assign-employee`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to assign employee ${employeeId}: ${errorText}`)
  }
}

export async function removeEmployeeFromApplication(
  applicationId: string,
  employeeId: string,
): Promise<void> {
  const formData = new FormData()
  formData.append('applicationId', applicationId)
  formData.append('employeeId', employeeId)

  const response = await fetch(`${API}admin/application/remove-employee`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to unassign employee: ${errorText}`)
  }
}
