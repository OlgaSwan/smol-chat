import { Query } from 'appwrite'
import { COLLECTION_ID_CHATS, DATABASE_ID, databases } from '../appwrite-config'
import { Chat } from '../types/chat'

export const getGlobalChat = async (): Promise<Chat | null> => {
  const response = await databases.listDocuments<Chat>(
    DATABASE_ID,
    COLLECTION_ID_CHATS,
    [Query.equal('type', 'Global'), Query.limit(1)]
  )

  return response.documents.length > 0 ? response.documents[0] : null
}
