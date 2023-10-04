import React, { FunctionComponent, useState, useEffect } from 'react'
import { Query } from 'appwrite'
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_CHATS,
} from '../../appwrite-config'
import { Chat } from '../../types/chat'

interface ChatGlobalProps {
  onClick: (chat: Chat) => void
}

const ChatGlobal: FunctionComponent<ChatGlobalProps> = ({ onClick }) => {
  const [chatGlobal, setChatGlobal] = useState<Chat | null>(null)

  const getChatGlobal = async () => {
    const chatGlobal = await databases.listDocuments<Chat>(
      DATABASE_ID,
      COLLECTION_ID_CHATS,
      [Query.equal('type', 'Global'), Query.limit(1)]
    )
    if (chatGlobal.documents.length > 0) setChatGlobal(chatGlobal.documents[0])
  }

  useEffect(() => {
    getChatGlobal()
  }, [])

  return (
    <>
      {chatGlobal && (
        <div onClick={() => onClick(chatGlobal)}>{chatGlobal.name}</div>
      )}
    </>
  )
}

export default ChatGlobal
