import { databases } from '../appwrite-config'
import { User } from '../types/user'

export const getUser = async (id: string) => {
  return await databases.getDocument<User>(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID_USERS,
    id
  )
}
