import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from 'react'

import { useStore } from '@nanostores/react'

import { messagesStore } from '../../stores/messages-store'
import { selectedChatStore } from '../../stores/selected-chat-store'

import Message from '../message/message'
import useObserver from '../../hooks/useObserver'

const MessageList: FunctionComponent = () => {
  const messages = useStore(messagesStore.messages)
  const selectedChat = useStore(selectedChatStore.selectedChat)
  const ref = useRef<HTMLDivElement | null>(null)
  const { isIntersecting, resetObserver } = useObserver(ref)
  const [keepFetching, setKeepFetching] = useState(true)

  const lastId = useMemo(
    () => (messages.length > 0 ? messages[messages.length - 1].$id : null),
    [messages]
  )

  const getMoreMessages = useCallback(
    async (lastId: string, chat_id: string) => {
      if (!(await messagesStore.getMoreMessages(lastId, chat_id)))
        setKeepFetching(false)
      resetObserver()
    },
    [resetObserver]
  )

  useEffect(() => {
    if (isIntersecting && lastId && keepFetching && selectedChat)
      getMoreMessages(lastId, selectedChat.chat_id)
  }, [isIntersecting, lastId, keepFetching, getMoreMessages, selectedChat])

  return (
    <div className='message--list'>
      {messages.map((message, index) => (
        <Message
          key={message.$id}
          message={message}
          ref={index == messages.length - 1 ? ref : null}
        />
      ))}
    </div>
  )
}

const MemoizedMessageList = memo(MessageList)

export default MemoizedMessageList
