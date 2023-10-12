import { Query } from 'appwrite'
import { databases } from '../appwrite-config'

import { Chat } from '../types/chat'

export const getChat = async (chat_id: string): Promise<Chat | null> => {
  const response = await databases.listDocuments<Chat>(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID_CHATS,
    [Query.equal('chat_id', chat_id)]
  )
  if (response.documents.length > 0) return response.documents[0]
  return null
}
