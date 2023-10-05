import { FunctionComponent, useEffect, useState } from 'react'
import { Chat } from '../types/chat'
import { getGlobalChat } from '../utils/getGlobalChat'
import Room from './room'

const GlobalChatPage: FunctionComponent = () => {
  const [globalChat, setGlobalChat] = useState<Chat | null>(null)

  const loadGlobalChat = async () => {
    const globalChat = await getGlobalChat()
    setGlobalChat(globalChat)
  }

  useEffect(() => {
    loadGlobalChat()
  }, [])
  return globalChat && <Room chat={globalChat} />
}

export default GlobalChatPage
