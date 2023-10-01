import { BUCKET_ID, storage } from '../appwrite-config'
import { User } from '../types/auth-context'

export const getUserPhoto = (user: User): string | null => {
  if (!user.photo_id) return null

  return storage.getFilePreview(BUCKET_ID, user.photo_id).toString()
}
