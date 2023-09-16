import React, { FunctionComponent, useState, useEffect, memo } from 'react'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { ID, Query, Role, Permission } from 'appwrite'

import Message, { MessageType } from '../message/message'

interface MessageListProps {
  setId: React.Dispatch<React.SetStateAction<string>>
}

const MessageList: FunctionComponent<MessageListProps> = ({
  setId,
}) => {
  const [messages, setMessages] = useState<Array<MessageType>>([])

  const getMessages = async () => {
    const response = await databases.listDocuments<MessageType>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    setMessages(response.documents)
  }

  useEffect(() => {
    getMessages()
    const unsubscribe = client.subscribe<MessageType>(
      [
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      ],
      (response) => {
        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.create'
          )
        ) {
          setMessages((prevState) => [response.payload, ...prevState])
        }

        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.delete'
          )
        ) {
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          )
        }

        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.update'
          )
        ) {
          setMessages((prevState) => {
            const prevCopy = [...prevState]
            const messageToUpdate = prevCopy.find(
              (m) => m.$id === response.payload.$id
            )
            if (messageToUpdate) messageToUpdate.body = response.payload.body
            return prevCopy
          })
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  console.log('x')
  return (
    <div>
      {messages.map((message) => (
        <Message
          key={message.$id}
          message={message}
          setId={setId}
        />
      ))}
    </div>
  )
}

const MemoizedMessageList = memo(MessageList)

export default MemoizedMessageList
