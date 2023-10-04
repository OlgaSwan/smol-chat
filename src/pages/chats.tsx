import { FunctionComponent, useEffect, useState } from 'react'

import { Query } from 'appwrite'
import { COLLECTION_ID_CHATS, DATABASE_ID, databases } from '../appwrite-config'

import UserSearch from '../components/userSearch'
import { createPrivateChatId } from '../utils/getPrivateChatId'
import { useAuth } from '../context/auth-context'
import ChatGlobal from '../model/chat/chat-global'

import { User } from '../types/auth-context'
import { Chat, ChatType, ChatsMembers } from '../types/chat'


const Chats: FunctionComponent = () => {
  const { user } = useAuth()
  const [searchedUser, setSearchedUser] = useState<User | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  

  const getChats = async () => {
    const chats = await databases.listDocuments<Chat>(
      DATABASE_ID,
      COLLECTION_ID_CHATS,
      [Query.notEqual('type', 'Global')]
    )
    setChats(chats.documents)
  }

  useEffect(() => {

    getChats()
  }, [])

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
        <ChatGlobal onClick={() => setSelectedChat(chat)}/>
        {chats.map((chat) => (
          <div key={chat.$id} onClick={() => setSelectedChat(chat)}>
            {chat.name}
          </div>
        ))}
      </div>
      <div
        style={{
          background: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedChat ? 'Room component' : 'Please select a chat'}
      </div>
    </div>
  )
}

export default Chats
