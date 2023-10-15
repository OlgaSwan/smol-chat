import { Models } from 'appwrite'
import { functions } from '../../appwrite-config'
import { MessageExternal } from '../../types/message'
import { ChatType } from '../../types/chat'

export const createMessage = async (
  message: Omit<MessageExternal, keyof Models.Document>,
  friendId: string,
  chatType: ChatType,
  editedMessageId?: string
) => {
  const body = {
    message,
    friendId,
    chatType,
    editedMessageId,
  }

  await functions.createExecution(
    import.meta.env.VITE_FUNCTION_ID_CREATE_MESSAGE,
    JSON.stringify(body),
    true
  )
}
