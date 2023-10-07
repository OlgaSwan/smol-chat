import { FunctionComponent, useState, useEffect } from 'react'

import { getGlobalChat } from '../../utils/getGlobalChat'
import { Chat } from '../../types/chat'

import { Public } from '@mui/icons-material'

interface ChatGlobalProps {
  onClick: (chat: Chat) => void
}

const ChatGlobal: FunctionComponent<ChatGlobalProps> = ({ onClick }) => {
  const [chatGlobal, setChatGlobal] = useState<Chat | null>(null)

  const loadGlobalChat = async () => {
    const globalChat = await getGlobalChat()
    setChatGlobal(globalChat)
  }

  useEffect(() => {
    loadGlobalChat()
  }, [])

  return (
    <>
      {chatGlobal && (
        <div className='chat--container' onClick={() => onClick(chatGlobal)}>
          <p className='chat--name'>{chatGlobal.name}</p>
          <div className='chat--type'>
            <p>{chatGlobal.type.toLowerCase()}</p>
            <Public sx={{ width: '20px'}}/>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatGlobal
