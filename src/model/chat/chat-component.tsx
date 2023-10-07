import React, { FunctionComponent } from 'react'

import { Chat } from '../../types/chat'

import { Lock } from '@mui/icons-material'

interface ChatProps {
  chat: Chat
  onClick: (chat: Chat) => void
}

const ChatComponent: FunctionComponent<ChatProps> = ({ chat, onClick }) => {
  return (
    <>
      {chat && (
        <div className='chat--container' onClick={() => onClick(chat)}>
          <p className='chat--name'>{chat.name} </p>
          <div className='chat--type'>
            <p>{chat.type.toLowerCase()}</p>
            <Lock sx={{ width: '20px' }} />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatComponent
