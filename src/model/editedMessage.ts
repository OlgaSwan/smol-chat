import { atom } from 'nanostores'
import { MessageInternal } from '../types/message'

const editedMessage = atom<MessageInternal | null>(null)

export const editedMessageStore = {
  editedMessage,
  setEditedMessage: (message: MessageInternal | null) =>
    editedMessage.set(message),
}
