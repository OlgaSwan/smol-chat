import { MessageExternal, MessageInternal } from '../types/message'
import { getUser } from './getUser'

export const createInternalType = async (
  arr: MessageExternal[]
): Promise<MessageInternal[]> => {
  return await Promise.all(arr.map(createSingleInternalType))
}

export const createSingleInternalType = async (
  obj: MessageExternal
): Promise<MessageInternal> => {
  const user = await getUser(obj.user_id)
  return {
    ...obj,
    user,
  } as MessageInternal
}
