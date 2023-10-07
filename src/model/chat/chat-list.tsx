import React, { FunctionComponent, useEffect, useState } from 'react'
import { Query } from 'appwrite'
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_CHATS,
} from '../../appwrite-config'

import ChatGlobal from './chat-global'
import ChatComponent from './chat-component'
import { Chat } from '../../types/chat'

import { Divider } from '@mui/material'

interface ChatListProps {
  onClick: (chat: Chat) => void
}

const ChatList: FunctionComponent<ChatListProps> = ({ onClick }) => {
  const [chats, setChats] = useState<Chat[]>([])

  const getChats = async () => {
    const chats = await databases.listDocuments<Chat>(
      DATABASE_ID,
      COLLECTION_ID_CHATS,
      [Query.equal('type', 'Private')]
    )
    if (chats.documents.length > 0) setChats(chats.documents)
  }

  useEffect(() => {
    getChats()
  }, [])

  return (
    <>
      <ChatGlobal onClick={onClick} />
      <Divider />
      {chats.map((chat) => (
        <div className='chat-list--container'>
          <ChatComponent key={chat.$id} chat={chat} onClick={onClick} />
        </div>
      ))}
    </>
  )
}

export default ChatList
