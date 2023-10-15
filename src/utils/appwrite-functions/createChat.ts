import { functions } from '../../appwrite-config'
import { Chat } from '../../types/chat'

export const createChat = async (user_id: string, friendId: string) => {
  const body = {
    user_id,
    friendId,
  }

  const result = await functions.createExecution(
    import.meta.env.VITE_FUNCTION_ID_CREATE_CHAT,
    JSON.stringify(body)
  )

  return JSON.parse(result.responseBody) as Chat
}
