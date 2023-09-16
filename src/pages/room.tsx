import React, { useState, useEffect } from 'react'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../appwrite-config'
import { ID, Query, Role, Permission } from 'appwrite'

import Header from '../components/header'
import { MessageType } from '../model/message/message'
import MemoizedMessageList from '../model/message/message-list'

import { useAuth } from '../utils/auth-context'

const Room = () => {
  const { user } = useAuth()
  const [messageBody, setMessageBody] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) return

    const messageSent = {
      body: messageBody,
      user_name: user.name,
      user_id: user.$id,
    }

    const permissions = [Permission.write(Role.user(user.$id))]

    if (isEdit) {
      await databases.updateDocument<MessageType>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        id,
        messageSent
      )
      setIsEdit(false)
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
    <main className="container">
      <Header />
      <div className="room--container">
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
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <MemoizedMessageList
          setMessageBody={setMessageBody}
          setId={setId}
          setIsEdit={setIsEdit}
        />
      </div>
    </main>
  )
}

export default Room
