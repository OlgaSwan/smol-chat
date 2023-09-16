import React, { FunctionComponent } from 'react'

import type { Models } from 'appwrite'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { useAuth } from '../../utils/auth-context'

import { Edit, Trash2 } from 'react-feather'

export type MessageType = {
  body: string
  user_name?: string
  user_id?: string
} & Models.Document

interface MessageProps {
  message: MessageType
  setMessageBody: React.Dispatch<React.SetStateAction<string>>
  setId: React.Dispatch<React.SetStateAction<string>>
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const Message: FunctionComponent<MessageProps> = ({
  message,
  setMessageBody,
  setId,
  setIsEdit,
}) => {
  const { user } = useAuth()

  const deleteMessage = async (message_id: string) =>
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      message_id
    )

  const editMessage = async (message: MessageType) => {
    setMessageBody(message.body)
    setId(message.$id)
    setIsEdit(true)
  }

  return (
    <div key={message.$id} className="message--wrapper">
      <div className="message--header">
        <p>
          {message.user_name ? (
            <span>{message.user_name}</span>
          ) : (
            <span>Anonymous user</span>
          )}
          <small className="message-timestamp">
            {new Date(message.$createdAt).toLocaleString()}
          </small>
        </p>
        {user &&
          message.$permissions.includes(`delete("user:${user.$id}")`) && (
            <div className="icons--wrapper">
              <Edit
                className="edit--btn"
                onClick={() => editMessage(message)}
              />
              <Trash2
                className="delete--btn"
                onClick={() => deleteMessage(message.$id)}
              />
            </div>
          )}
      </div>
      <div className="message--body">
        <span>{message.body}</span>
      </div>
    </div>
  )
}

export default Message
