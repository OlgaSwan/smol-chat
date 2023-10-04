import React, { FunctionComponent } from 'react'

import { Chat } from '../../types/chat'

interface ChatProps {
  chat: Chat
  onClick: (chat: Chat) => void
}

const ChatComponent: FunctionComponent<ChatProps> = ({ chat, onClick }) => {
  return <>{chat && <div onClick={() => onClick(chat)}>{chat.name}</div>}</>
}

export default ChatComponent
