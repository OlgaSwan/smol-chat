import { Query } from 'appwrite'
import { COLLECTION_ID_USERS, DATABASE_ID, databases } from '../appwrite-config'
import { User } from '../types/user'

export const searchUserByName = async (searchText: string): Promise<User[]> => {
  if (!searchText.trim()) return []

  const response = await databases.listDocuments<User>(
    DATABASE_ID,
    COLLECTION_ID_USERS,
    [Query.search('name', searchText)]
  )

  return response.documents
}
