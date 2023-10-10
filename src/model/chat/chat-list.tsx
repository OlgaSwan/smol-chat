import React, { FunctionComponent, useEffect } from 'react'

import { useStore } from '@nanostores/react'

import { chatsStore } from '../store'

import ChatGlobal from './chat-global'
import ChatComponent from './chat-component'
import { useAuth } from '../../hooks/useAuth'

import { Chat } from '../../types/chat'

import { Divider } from '@mui/material'

interface ChatListProps {
  onClick: (chat: Chat) => void
}

const ChatList: FunctionComponent<ChatListProps> = ({ onClick }) => {
  const { user } = useAuth()
  const chats = useStore(chatsStore.chats)

  useEffect(() => {
    if (user) chatsStore.getChats(user.$id)
  }, [user])

  return (
    <>
      <ChatGlobal onClick={onClick} />
      <Divider sx={{ bgcolor: 'rgba(40, 41, 57, 1)', height: '1.5px' }} />
      {chats.map((chat) => (
        <div className='chat-list--container' key={chat.$id}>
          <ChatComponent chat={chat} onClick={onClick} />
        </div>
      ))}
    </>
  )
}

export default ChatList
