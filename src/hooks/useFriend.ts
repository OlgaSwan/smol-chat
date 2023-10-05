import { useCallback, useEffect, useState } from 'react'
import { Chat, ChatType, ChatsMembers } from '../types/chat'
import {
  COLLECTION_ID_CHATS_MEMBERS,
  DATABASE_ID,
  databases,
} from '../appwrite-config'
import { useAuth } from '../context/auth-context'
import { Query } from 'appwrite'

export const useFriendId = (chat: Chat): string | null => {
  const { user } = useAuth()
  const [friendId, setFriendId] = useState<string | null>(null)

  const getFriend = useCallback(async () => {
    if (chat.type === ChatType.Private && user) {
      const response = await databases.listDocuments<ChatsMembers>(
        DATABASE_ID,
        COLLECTION_ID_CHATS_MEMBERS,
        [
          Query.equal('chat_id', chat.chat_id),
          Query.notEqual('user_id', user.$id),
        ]
      )
      if (response.documents.length > 0)
        setFriendId(response.documents[0].user_id)
    }
  }, [user, chat.chat_id, chat.type])

  useEffect(() => {
    getFriend()
  }, [getFriend])

  return friendId
}
