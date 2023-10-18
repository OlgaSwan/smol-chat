import { atom } from 'nanostores'
import { messagesStore } from './messages-store'
import { editedMessageStore } from './edited-message'

import { Chat } from '../types/chat'

const selectedChat = atom<Chat | null>(null)
selectedChat.listen((chat) => {
  if (chat) {
    messagesStore.getMessages(chat.chat_id)
  } else messagesStore.messages.set([])
})

selectedChat.listen(() => editedMessageStore.setEditedMessage(null))

export const selectedChatStore = {
  selectedChat,
  setSelectedChat: (chat: Chat) => selectedChat.set(chat),
}
