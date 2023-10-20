import { FunctionComponent, useEffect, useState } from 'react'
import { Query } from 'appwrite'
import { databases } from '../../appwrite-config'

import { useStore } from '@nanostores/react'

import { messagesUnreadStore } from '../../stores/messages-unread-store'

import { getUser } from '../../utils/getUser'
import { getUserPhoto } from '../../utils/getUserPhoto'
import { useAuth } from '../../hooks/useAuth'

import { User } from '../../types/user'
import { Chat, ChatsMembers } from '../../types/chat'

import { Avatar, Box } from '@mui/material'
import { Lock } from '@mui/icons-material'

interface ChatProps {
  chat: Chat
  onClick: (chat: Chat) => void
  isSelected: boolean
}

const ChatComponent: FunctionComponent<ChatProps> = ({
  chat,
  onClick,
  isSelected,
}) => {
  const { user } = useAuth()
  const [member, setMember] = useState<User | null>(null)

  const messagesUnread = useStore(messagesUnreadStore.messagesUnread)

  const counter = messagesUnread.filter((m) => m.chat_id == chat.chat_id).length

  const shapeStyles = {
    bgcolor: 'rgb(18, 66, 199)',
    color: '#c7d8eb',
    width: 22,
    height: 22,
  }
  const shapeCircleStyles = { borderRadius: '50%' }

  const getMembers = async (chat_id: string, user_id: string) => {
    const response = await databases.listDocuments<ChatsMembers>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
      [Query.equal('chat_id', chat_id)]
    )

    switch (response.total) {
      case 1:
        setMember(await getUser(response.documents[0].user_id))
        break
      case 2: {
        const member = response.documents.find((m) => m.user_id !== user_id)
        if (member) setMember(await getUser(member.user_id))
        break
      }
    }
  }

  useEffect(() => {
    if (user) getMembers(chat.chat_id, user.$id)
  }, [chat.chat_id, user])

  return (
    <>
      {chat && member && (
        <div
          className={
            isSelected ? 'chat--container-selected ' : 'chat--container'
          }
          onClick={() => onClick(chat)}
        >
          <div className='chat-info--container'>
            <Avatar
              src={getUserPhoto(member) ?? ''}
              alt={member.name}
              sx={{
                width: 24,
                height: 24,
              }}
            >
              {member.name.slice(0, 1)}
            </Avatar>
            <p className='chat--name'>
              {member.name.slice(0, 22).trim() +
                (member.name.length > 22 ? '...' : '')}
            </p>
          </div>

          <div className='chat--type'>
            <p>{chat.type.toLowerCase()}</p>
            {counter > 0 ? (
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                sx={{ ...shapeStyles, ...shapeCircleStyles }}
              >
                {counter < 99 ? counter : '99+'}
              </Box>
            ) : (
              <Lock sx={{ width: '20px' }} />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ChatComponent
