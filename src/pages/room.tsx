import { FunctionComponent, useState } from 'react'

import EditedMessage from '../model/message/edited-message'
import MessageForm from '../model/message/message-form'
import MemoizedMessageList from '../model/message/message-list'

import { MessageInternal } from '../types/message'
import { Chat } from '../types/chat'

interface RoomProps {
  chat: Chat
}

const Room: FunctionComponent<RoomProps> = ({chat}) => {
  const [message, setMessage] = useState<MessageInternal | null>(null)

  return (
    <>
      {message && <EditedMessage messageBody={message.body} />}
      <MessageForm chat={chat} message={message} setMessage={setMessage} />
      <MemoizedMessageList chat={chat} setMessage={setMessage} />
    </>
  )
}

export default Room
