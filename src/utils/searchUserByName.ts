import { Query } from 'appwrite'
import { databases } from '../appwrite-config'

import { LIMIT_USER_SEARCH } from '../constants'
import { User } from '../types/user'

export const searchUserByName = async (searchText: string): Promise<User[]> => {
  if (!searchText.trim()) return []

  const response = await databases.listDocuments<User>(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID_USERS,
    [Query.search('name', searchText), Query.limit(LIMIT_USER_SEARCH)]
  )

  return response.documents
}
