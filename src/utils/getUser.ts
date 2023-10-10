import { databases, DATABASE_ID, COLLECTION_ID_USERS } from '../appwrite-config'
import { User } from '../types/user'

export const getUser = async (id: string) => {
  return await databases.getDocument<User>(DATABASE_ID, COLLECTION_ID_USERS, id)
}
