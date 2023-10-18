import { Query } from 'appwrite'
import { databases } from '../appwrite-config'

import { atom, onMount, task } from 'nanostores'

import { userStore } from './user-store'

import { MessageUnread } from '../types/message'

const messagesUnread = atom<MessageUnread[]>([])

onMount(messagesUnread, () => {
  task(async () => {
    const user = userStore.user.get()
    if (user) await messagesUnreadStore.getMessagesUnread(user.$id)
  })
})

export const messagesUnreadStore = {
  messagesUnread,
  getMessagesUnread: async (user_id: string) => {
    const response = await databases.listDocuments<MessageUnread>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
      [Query.equal('user_id', user_id)]
    )
    messagesUnread.set(response.documents)
  },
  deleteMessage: async (message_id: string) => {
    const messageUnread = await databases.listDocuments<MessageUnread>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
      [Query.equal('message_id', message_id)]
    )
    if (messageUnread.total > 0)
      await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
        messageUnread.documents[0].$id
      )
  },
  deleteByChatId: async (chat_id: string) => {
    const messagesToDelete = await databases.listDocuments<MessageUnread>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
      [Query.equal('chat_id', chat_id)]
    )

    messagesToDelete.documents.forEach(async (d) => {
      await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
        d.$id
      )
    })
  },
}
