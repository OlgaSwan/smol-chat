import React, {
  FunctionComponent,
  Dispatch,
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
} from 'react'

import { Query } from 'appwrite'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import Message from '../message/message'
import useObserver from '../../hooks/useObserver'

import { MessageExternal, MessageInternal } from '../../types/message'
import { Chat } from '../../types/chat'

import {
  createInternalType,
  createSingleInternalType,
} from '../../utils/createInternalType'

interface MessageListProps {
  chat: Chat
  setMessage: Dispatch<React.SetStateAction<MessageInternal | null>>
}

const MessageList: FunctionComponent<MessageListProps> = ({
  chat,
  setMessage,
}) => {
  const [messages, setMessages] = useState<Array<MessageInternal>>([])
  const lastId = messages.length > 0 ? messages[messages.length - 1].$id : null
  const ref = useRef<HTMLDivElement | null>(null)
  const { isIntersecting, resetObserver } = useObserver(ref)
  const [keepFetching, setKeepFetching] = useState(true)
  const limit = 10

  const getMessages = async (chat_id: string) => {
    const response = await databases.listDocuments<MessageExternal>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.equal('chat_id', chat_id),
      ]
    )

    const messages = await createInternalType(response.documents)
    setMessages(messages)
  }

  const getMoreMessages = useCallback(
    async (lastId: string, chat_id: string) => {
      const response = await databases.listDocuments<MessageExternal>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.cursorAfter(lastId),
          Query.equal('chat_id', chat_id),
        ]
      )
      if (response.documents.length > 0) {
        const messages = await createInternalType(response.documents)
        setMessages((prev) => [...prev, ...messages])
      } else {
        setKeepFetching(false)
      }
      resetObserver()
    },
    [resetObserver]
  )

  useEffect(() => {
    getMessages(chat.chat_id)
    const unsubscribe = client.subscribe<MessageExternal>(
      [
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      ],
      async (response) => {
        if (response.payload.chat_id === chat.chat_id) {
          const message = await createSingleInternalType(response.payload)

          if (
            response.events.includes(
              'databases.*.collections.*.documents.*.create'
            )
          ) {
            setMessages((prevState) => [message, ...prevState])
          }

          if (
            response.events.includes(
              'databases.*.collections.*.documents.*.delete'
            )
          ) {
            setMessages((prevState) =>
              prevState.filter(
                (message) => message.$id !== response.payload.$id
              )
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
      }
    )

    return () => {
      unsubscribe()
    }
  }, [chat])

  useEffect(() => {
    if (isIntersecting && lastId && keepFetching)
      getMoreMessages(lastId, chat.chat_id)
  }, [isIntersecting, lastId, keepFetching, getMoreMessages, chat.chat_id])

  return (
    <div className='message--list'>
      {messages.map((message, index) => (
        <Message
          key={message.$id}
          message={message}
          setMessage={setMessage}
          ref={index == messages.length - 1 ? ref : null}
        />
      ))}
    </div>
  )
}

const MemoizedMessageList = memo(MessageList)

export default MemoizedMessageList
