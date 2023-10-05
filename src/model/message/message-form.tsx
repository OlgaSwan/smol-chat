import React, { FunctionComponent, useState, useEffect, Dispatch } from 'react'

import { Permission, Role, ID } from 'appwrite'
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { useAuth } from '../../context/auth-context'
import { useFriendId } from '../../hooks/useFriend'

import { MessageExternal, MessageInternal } from '../../types/message'
import { Chat, ChatType } from '../../types/chat'

interface MessageFormProps {
  chat: Chat
  message: MessageInternal | null
  setMessage: Dispatch<React.SetStateAction<MessageInternal | null>>
}

const MessageForm: FunctionComponent<MessageFormProps> = ({
  chat,
  message,
  setMessage,
}) => {
  const { user } = useAuth()
  const friendId = useFriendId(chat)
  const [messageBody, setMessageBody] = useState('')
  const MaxSymbolsMessage = 500

  useEffect(() => {
    if (message) setMessageBody(message.body)
  }, [message])

  const resetForm = () => {
    setMessage(null)
    setMessageBody('')
  }

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault()

    if (!user) return

    const messageSent = {
      body: messageBody.trimStart().trimEnd(),
      user_id: user.$id,
      chat_id: chat.chat_id,
    }

    const permissions = [Permission.write(Role.user(user.$id))]

    if (chat.type === ChatType.Global)
      permissions.push(Permission.read(Role.users()))
    if (chat.type === ChatType.Private && friendId) {
      permissions.push(Permission.read(Role.user(user.$id)))
      permissions.push(Permission.read(Role.user(friendId)))
    }

    if (message) {
      await databases.updateDocument<MessageExternal>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        message.$id,
        messageSent
      )
      resetForm()
    } else {
      await databases.createDocument<MessageExternal>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        messageSent,
        permissions
      )
      setMessageBody('')
    }
  }

  const onEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == 'Enter' && e.shiftKey == false && messageBody.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} onReset={resetForm} id='message--form'>
      <div>
        <textarea
          style={{ resize: 'vertical', maxHeight: '400px', minHeight: '100px' }}
          required
          maxLength={MaxSymbolsMessage}
          placeholder='Say something...'
          onChange={(e) => setMessageBody(e.target.value)}
          onKeyDown={onEnterSubmit}
          value={messageBody}
        ></textarea>
      </div>
      <div className='form--footer--wrapper'>
        <div className='countdown--symbols'>
          {messageBody && messageBody.length + '/' + MaxSymbolsMessage}
        </div>
        <div className='send-btn--wrapper'>
          {message && (
            <button className='btn btn--cancel' type='reset'>
              Cancel
            </button>
          )}

          <input
            className='btn btn--secondary'
            type='submit'
            value={message ? 'Edit' : 'Send'}
            disabled={!messageBody.trim().length}
            accessKey='s'
          />
        </div>
      </div>
    </form>
  )
}

export default MessageForm
