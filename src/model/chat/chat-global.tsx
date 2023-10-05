import { FunctionComponent, useState, useEffect } from 'react'
import { Chat } from '../../types/chat'
import { getGlobalChat } from '../../utils/getGlobalChat'

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
        <div onClick={() => onClick(chatGlobal)}>{chatGlobal.name}</div>
      )}
    </>
  )
}

export default ChatGlobal
