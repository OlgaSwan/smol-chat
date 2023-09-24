import React, {
  FunctionComponent,
  Dispatch,
  useState,
  useEffect,
  useRef,
  memo,
} from 'react'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { Query } from 'appwrite'

import Message, { MessageType } from '../message/message'
import useObserver from '../../hooks/useObserver'

interface MessageListProps {
  setMessage: Dispatch<React.SetStateAction<MessageType | null>>
}

const MessageList: FunctionComponent<MessageListProps> = ({ setMessage }) => {
  const [messages, setMessages] = useState<Array<MessageType>>([])
  const ref = useRef<HTMLDivElement | null>(null)
  const isIntersecting = useObserver(ref, messages)
  console.log(isIntersecting)

  const getMessages = async () => {
    const response = await databases.listDocuments<MessageType>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc('$createdAt'), Query.limit(10), Query.offset(0)]
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

  return (
    <div className="message--list">
      {messages.map((message, index) => (
        <div ref={index == messages.length - 1 ? ref : null}>
          <Message
            key={message.$id}
            message={message}
            setMessage={setMessage}
          />
        </div>
      ))}
    </div>
  )
}

const MemoizedMessageList = memo(MessageList)

export default MemoizedMessageList
