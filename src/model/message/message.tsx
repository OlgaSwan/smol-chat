import React, { Dispatch, forwardRef } from 'react'

import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { useAuth } from '../../context/auth-context'

import { MessageInternal } from '../../types/message'

import { Edit, Trash2 } from 'react-feather'

interface MessageProps {
  message: MessageInternal
  setMessage: Dispatch<React.SetStateAction<MessageInternal | null>>
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

    const editMessage = async (message: MessageInternal) => {
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
                <span>{message.user.name}</span>
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
