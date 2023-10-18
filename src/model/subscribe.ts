import { RealtimeResponseEvent } from 'appwrite'
import client, { databases } from '../appwrite-config'

import { userStore } from '../stores/user-store'
import { messagesStore } from '../stores/messages-store'
import { messagesUnreadStore } from '../stores/messages-unread-store'
import { chatsStore } from '../stores/chat-store'
import { selectedChatStore } from '../stores/selected-chat-store'

import { EVENT_CREATE, EVENT_DELETE, EVENT_UPDATE } from '../constants'
import { createSingleInternalType } from '../utils/createInternalType'
import { getChat } from '../utils/getChat'

import { MessageExternal, MessageUnread } from '../types/message'
import { ChatsMembers } from '../types/chat'
import { Payload } from '../types/payload'
import { getChannel } from '../utils/getChannel'

const channels = [
  getChannel(import.meta.env.VITE_COLLECTION_ID_MESSAGES),
  getChannel(import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS),
  getChannel(import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD),
]

export const subscribe = () =>
  client.subscribe<Payload>(channels, async (response) => {
    if (determineMessageExternal(response))
      await handleMessageExternal(response)
    if (determineMessageUnread(response)) await handleMessageUnread(response)
    if (determineChatMembers(response)) await handleChatMembers(response)
  })

const handleMessageExternal = async (
  response: RealtimeResponseEvent<MessageExternal>
) => {
  if (response.events.includes(EVENT_CREATE)) {
    const chatsLocal = chatsStore.chats.get()
    const chatUpdated = chatsLocal.find(
      (c) => c.chat_id === response.payload.chat_id
    )

    if (chatUpdated) {
      const prevCopyFiltered = chatsLocal.filter(
        (c) => c.chat_id !== chatUpdated.chat_id
      )
      prevCopyFiltered.unshift(chatUpdated)
      chatsStore.chats.set(prevCopyFiltered)
    }
  }

  if (
    response.payload.chat_id !== selectedChatStore.selectedChat.get()?.chat_id
  )
    return
  const message = await createSingleInternalType(response.payload)

  switch (true) {
    case response.events.includes(EVENT_CREATE):
      messagesStore.messages.set([message, ...messagesStore.messages.get()])
      break
    case response.events.includes(EVENT_DELETE):
      messagesStore.messages.set(
        messagesStore.messages
          .get()
          .filter((m) => m.$id !== response.payload.$id)
      )
      break
    case response.events.includes(EVENT_UPDATE): {
      const prevCopy = [...messagesStore.messages.get()]
      const messageToUpdate = prevCopy.find(
        (m) => m.$id === response.payload.$id
      )
      if (messageToUpdate) messageToUpdate.body = response.payload.body
      messagesStore.messages.set(prevCopy)
      break
    }
  }
}

const handleMessageUnread = async (
  response: RealtimeResponseEvent<MessageUnread>
) => {
  if (response.payload.user_id !== userStore.user.get()?.$id) return

  if (response.events.includes(EVENT_CREATE)) {
    if (
      response.payload.chat_id === selectedChatStore.selectedChat.get()?.chat_id
    )
      await deleteUnreadMessage(response.payload.$id)
    else
      messagesUnreadStore.messagesUnread.set([
        response.payload,
        ...messagesUnreadStore.messagesUnread.get(),
      ])
  }

  if (response.events.includes(EVENT_DELETE)) {
    messagesUnreadStore.messagesUnread.set(
      messagesUnreadStore.messagesUnread
        .get()
        .filter((m) => m.$id !== response.payload.$id)
    )
  }
}

const handleChatMembers = async (
  response: RealtimeResponseEvent<ChatsMembers>
) => {
  if (response.payload.user_id !== userStore.user.get()?.$id) return
  switch (true) {
    case response.events.includes(EVENT_CREATE): {
      const chat = await getChat(response.payload.chat_id)
      if (chat) chatsStore.chats.set([chat, ...chatsStore.chats.get()])
      break
    }
    case response.events.includes(EVENT_DELETE):
      chatsStore.chats.set(
        chatsStore.chats
          .get()
          .filter((c) => c.chat_id !== response.payload.chat_id)
      )
      break
  }
}
const determineMessageExternal = (
  toBeDetermined: RealtimeResponseEvent<Payload>
): toBeDetermined is RealtimeResponseEvent<MessageExternal> => {
  return toBeDetermined.channels.includes(
    getChannel(import.meta.env.VITE_COLLECTION_ID_MESSAGES)
  )
}

const determineMessageUnread = (
  toBeDetermined: RealtimeResponseEvent<Payload>
): toBeDetermined is RealtimeResponseEvent<MessageUnread> => {
  return toBeDetermined.channels.includes(
    getChannel(import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD)
  )
}

const determineChatMembers = (
  toBeDetermined: RealtimeResponseEvent<Payload>
): toBeDetermined is RealtimeResponseEvent<ChatsMembers> => {
  return toBeDetermined.channels.includes(
    getChannel(import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS)
  )
}

const deleteUnreadMessage = async (message_unread_id: string) => {
  await databases.deleteDocument(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
    message_unread_id
  )
}
