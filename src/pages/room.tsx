import { FunctionComponent, useState } from 'react'

import EditedMessage from '../model/message/edited-message'
import MessageForm from '../model/message/message-form'
import MemoizedMessageList from '../model/message/message-list'

import { MessageInternal } from '../types/message'

const Room: FunctionComponent = () => {
  const [message, setMessage] = useState<MessageInternal | null>(null)

  return (
    <>
      {message && <EditedMessage messageBody={message.body} />}
      <MessageForm message={message} setMessage={setMessage} />
      <MemoizedMessageList setMessage={setMessage} />
    </>
  )
}

export default Room
