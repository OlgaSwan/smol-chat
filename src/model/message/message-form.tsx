import React, { FunctionComponent, useState, useEffect } from 'react'

import { useStore } from '@nanostores/react'

import { selectedChatStore } from '../store'
import { editedMessageStore } from '../editedMessage'

import { useAuth } from '../../hooks/useAuth'
import { useFriendId } from '../../hooks/useFriendId'
import { createMessage } from '../../utils/appwrite-functions/createMessage'

const MessageForm: FunctionComponent = () => {
  const { user } = useAuth()

  const selectedChat = useStore(selectedChatStore.selectedChat)
  const editedMessage = useStore(editedMessageStore.editedMessage)
  const friendId = useFriendId(selectedChat)
  const [messageBody, setMessageBody] = useState('')

  const MaxSymbolsMessage = 500

  useEffect(() => {
    if (editedMessage) setMessageBody(editedMessage.body)
    else setMessageBody('')
  }, [editedMessage])

  const resetForm = () => {
    editedMessageStore.setEditedMessage(null)
    setMessageBody('')
  }

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault()

    if (!user || !selectedChat) return

    const messageSent = {
      body: messageBody.trimStart().trimEnd(),
      user_id: user.$id,
      chat_id: selectedChat.chat_id,
    }

    await createMessage(messageSent, selectedChat, friendId, editedMessage?.$id)

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
          {editedMessage && (
            <button className='btn btn--cancel' type='reset'>
              Cancel
            </button>
          )}

          <input
            className='btn btn--secondary'
            type='submit'
            value={editedMessage ? 'Edit' : 'Send'}
            disabled={!messageBody.trim().length}
            accessKey='s'
          />
        </div>
      </div>
    </form>
  )
}

export default MessageForm
