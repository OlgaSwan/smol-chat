import { Query } from 'appwrite'
import { databases } from '../appwrite-config'

import { atom, onMount, task } from 'nanostores'

import { userStore } from './user-store'

import { Chat, ChatsMembers } from '../types/chat'

const chats = atom<Chat[]>([])

onMount(chats, () => {
  task(async () => {
    const user = userStore.user.get()
    if (user) await chatsStore.getChats(user.$id)
  })
})

export const chatsStore = {
  chats,
  getChats: async (user_id: string) => {
    const userChats = await databases.listDocuments<ChatsMembers>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
      [Query.equal('user_id', user_id)]
    )

    const chatsResponse = await Promise.all(
      userChats.documents.map(async (d) => {
        const response = await databases.listDocuments<Chat>(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID_CHATS,
          [Query.equal('chat_id', d.chat_id), Query.limit(1)]
        )
        return response.documents[0]
      })
    )
    if (chatsResponse.length > 0)
      chats.set(
        chatsResponse.sort(
          (a, b) => (b.last_updated_time ?? 0) - (a.last_updated_time ?? 0)
        )
      )
  },
}
