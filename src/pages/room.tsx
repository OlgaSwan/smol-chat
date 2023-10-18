import { FunctionComponent } from 'react'

import EditedMessage from '../model/message/edited-message'
import MessageForm from '../model/message/message-form'
import MemoizedMessageList from '../model/message/message-list'

const Room: FunctionComponent = () => {
  return (
    <>
      <EditedMessage />
      <MessageForm />
      <MemoizedMessageList />
    </>
  )
}

export default Room
