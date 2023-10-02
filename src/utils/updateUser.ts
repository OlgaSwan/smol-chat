import { Models } from 'appwrite'
import { databases, DATABASE_ID, COLLECTION_ID_USERS } from '../appwrite-config'
import { User } from '../types/auth-context'
export const updateUser = async (
  id: string,
  data: Partial<Omit<User, keyof Models.Document>>
) => {
  await databases.updateDocument<User>(
    DATABASE_ID,
    COLLECTION_ID_USERS,
    id,
    data
  )
}
