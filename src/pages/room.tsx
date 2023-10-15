import { FunctionComponent } from 'react'

import { editedMessageStore } from '../model/editedMessage'

import EditedMessage from '../model/message/edited-message'
import MessageForm from '../model/message/message-form'
import MemoizedMessageList from '../model/message/message-list'
import { useStore } from '@nanostores/react'

const Room: FunctionComponent = () => {
  const editedMessage = useStore(editedMessageStore.editedMessage)
  return (
    <div>
      {editedMessage && <EditedMessage messageBody={editedMessage.body} />}
      <MessageForm />
      <MemoizedMessageList />
    </div>
  )
}

export default Room
