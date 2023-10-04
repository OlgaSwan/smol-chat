import React, { FunctionComponent, useEffect, useState } from 'react'
import { Query } from 'appwrite'
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_CHATS,
} from '../../appwrite-config'

import { Chat } from '../../types/chat'
import ChatGlobal from './chat-global'
import ChatComponent from './chat-component'

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
      {chats.map((chat) => (
        <ChatComponent chat={chat} onClick={onClick} />
      ))}
    </>
  )
}

export default ChatList
