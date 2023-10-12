import { storage } from '../appwrite-config'
import { User } from '../types/user'

export const getUserPhoto = (user: User): string | null => {
  if (!user.photo_id) return null

  return storage
    .getFilePreview(import.meta.env.VITE_BUCKET_ID, user.photo_id)
    .toString()
}
