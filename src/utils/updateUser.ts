import { Models } from 'appwrite'
import { databases } from '../appwrite-config'
import { User } from '../types/user'
export const updateUser = async (
  id: string,
  data: Partial<Omit<User, keyof Models.Document>>
) => {
  await databases.updateDocument<User>(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID_USERS,
    id,
    data
  )
}
