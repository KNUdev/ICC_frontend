import { useState } from 'react'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a file to upload')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/minio', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    alert(data.message || data.error)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='file'
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
          }
        }}
      />
      <button type='submit'>Upload</button>
    </form>
  )
}
