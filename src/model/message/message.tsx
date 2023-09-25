import React, { Dispatch, forwardRef } from 'react'

import type { Models } from 'appwrite'
import {
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
  setMessage: Dispatch<React.SetStateAction<MessageType | null>>
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, setMessage }, ref) => {
    const { user } = useAuth()

    const deleteMessage = async (message_id: string) =>
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        message_id
      )

    const editMessage = async (message: MessageType) => {
      setMessage(message)
    }

    return (
      <div className='message--wrapper' ref={ref}>
        {user?.$id == message.user_id ? (
          <>
            <div className='message--header--owner'>
              <small className='message-timestamp'>
                {new Date(message.$createdAt).toLocaleString([], {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </small>
              {user &&
                message.$permissions.includes(`delete("user:${user.$id}")`) && (
                  <div className='icons--wrapper'>
                    <Edit
                      className='edit--btn'
                      onClick={() => editMessage(message)}
                    />
                    <Trash2
                      className='delete--btn'
                      onClick={() => deleteMessage(message.$id)}
                    />
                  </div>
                )}
            </div>
            <div className='message--body--owner'>
              <span>{message.body}</span>
            </div>
          </>
        ) : (
          <>
            <div className='message--header'>
              <p>
                {message.user_name ? (
                  <span>{message.user_name}</span>
                ) : (
                  <span>Anonymous user</span>
                )}
                <small className='message-timestamp'>
                  {new Date(message.$createdAt).toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </small>
              </p>
            </div>
            <div className='message--body'>
              <span>{message.body}</span>
            </div>
          </>
        )}
      </div>
    )
  }
)

export default Message
