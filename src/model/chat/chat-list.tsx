import { FunctionComponent } from 'react'

import { useStore } from '@nanostores/react'

import { chatsStore } from '../../stores/chat-store'
import { selectedChatStore } from '../../stores/selected-chat-store'

import ChatGlobal from './chat-global'
import ChatComponent from './chat-component'

import { Chat, ChatType } from '../../types/chat'

import { Divider } from '@mui/material'

interface ChatListProps {
  onClick: (chat: Chat) => void
}

const ChatList: FunctionComponent<ChatListProps> = ({ onClick }) => {
  const chats = useStore(chatsStore.chats)
  const selectedChat = useStore(selectedChatStore.selectedChat)

  return (
    <>
      <ChatGlobal
        onClick={onClick}
        isSelected={selectedChat?.type === ChatType.Global}
      />
      <Divider sx={{ bgcolor: 'rgba(40, 41, 57, 1)', height: '1.5px' }} />
      {chats.map((chat) => (
        <ChatComponent
          key={chat.$id}
          chat={chat}
          onClick={onClick}
          isSelected={selectedChat?.chat_id === chat.chat_id}
        />
      ))}
    </>
  )
}

export default ChatList
