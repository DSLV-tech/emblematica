import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/firebase/config'

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  function validate(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Formato non supportato. Usa JPG, PNG, WebP o AVIF.'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Il file supera il limite di ${MAX_SIZE_MB}MB.`
    }
    return null
  }

  async function upload(file: File, path: string): Promise<string> {
    const validationError = validate(file)
    if (validationError) {
      setError(validationError)
      throw new Error(validationError)
    }

    setError(null)
    setUploading(true)
    setProgress(0)

    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path)
      const task = uploadBytesResumable(storageRef, file)

      task.on(
        'state_changed',
        snapshot => {
          setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
        },
        err => {
          setUploading(false)
          const msg = 'Errore nel caricamento. Riprova.'
          setError(msg)
          reject(new Error(msg))
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref)
            setUploading(false)
            setProgress(100)
            resolve(url)
          } catch {
            setUploading(false)
            reject(new Error('Errore nel recupero URL.'))
          }
        }
      )
    })
  }

  async function remove(url: string) {
    try {
      const storageRef = ref(storage, url)
      await deleteObject(storageRef)
    } catch {
      // ignora se il file non esiste
    }
  }

  function reset() {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return { uploading, progress, error, upload, remove, reset }
}
