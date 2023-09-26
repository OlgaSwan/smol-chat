import React, { FunctionComponent, useState, useEffect, Dispatch } from 'react'

import { Permission, Role, ID } from 'appwrite'
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { MessageType } from './message'
import { useAuth } from '../../context/auth-context'

interface MessageFormProps {
  message: MessageType | null
  setMessage: Dispatch<React.SetStateAction<MessageType | null>>
}

const MessageForm: FunctionComponent<MessageFormProps> = ({
  message,
  setMessage,
}) => {
  const { user } = useAuth()
  const [messageBody, setMessageBody] = useState('')
  const maxSymbolsMessage = 500

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
      user_name: user.name,
      user_id: user.$id,
    }

    const permissions = [Permission.write(Role.user(user.$id))]

    if (message) {
      await databases.updateDocument<MessageType>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        message.$id,
        messageSent
      )
      resetForm()
    } else {
      const response = await databases.createDocument<MessageType>(
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
    if (e.key == 'Enter' && e.shiftKey == false) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} onReset={resetForm} id='message--form'>
      <div>
        <textarea
          style={{ resize: 'vertical', maxHeight: '400px', minHeight: '100px' }}
          required
          maxLength={maxSymbolsMessage}
          placeholder='Say something...'
          onChange={(e) => setMessageBody(e.target.value)}
          onKeyDown={onEnterSubmit}
          value={messageBody}
        ></textarea>
      </div>
      <div className='form--footer--wrapper'>
        <div className='countdown--symbols'>
          {messageBody && messageBody.length + '/' + maxSymbolsMessage}
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
            disabled={messageBody.trim().length > 0 ? false : true}
            accessKey='s'
          />
        </div>
      </div>
    </form>
  )
}

export default MessageForm
