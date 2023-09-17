import React, { useState } from 'react'

import Header from '../components/header'

import { MessageType } from '../model/message/message'

import EditedMessage from '../model/message/edited-message'

import MessageForm from '../model/message/message-form'

import MemoizedMessageList from '../model/message/message-list'

const Room = () => {
  const [message, setMessage] = useState<MessageType | null>(null)

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        {message && <EditedMessage messageBody={message.body} />}
        <MessageForm message={message} setMessage={setMessage} />
        <MemoizedMessageList setMessage={setMessage} />
      </div>
    </main>
  )
}

export default Room
