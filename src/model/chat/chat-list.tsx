import React, { FunctionComponent, useEffect, useState } from 'react'
import { Query } from 'appwrite'
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_CHATS,
  COLLECTION_ID_CHATS_MEMBERS,
} from '../../appwrite-config'

import ChatGlobal from './chat-global'
import ChatComponent from './chat-component'
import { useAuth } from '../../context/auth-context'

import { Chat, ChatsMembers } from '../../types/chat'

import { Divider } from '@mui/material'

interface ChatListProps {
  onClick: (chat: Chat) => void
}

const ChatList: FunctionComponent<ChatListProps> = ({ onClick }) => {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])

  const getChats = async (user_id: string) => {
    const userChats = await databases.listDocuments<ChatsMembers>(
      DATABASE_ID,
      COLLECTION_ID_CHATS_MEMBERS,
      [Query.equal('user_id', user_id)]
    )

    const chats = await Promise.all(
      userChats.documents.map(async (d) => {
        const response = await databases.listDocuments<Chat>(
          DATABASE_ID,
          COLLECTION_ID_CHATS,
          [Query.equal('chat_id', d.chat_id), Query.limit(1)]
        )
        return response.documents[0]
      })
    )
    if (chats.length > 0) setChats(chats)
  }

  useEffect(() => {
    if (user) getChats(user.$id)
  }, [user])

  return (
    <>
      <ChatGlobal onClick={onClick} />
      <Divider />
      {chats.map((chat) => (
        <div className='chat-list--container' key={chat.$id}>
          <ChatComponent chat={chat} onClick={onClick} />
        </div>
      ))}
    </>
  )
}

export default ChatList
