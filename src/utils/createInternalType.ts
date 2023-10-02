import { MessageExternal, MessageInternal } from '../types/message'
import { getUser } from './getUser'
import { cacheGetOrAdd } from './cacheGetOrAdd'

export const createInternalType = async (
  arr: MessageExternal[]
): Promise<MessageInternal[]> => {
  return await Promise.all(
    arr.map(async (elem) => await createSingleInternalType(elem))
  )
}

export const createSingleInternalType = async (
  obj: MessageExternal
): Promise<MessageInternal> => {
  const key = 'user' + obj.user_id
  const user = await cacheGetOrAdd(key, () => getUser(obj.user_id))
  return {
    ...obj,
    body: obj.body,
    user_id: obj.user_id,
    user,
  } as MessageInternal
}
