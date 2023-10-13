import { atom, onMount, task } from 'nanostores'

import { Query, RealtimeResponseEvent } from 'appwrite'

import client, { databases } from '../appwrite-config'

import { userStore } from './userStore'

import {
  createInternalType,
  createSingleInternalType,
} from '../utils/createInternalType'
import { getChat } from '../utils/getChat'

import {
  MessageExternal,
  MessageInternal,
  MessageUnread,
} from '../types/message'
import { Chat, ChatsMembers } from '../types/chat'
import { Payload } from '../types/payload'

const messages = atom<MessageInternal[]>([])
const messagesUnread = atom<MessageUnread[]>([])

const chats = atom<Chat[]>([])
const selectedChat = atom<Chat | null>(null)
selectedChat.listen((chat) => {
  if (chat) {
    messagesStore.getMessages(chat.chat_id)
  } else messages.set([])
})

const limit = 10

export const messagesStore = {
  messages,
  getMessages: async (chat_id: string) => {
    const response = await databases.listDocuments<MessageExternal>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
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
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
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
  deleteMessage: async (message_id: string) =>
    await databases.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
      message_id
    ),
}

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

export const selectedChatStore = {
  selectedChat,
  setSelectedChat: (chat: Chat) => selectedChat.set(chat),
}

// Subscribe

client.subscribe<Payload>(
  [
    `databases.${import.meta.env.VITE_DATABASE_ID}.collections.${
      import.meta.env.VITE_COLLECTION_ID_MESSAGES
    }.documents`,
    `databases.${import.meta.env.VITE_DATABASE_ID}.collections.${
      import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS
    }.documents`,
    `databases.${import.meta.env.VITE_DATABASE_ID}.collections.${
      import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD
    }.documents`,
  ],
  async (response) => {
    if (determineMessageExternal(response)) {
      if (
        response.events.includes('databases.*.collections.*.documents.*.create')
      ) {
        const chatsLocal = chats.get()
        const chatUpdated = chatsLocal.find(
          (c) => c.chat_id === response.payload.chat_id
        )

        if (chatUpdated) {
          const prevCopyFiltered = chatsLocal.filter(
            (c) => c.chat_id !== chatUpdated.chat_id
          )
          prevCopyFiltered.unshift(chatUpdated)
          chats.set(prevCopyFiltered)
        }
      }

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

    if (determineMessageUnread(response)) {
      if (response.payload.user_id !== userStore.user.get()?.$id) return

      if (
        response.events.includes('databases.*.collections.*.documents.*.create')
      ) {
        messagesUnread.set([response.payload, ...messagesUnread.get()])
      }

      if (
        response.events.includes('databases.*.collections.*.documents.*.delete')
      ) {
        messagesUnread.set(
          messagesUnread.get().filter((m) => m.$id !== response.payload.$id)
        )
      }
    }

    if (determineChatMembers(response)) {
      if (response.payload.user_id !== userStore.user.get()?.$id) return
      switch (true) {
        case response.events.includes(
          'databases.*.collections.*.documents.*.create'
        ): {
          const chat = await getChat(response.payload.chat_id)
          if (chat) chats.set([chat, ...chats.get()])
          break
        }
        case response.events.includes(
          'databases.*.collections.*.documents.*.delete'
        ):
          chats.set(
            chats.get().filter((c) => c.chat_id !== response.payload.chat_id)
          )
          break
      }
    }
  }
)

const determineMessageExternal = (
  toBeDetermined: RealtimeResponseEvent<Payload>
): toBeDetermined is RealtimeResponseEvent<MessageExternal> => {
  return toBeDetermined.channels.includes(getChannel(import.meta.env.VITE_COLLECTION_ID_MESSAGES))
}

const determineMessageUnread = (
  toBeDetermined: RealtimeResponseEvent<Payload>
): toBeDetermined is RealtimeResponseEvent<MessageUnread> => {
  return toBeDetermined.channels.includes(getChannel(import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD))
}

const determineChatMembers = (
  toBeDetermined: RealtimeResponseEvent<Payload>
): toBeDetermined is RealtimeResponseEvent<ChatsMembers> => {
  return toBeDetermined.channels.includes(getChannel(import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS))
}

const getChannel = (collection_id:string) : string => {
  return `databases.${import.meta.env.VITE_DATABASE_ID}.collections.${collection_id}.documents`
}
