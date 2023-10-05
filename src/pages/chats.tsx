import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { ID, Permission, Query, Role } from 'appwrite'
import {
  COLLECTION_ID_CHATS,
  COLLECTION_ID_CHATS_MEMBERS,
  DATABASE_ID,
  databases,
} from '../appwrite-config'

import UserSearch from '../components/userSearch'
import { createPrivateChatId } from '../utils/getPrivateChatId'
import { useAuth } from '../context/auth-context'

import ChatList from '../model/chat/chat-list'
import Room from './room'

import { User } from '../types/auth-context'
import { Chat, ChatType, ChatsMembers } from '../types/chat'

const Chats: FunctionComponent = () => {
  const { user } = useAuth()
  const [searchedUser, setSearchedUser] = useState<User | null>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  const getChat = async (chat_id: string): Promise<Chat | null> => {
    const response = await databases.listDocuments<Chat>(
      DATABASE_ID,
      COLLECTION_ID_CHATS,
      [Query.equal('chat_id', chat_id)]
    )
    if (response.documents.length > 0) return response.documents[0]
    return null
  }

  const checkOrAdd = useCallback(
    async (chat_id: string) => {
      const chat = await getChat(chat_id)
      if (chat) {
        setSelectedChat(chat)
      } else {
        if (user && searchedUser) {
          const permissions = [Permission.write(Role.user(user.$id))]
          permissions.push(Permission.write(Role.user(searchedUser.$id)))

          const newChat = await databases.createDocument<Chat>(
            DATABASE_ID,
            COLLECTION_ID_CHATS,
            ID.unique(),
            {
              type: ChatType.Private,
              last_updated_time: Date.now(),
              chat_id: chat_id,
            },
            permissions
          )

          const member1 = await databases.createDocument<ChatsMembers>(
            DATABASE_ID,
            COLLECTION_ID_CHATS_MEMBERS,
            ID.unique(),
            { chat_id: chat_id, user_id: user.$id },
            permissions
          )

          const member2 = await databases.createDocument<ChatsMembers>(
            DATABASE_ID,
            COLLECTION_ID_CHATS_MEMBERS,
            ID.unique(),
            { chat_id: chat_id, user_id: searchedUser.$id },
            permissions
          )

          setSelectedChat(newChat)
        }
      }
    },
    [user, searchedUser]
  )

  useEffect(() => {
    if (!searchedUser || !user) return
    const chat_id = createPrivateChatId(user, searchedUser)
    checkOrAdd(chat_id)
  }, [searchedUser, user, checkOrAdd])

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
        {!selectedChat && 'Please select a chat'}
      </div>
      {selectedChat && <Room chat={selectedChat} />}
    </div>
  )
}

export default Chats
