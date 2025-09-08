import { API } from '@/shared/config/api.config'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface RegisterCredentials {
  email: string
  password: string
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${API}account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Login failed')
  }

  const data: LoginResponse = await response.json()
  return data
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<void> {
  const formData = new FormData()
  formData.append('email', credentials.email)
  formData.append('password', credentials.password)

  const response = await fetch(`${API}account/register`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Registration failed')
  }
}
