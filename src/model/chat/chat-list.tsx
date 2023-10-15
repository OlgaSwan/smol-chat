import React, { FunctionComponent, useEffect } from 'react'

import { useStore } from '@nanostores/react'

import { chatsStore } from '../store'
import { selectedChatStore } from '../store'

import ChatGlobal from './chat-global'
import ChatComponent from './chat-component'
import { useAuth } from '../../hooks/useAuth'

import { Chat, ChatType } from '../../types/chat'

import { Divider } from '@mui/material'

interface ChatListProps {
  onClick: (chat: Chat) => void
}

const ChatList: FunctionComponent<ChatListProps> = ({ onClick }) => {
  const { user } = useAuth()
  const chats = useStore(chatsStore.chats)
  const selectedChat = useStore(selectedChatStore.selectedChat)

  useEffect(() => {
    if (user) chatsStore.getChats(user.$id)
  }, [user])

  return (
    <>
      <ChatGlobal
        onClick={onClick}
        isSelected={selectedChat?.type === ChatType.Global}
      />
      <Divider sx={{ bgcolor: 'rgba(40, 41, 57, 1)', height: '1.5px' }} />
      {chats.map((chat) => (
        <ChatComponent
          key={chat.$id}
          chat={chat}
          onClick={onClick}
          isSelected={selectedChat?.chat_id === chat.chat_id}
        />
      ))}
    </>
  )
}

export default ChatList
