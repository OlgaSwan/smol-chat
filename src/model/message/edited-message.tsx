import React, { FunctionComponent } from 'react'

interface EditedMessageProps {
  messageBody: string
}

const EditedMessage: FunctionComponent<EditedMessageProps> = ({
  messageBody,
}) => {
  return <div id="header--wrapper">{messageBody.slice(0, 50) + '...'}</div>
}

export default EditedMessage
