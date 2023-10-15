import { Client, Databases, Permission, ID, Role } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
 const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    
    const {message, friendId, chatType, editedMessageId} = JSON.parse(req.body)
    log(req.body)
    log(message)

    const selectedChatId = message.chat_id
  
    if (editedMessageId) {
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID_MESSAGES,
        editedMessageId,
        message
      )
      return
    }

    const permissions = [Permission.write(Role.user(message.user_id))]

    switch (chatType) {
      case 'Private': {
        permissions.push(Permission.read(Role.user(message.user_id)))
        permissions.push(Permission.read(Role.user(friendId)))
        break
      }
      case 'Global': 
        permissions.push(Permission.read(Role.users()))
        break
    }

      const newMessage = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID_MESSAGES,
        ID.unique(),
        message,
        permissions
      )

      if (chatType === 'Private' && friendId) {
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID_CHATS,
          selectedChatId,
          { last_updated_time: Date.now() }
          )

          await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID_MESSAGES_UNREAD,
            ID.unique(),
            { message_id: newMessage.$id, user_id: friendId, chat_id: selectedChatId },
            [Permission.read(Role.user(friendId)), Permission.delete(Role.user(friendId))]
          )
      }

      return res.send('Success')
};