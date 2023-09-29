import { DATABASE_ID, COLLECTION_ID_USERS, databases } from '../appwrite-config'
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
  const user = await databases.getDocument(
    DATABASE_ID,
    COLLECTION_ID_USERS,
    obj.user_id
  )
  return {
    body: obj.body,
    user_id: obj.user_id,
    user,
  } as MessageInternal
}
