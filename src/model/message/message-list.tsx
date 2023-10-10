import React, {
  FunctionComponent,
  Dispatch,
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
} from 'react'

import { useStore } from '@nanostores/react'

import { messagesStore } from '../store'

import Message from '../message/message'
import useObserver from '../../hooks/useObserver'

import { MessageInternal } from '../../types/message'
import { Chat } from '../../types/chat'

interface MessageListProps {
  chat: Chat
  setMessage: Dispatch<React.SetStateAction<MessageInternal | null>>
}

const MessageList: FunctionComponent<MessageListProps> = ({
  chat,
  setMessage,
}) => {
  const messages = useStore(messagesStore.messages)
  const lastId = messages.length > 0 ? messages[messages.length - 1].$id : null
  const ref = useRef<HTMLDivElement | null>(null)
  const { isIntersecting, resetObserver } = useObserver(ref)
  const [keepFetching, setKeepFetching] = useState(true)

  const getMoreMessages = useCallback(
    async (lastId: string, chat_id: string) => {
      if (!(await messagesStore.getMoreMessages(lastId, chat_id)))
        setKeepFetching(false)
      resetObserver()
    },
    [resetObserver]
  )

  useEffect(() => {
    messagesStore.getMessages(chat.chat_id)
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
