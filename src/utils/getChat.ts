import { Query } from 'appwrite'
import { COLLECTION_ID_CHATS, DATABASE_ID, databases } from '../appwrite-config'

import { Chat } from '../types/chat'

export const getChat = async (chat_id: string): Promise<Chat | null> => {
  const response = await databases.listDocuments<Chat>(
    DATABASE_ID,
    COLLECTION_ID_CHATS,
    [Query.equal('chat_id', chat_id)]
  )
  if (response.documents.length > 0) return response.documents[0]
  return null
}