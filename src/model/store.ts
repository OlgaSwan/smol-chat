import { atom } from 'nanostores'

import { MessageExternal, MessageInternal } from '../types/message'
import { Chat, ChatsMembers } from '../types/chat'
import { Query } from 'appwrite'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
  COLLECTION_ID_CHATS,
  COLLECTION_ID_CHATS_MEMBERS,
} from '../appwrite-config'
import {
  createInternalType,
  createSingleInternalType,
} from '../utils/createInternalType'

const messages = atom<MessageInternal[]>([])
const chats = atom<Chat[]>([])
const selectedChat = atom<Chat | null>(null)

const limit = 10

export const messagesStore = {
  messages,
  getMessages: async (chat_id: string) => {
    const response = await databases.listDocuments<MessageExternal>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.equal('chat_id', chat_id),
      ]
    )

    const messagesResponse = await createInternalType(response.documents)
    messages.set(messagesResponse)
  },
  getMoreMessages: async (lastId: string, chat_id: string) => {
    const response = await databases.listDocuments<MessageExternal>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
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
}

export const chatsStore = {
  chats,
  getChats: async (user_id: string) => {
    const userChats = await databases.listDocuments<ChatsMembers>(
      DATABASE_ID,
      COLLECTION_ID_CHATS_MEMBERS,
      [Query.equal('user_id', user_id)]
    )

    const chatsResponse = await Promise.all(
      userChats.documents.map(async (d) => {
        const response = await databases.listDocuments<Chat>(
          DATABASE_ID,
          COLLECTION_ID_CHATS,
          [Query.equal('chat_id', d.chat_id), Query.limit(1)]
        )
        return response.documents[0]
      })
    )
    if (chatsResponse.length > 0) chats.set(chatsResponse)
  },
}

export const selectedChatStore = {
  selectedChat,
  setSelectedChat: (chat: Chat) => selectedChat.set(chat),
}

// Subscribe

client.subscribe<MessageExternal | ChatsMembers>(
  [
    `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
    `databases.${DATABASE_ID}.collections.${COLLECTION_ID_CHATS_MEMBERS}.documents`,
  ],
  async (response) => {
    if (determineMessageExternal(response.payload)) {
      if (response.payload.chat_id !== selectedChat.get()?.chat_id) return
      const message = await createSingleInternalType(response.payload)

      switch (true) {
        case response.events.includes(
          'databases.*.collections.*.documents.*.create'
        ):
          messages.set([message, ...messages.get()])
          break
        case response.events.includes(
          'databases.*.collections.*.documents.*.delete'
        ):
          messages.set(
            messages.get().filter((m) => m.$id !== response.payload.$id)
          )
          break
        case response.events.includes(
          'databases.*.collections.*.documents.*.update'
        ): {
          const prevCopy = [...messages.get()]
          const messageToUpdate = prevCopy.find(
            (m) => m.$id === response.payload.$id
          )
          if (messageToUpdate) messageToUpdate.body = response.payload.body
          messages.set(prevCopy)
          break
        }
      }
    }
    if (determineChatMembers(response.payload)) {
      if (response.payload.user_id !== '1') return
    }
  }
)

const determineMessageExternal = (
  toBeDetermined: MessageExternal | ChatsMembers
): toBeDetermined is MessageExternal => {
  if ((toBeDetermined as MessageExternal).body) {
    return true
  }
  return false
}

const determineChatMembers = (
  toBeDetermined: MessageExternal | ChatsMembers
): toBeDetermined is ChatsMembers => {
  if (!(toBeDetermined as ChatsMembers).body) {
    return true
  }
  return false
}
