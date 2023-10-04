import { FunctionComponent, useEffect, useState } from 'react'

import UserSearch from '../components/userSearch'
import { createPrivateChatId } from '../utils/getPrivateChatId'
import { useAuth } from '../context/auth-context'

import { User } from '../types/auth-context'
import { Chat, ChatType, ChatsMembers } from '../types/chat'
import ChatList from '../model/chat/chat-list'

const Chats: FunctionComponent = () => {
  const { user } = useAuth()
  const [searchedUser, setSearchedUser] = useState<User | null>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  useEffect(() => {
    if (!searchedUser || !user) return

    const chat_id = createPrivateChatId(user, searchedUser)

    //TODO: Do something if user was selected
  }, [searchedUser, user])

  return (
    <div className='chats--container' style={{ display: 'flex' }}>
      <div style={{ background: 'green' }}>
        Chats{' '}
        <UserSearch
          onUserChanged={(user) => {
            if (user) setSearchedUser(user)
          }}
        />
        <ChatList onClick={(chat) => setSelectedChat(chat)} />
      </div>
      <div
        style={{
          background: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedChat ? selectedChat.name : 'Please select a chat'}
      </div>
    </div>
  )
}

export default Chats
