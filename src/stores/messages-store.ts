import { Query } from 'appwrite'
import { databases } from '../appwrite-config'

import { atom } from 'nanostores'

import { LIMIT_MESSAGES } from '../constants'
import { createInternalType } from '../utils/createInternalType'

import { MessageExternal, MessageInternal } from '../types/message'

const messages = atom<MessageInternal[]>([])

export const messagesStore = {
  messages,
  getMessages: async (chat_id: string) => {
    const response = await databases.listDocuments<MessageExternal>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(LIMIT_MESSAGES),
        Query.equal('chat_id', chat_id),
      ]
    )

    const messagesResponse = await createInternalType(response.documents)
    messages.set(messagesResponse)
  },
  getMoreMessages: async (lastId: string, chat_id: string) => {
    const response = await databases.listDocuments<MessageExternal>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(LIMIT_MESSAGES),
        Query.cursorAfter(lastId),
        Query.equal('chat_id', chat_id),
      ]
    )
    if (response.documents.length > 0) {
      const messagesResponse = await createInternalType(response.documents)
      messages.set([...messages.get(), ...messagesResponse])
      return true
    }
    return false
  },
  deleteMessage: async (message_id: string) =>
    await databases.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
      message_id
    ),
}
