import { FunctionComponent, useEffect, useState } from 'react'
import UserSearch from '../components/userSearch'
import { User } from '../types/auth-context'
import { createPrivateChatId } from '../utils/getPrivateChatId'
import { useAuth } from '../context/auth-context'

const Chats: FunctionComponent = () => {
  const { user } = useAuth()
  const [searchedUser, setSearchedUser] = useState<User | null>(null)

  //TODO: Add chat type
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState()

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
      </div>
      <div
        style={{
          background: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedChat ? 'Room component' : 'Please selected a chat'}
      </div>
    </div>
  )
}

export default Chats
