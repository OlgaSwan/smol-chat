import { User } from '../types/user'

export const createPrivateChatId = (firstUser: User, secondUser: User) => {
  return firstUser.$id > secondUser.$id
    ? `${firstUser.$id}_${secondUser.$id}`
    : `${secondUser.$id}_${firstUser.$id}`
}
