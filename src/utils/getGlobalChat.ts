import { Query } from 'appwrite'
import { databases } from '../appwrite-config'
import { Chat } from '../types/chat'

export const getGlobalChat = async (): Promise<Chat | null> => {
  const response = await databases.listDocuments<Chat>(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID_CHATS,
    [Query.equal('type', 'Global'), Query.limit(1)]
  )

  return response.documents.length > 0 ? response.documents[0] : null
}
