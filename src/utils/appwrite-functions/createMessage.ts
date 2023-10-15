import { Models } from 'appwrite'
import { functions } from '../../appwrite-config'
import { MessageExternal } from '../../types/message'
import { Chat} from '../../types/chat'

export const createMessage = async (
  message: Omit<MessageExternal, keyof Models.Document>,
  chat: Chat,
  friendId: string | null,
  editedMessageId?: string
) => {
  const body = {
    message,
    friendId,
    chat,
    editedMessageId,
  }

  await functions.createExecution(
    import.meta.env.VITE_FUNCTION_ID_CREATE_MESSAGE,
    JSON.stringify(body),
    true
  )
}
