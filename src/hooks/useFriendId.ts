import { useCallback, useEffect, useState } from 'react'
import { Chat, ChatType, ChatsMembers } from '../types/chat'
import { databases } from '../appwrite-config'
import { useAuth } from './useAuth'
import { Query } from 'appwrite'

export const useFriendId = (chat: Chat | null): string | null => {
  const { user } = useAuth()
  const [friendId, setFriendId] = useState<string | null>(null)

  const getFriend = useCallback(async () => {
    if (!chat) return
    if (chat.type === ChatType.Private && user) {
      const response = await databases.listDocuments<ChatsMembers>(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
        [
          Query.equal('chat_id', chat.chat_id),
          Query.notEqual('user_id', user.$id),
        ]
      )
      if (response.documents.length > 0)
        setFriendId(response.documents[0].user_id)
    }
  }, [user, chat])

  useEffect(() => {
    getFriend()
  }, [getFriend])

  return friendId
}
