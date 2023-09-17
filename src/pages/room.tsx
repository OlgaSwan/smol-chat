import React, { useState, useEffect } from 'react'

import Header from '../components/header'

import MessageForm from '../model/message/message-form'

import MemoizedMessageList from '../model/message/message-list'

const Room = () => {
  const [id, setId] = useState('')

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <MessageForm id={id} setId={setId} />
        <MemoizedMessageList setId={setId} />
      </div>
    </main>
  )
}

export default Room
