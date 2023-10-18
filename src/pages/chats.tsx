import { FunctionComponent, useCallback, useEffect, useState } from 'react'

import { useStore } from '@nanostores/react'

import { selectedChatStore } from '../stores/selected-chat-store'
import { metadata } from '../components/head-meta/metadata'

import UserSearch from '../components/user-search'
import { Head } from '../components/head-meta/head'
import { createPrivateChatId } from '../utils/createPrivateChatId'
import { getChat } from '../utils/getChat'
import { createChat } from '../utils/appwrite-functions/createChat'
import { useAuth } from '../hooks/useAuth'

import ChatList from '../model/chat/chat-list'
import Room from './room'

import { User } from '../types/user'

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
          const newChat = await createChat(user.$id, searchedUser.$id)
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
        <UserSearch onUserChanged={(user) => setSearchedUser(user)} />
        <ChatList onClick={(chat) => selectedChatStore.setSelectedChat(chat)} />
      </div>
      {selectedChat ? (
        <div className='room--container'>
          <Room />
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
