'use client'

import { useState } from 'react'
import { uploadApi, BASE_URL } from '@/api'
import { buildImageUrl } from '@/utils/imageUtils'

interface AvatarUploaderProps {
  onUpload: (url: string) => void
}

// Avatar upload component, uploads image and returns file path
export default function AvatarUploader({ onUpload }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      // Use the uploadApi instead of direct fetch
      const result = await uploadApi.uploadSingleFile(file, 'profile');
      
      onUpload(result.file.path); // Pass path to parent
      
      // Set preview URL
      setPreview(buildImageUrl(result.file.path));
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setError(err.response?.data?.message || err.message || 'Upload error');
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <label>Upload Avatar</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {preview && (
        <div style={{ marginTop: 10 }}>
          <p>Preview:</p>
          <img src={preview} alt="avatar" width={100} />
        </div>
      )}
    </div>
  )
}