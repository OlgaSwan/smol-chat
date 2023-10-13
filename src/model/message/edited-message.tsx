import React, { FunctionComponent } from 'react'

interface EditedMessageProps {
  messageBody: string
}

const EditedMessage: FunctionComponent<EditedMessageProps> = ({
  messageBody,
}) => {
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
