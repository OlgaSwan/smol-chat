import React, { Dispatch, forwardRef, useState, useEffect, useRef } from 'react'

import { messagesStore, messagesUnreadStore } from '../store'
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
    const isEffectRun = useRef(false);
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

    const editMessage = async (message: MessageInternal) => {
      setMessage(message)
    }

    useEffect(() => {
      if (!isEffectRun.current) {
        messagesUnreadStore.deleteMessage(message.$id);
        isEffectRun.current = true;
      }
    }, [message.$id]);

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
                      onClick={() => messagesStore.deleteMessage(message.$id)}
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
