import React, { FunctionComponent, useState, useEffect, Dispatch } from 'react'

import { Permission, Role, ID } from 'appwrite'
import { databases } from '../../appwrite-config'

import { useAuth } from '../../hooks/useAuth'
import { useFriendId } from '../../hooks/useFriendId'

import {
  MessageExternal,
  MessageInternal,
  MessageUnread,
} from '../../types/message'
import { Chat } from '../../types/chat'

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

    // if (chat.type === ChatType.Global)
    //   permissions.push(Permission.read(Role.users()))
    // if (chat.type === ChatType.Private && friendId) {
    //   permissions.push(Permission.read(Role.user(user.$id)))
    //   permissions.push(Permission.read(Role.user(friendId)))
    // }

    if (message) {
      await databases.updateDocument<MessageExternal>(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES,
        message.$id,
        messageSent
      )
    } else {
      const response = await databases.createDocument<MessageExternal>(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES,
        ID.unique(),
        messageSent,
        permissions
      )
      await databases.updateDocument<Chat>(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_CHATS,
        chat.$id,
        { last_updated_time: Date.now() }
      )
      await databases.createDocument<MessageUnread>(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES_UNREAD,
        ID.unique(),
        { message_id: response.$id, user_id: friendId, chat_id: chat.chat_id }
      )
    }
    resetForm()
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
          id='textarea-form-message'
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
