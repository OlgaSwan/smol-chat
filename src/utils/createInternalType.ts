import { getUser } from './getUser'
import { MessageExternal, MessageInternal } from '../types/message'

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
  const key = 'user' + obj.$id
  const user = await cacheGetOrAdd(key, () => getUser(obj.user_id))
  return {
    ...obj,
    body: obj.body,
    user_id: obj.user_id,
    user,
  } as MessageInternal
}

const cacheGetOrAdd = async <T>(
  key: string,
  addCallback: () => Promise<T>
): Promise<T> => {
  const user = localStorage.getItem(key)
  if (user) {
    return JSON.parse(user) as T
  } else {
    const user = await addCallback()
    localStorage.setItem(key, JSON.stringify(user))
    return user as T
  }
}
