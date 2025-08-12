import { API } from '@/shared/config/api.config'
import { getEmployeeIdFromToken } from '@/shared/lib/jwt'
import { useCallback, useState } from 'react'

interface FormErrors {
  name?: string
  description?: string
  photo?: string
}

interface imageUploadReturn {
  file: File | null
  isSubmitting: boolean
  errorMessage: string | null
  formErrors: FormErrors
  setFile: (file: File | null) => void
  clearFieldError: (fieldName: keyof FormErrors) => void
  validateAndSubmit: (formData: FormData) => Promise<void>
  resetForm: () => void
}

interface imageUploadConfig {
  onSuccess?: () => void
  validateForm: (formData: FormData, file: File | null) => FormErrors
}

export function ImageUpload({
  onSuccess,
  validateForm,
}: imageUploadConfig): imageUploadReturn {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const clearFieldError = useCallback((fieldName: keyof FormErrors) => {
    setFormErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _, ...rest } = prev
      return rest
    })
  }, [])

  const resetForm = useCallback(() => {
    setFile(null)
    setFormErrors({})
    setErrorMessage(null)
  }, [])

  const uploadImage = useCallback(
    async (formData: FormData): Promise<void> => {
      const creatorId = getEmployeeIdFromToken()

      if (!creatorId) {
        throw new Error('Authentication required')
      }

      formData.append('creatorId', creatorId)

      if (file) {
        formData.set('item', file)
      }

      const response = await fetch(`${API}admin/gallery/image/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          errorText || `HTTP ${response.status}: ${response.statusText}`,
        )
      }
    },
    [file],
  )

  const validateAndSubmit = useCallback(
    async (formData: FormData) => {
      if (isSubmitting) return

      setFormErrors({})
      setErrorMessage(null)

      const errors = validateForm(formData, file)

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setIsSubmitting(true)

      try {
        await uploadImage(formData)
        localStorage.setItem('lastFormSubmission', Date.now().toString())
        resetForm()

        if (onSuccess) {
          onSuccess()
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Network error occurred'
        setErrorMessage(message)
        console.error('Upload error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [file, isSubmitting, validateForm, uploadImage, resetForm, onSuccess],
  )

  return {
    file,
    isSubmitting,
    errorMessage,
    formErrors,
    setFile,
    clearFieldError,
    validateAndSubmit,
    resetForm,
  }
}
