import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { ID, Permission, Role } from 'appwrite'
import { databases } from '../appwrite-config'

import { useStore } from '@nanostores/react'

import { selectedChatStore } from '../model/store'
import { metadata } from '../components/head-meta/metadata'

import UserSearch from '../components/userSearch'
import { Head } from '../components/head-meta/head'
import { createPrivateChatId } from '../utils/getPrivateChatId'
import { getChat } from '../utils/getChat'
import { useAuth } from '../hooks/useAuth'

import ChatList from '../model/chat/chat-list'
import Room from './room'

import { User } from '../types/user'
import { Chat, ChatType, ChatsMembers } from '../types/chat'

const Chats: FunctionComponent = () => {
  const { user } = useAuth()
  const selectedChat = useStore(selectedChatStore.selectedChat)
  const [searchedUser, setSearchedUser] = useState<User | null>(null)

  const checkOrAdd = useCallback(
    async (chat_id: string) => {
      const chat = await getChat(chat_id)
      if (chat) {
        selectedChatStore.setSelectedChat(chat)
      } else {
        if (user && searchedUser) {
          const permissions = [Permission.write(Role.user(user.$id))]
          // permissions.push(Permission.write(Role.user(searchedUser.$id)))

          const newChat = await databases.createDocument<Chat>(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID_CHATS,
            ID.unique(),
            {
              type: ChatType.Private,
              last_updated_time: Date.now(),
              chat_id: chat_id,
            },
            permissions
          )

          const member1 = await databases.createDocument<ChatsMembers>(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
            ID.unique(),
            { chat_id: chat_id, user_id: user.$id },
            permissions
          )

          if (user.$id !== searchedUser.$id) {
            const member2 = await databases.createDocument<ChatsMembers>(
              import.meta.env.VITE_DATABASE_ID,
              import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
              ID.unique(),
              { chat_id: chat_id, user_id: searchedUser.$id },
              permissions
            )
          }

          selectedChatStore.setSelectedChat(newChat)
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
    <div className='chats--container'>
      <Head title={metadata.chats} />
      <div className='chats-search--container'>
        <UserSearch
          onUserChanged={(user) => {
            if (user) setSearchedUser(user)
          }}
        />
        <ChatList onClick={(chat) => selectedChatStore.setSelectedChat(chat)} />
      </div>
      {selectedChat ? (
        <div className='room--container'>
          <Room chat={selectedChat} />
        </div>
      ) : (
        <div className='room--nochat-container'>
          <p className='room--nochat'>
            Please, select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  )
}

export default Chats
