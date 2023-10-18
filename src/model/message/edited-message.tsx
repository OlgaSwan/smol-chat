import React, { FunctionComponent } from 'react'

import { useStore } from '@nanostores/react'

import { editedMessageStore } from '../../stores/edited-message'

const EditedMessage: FunctionComponent = () => {
  const editedMessage = useStore(editedMessageStore.editedMessage)
  if (!editedMessage) return
  const messageBody = editedMessage.body

  return (
    <div id='header--wrapper'>
      <p className='header--link'>
        {messageBody.slice(0, 50).trim() +
          (messageBody.length > 50 ? '...' : '')}
      </p>
    </div>
  )
}

export default EditedMessage
