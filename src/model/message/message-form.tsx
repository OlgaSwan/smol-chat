import React, { FunctionComponent, useState, useEffect, Dispatch } from 'react'

import { Permission, Role, ID, Query } from 'appwrite'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../../appwrite-config'

import { MessageType } from './message'
import { useAuth } from '../../utils/auth-context'

interface MessageFormProps {
  id: string
  setId: Dispatch<React.SetStateAction<string>>
}

const MessageForm: FunctionComponent<MessageFormProps> = (messageFormProps) => {
  const { user } = useAuth()
  const [messageBody, setMessageBody] = useState('')

  const getMessage = async (id: string) => {
    const message = await databases.getDocument<MessageType>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      id
    )
    setMessageBody(message.body)
  }

  useEffect(() => {
    if (messageFormProps.id) getMessage(messageFormProps.id)
  }, [messageFormProps.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) return

    const messageSent = {
      body: messageBody,
      user_name: user.name,
      user_id: user.$id,
    }

    const permissions = [Permission.write(Role.user(user.$id))]

    if (messageFormProps.id) {
      await databases.updateDocument<MessageType>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        messageFormProps.id,
        messageSent
      )
      messageFormProps.setId('')
      setMessageBody('')
    } else {
      const response = await databases.createDocument<MessageType>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        messageSent,
        permissions
      )
      console.log('created', response)
      setMessageBody('')
    }
  }
  return (
    <form onSubmit={handleSubmit} id="message--form">
      <div>
        <textarea
          required
          maxLength={1000}
          placeholder="Say something..."
          onChange={(e) => setMessageBody(e.target.value)}
          value={messageBody}
        ></textarea>
      </div>
      <div className="send-btn--wrapper">
        <input
          className="btn btn--secondary"
          type="submit"
          value={messageFormProps.id ? 'Edit' : 'Send'}
        />
      </div>
    </form>
  )
}

export default MessageForm
