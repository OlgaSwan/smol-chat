import React, { useState, useEffect } from 'react'
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from '../appwrite-config'
import { ID, Query, Role, Permission } from 'appwrite'

import Header from '../components/header'

import { useAuth } from '../utils/auth-context'
import { Message } from '../types/message'
import { Edit, Trash2 } from 'react-feather'

const Room = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Array<Message>>([])
  console.log(messages)
  const [messageBody, setMessageBody] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')

  const getMessages = async () => {
    const response = await databases.listDocuments<Message>(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    console.log(response)
    setMessages(response.documents)
  }

  useEffect(() => {
    getMessages()
    const unsubscribe = client.subscribe<Message>(
      [
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      ],
      (response) => {
        console.log(response)

        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.create'
          )
        ) {
          console.log('message was created')
          setMessages((prevState) => [response.payload, ...prevState])
        }

        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.delete'
          )
        ) {
          console.log('message was deleted')
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          )
        }

        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.update'
          )
        ) {
          console.log('message was updated')
          setMessages((prevState) => {
            const prevCopy = [...prevState]
            const messageToUpdate = prevCopy.find(
              (m) => m.$id === response.payload.$id
            )
            if (messageToUpdate) messageToUpdate.body = response.payload.body
            return prevCopy
          })
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) return //marvelous null handling

    const messageSent = {
      body: messageBody,
      user_name: user.name,
      user_id: user.$id,
    }

    const permissions = [Permission.write(Role.user(user.$id))]

    if (isEdit) {
      await databases.updateDocument<Message>(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        id,
        messageSent
      )
      setIsEdit(false)
      setMessageBody('')
    } else {
      const response = await databases.createDocument<Message>(
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

  const deleteMessage = async (message_id: string) =>
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      message_id
    )

  const editMessage = async (message: Message) => {
    setMessageBody(message.body)
    setId(message.$id)
    setIsEdit(true)
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
        <div>
          {messages.map((message) => (
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
                  message.$permissions.includes(
                    `delete("user:${user.$id}")`
                  ) && (
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
          ))}
        </div>
      </div>
    </main>
  )
}

export default Room
