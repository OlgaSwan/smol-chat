import { Client, Databases, Permission, ID, Role } from 'node-appwrite';

const createPrivateChatId = (firstUser, secondUser) => {
  return firstUser.$id > secondUser.$id
    ? `${firstUser.$id}_${secondUser.$id}`
    : `${secondUser.$id}_${firstUser.$id}`
}

export default async ({ req, res, log, error }) => {
 const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    
    const {user_id, friendId} = req.body

    const chat_id = createPrivateChatId(user_id, friendId)
    const permissions = [
      Permission.write(Role.user(user_id)),
      Permission.read(Role.user(user_id))
    ]

    if (user_id !== friendId) {
      permissions.push(Permission.write(Role.user(friendId)))
      permissions.push(Permission.read(Role.user(friendId)))
    }
    
          const newChat = await databases.createDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID_CHATS,
            ID.unique(),
            {
              type: 'Private',
              last_updated_time: Date.now(),
              chat_id: chat_id,
            },
            permissions
          )

          await databases.createDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
            ID.unique(),
            { chat_id: chat_id, user_id: user_id },
            permissions
          )

          if (user_id !== friendId) {
            await databases.createDocument(
              import.meta.env.VITE_DATABASE_ID,
              import.meta.env.VITE_COLLECTION_ID_CHATS_MEMBERS,
              ID.unique(),
              { chat_id: chat_id, user_id: friendId },
              permissions
            )
          }
    
          res.json(newChat)
};