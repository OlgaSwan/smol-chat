import React, { FunctionComponent, useState, useEffect, Dispatch } from 'react'

import { useAuth } from '../../hooks/useAuth'
import { useFriendId } from '../../hooks/useFriendId'
import { createMessage } from '../../utils/appwrite-functions/createMessage'

import { MessageInternal } from '../../types/message'
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

    await createMessage(messageSent, chat.type, friendId, message?.$id)

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
