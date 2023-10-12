import React, { Dispatch, forwardRef, useRef, useState } from 'react'

import { databases } from '../../appwrite-config'

import MiniProfile from '../../components/mini-profile'

import { useAuth } from '../../hooks/useAuth'
import { MessageInternal } from '../../types/message'

import { Popover } from '@mui/material'
import { Edit, Trash2 } from 'react-feather'

interface MessageProps {
  message: MessageInternal
  setMessage: Dispatch<React.SetStateAction<MessageInternal | null>>
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, setMessage }, ref) => {
    const { user } = useAuth()
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(event.currentTarget)
      setOpen(true)
    }

    const handleClose = () => {
      setAnchorEl(null)
      setOpen(false)
    }

    const deleteMessage = async (message_id: string) =>
      await databases.deleteDocument(
        import.meta.env.VITE_BUCKET_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES,
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
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              slotProps={{ paper: { sx: { borderRadius: '10px' } } }}
            >
              <MiniProfile id={message.user_id} />
            </Popover>
            <div className='message--header' onClick={(e) => handleClick(e)}>
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
