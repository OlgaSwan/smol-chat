import { Client, Databases, Account, Storage } from 'appwrite'

export const PROJECT_ID = '64fc8b7141e5be9e0948'
export const DATABASE_ID = '64fc8d222544458f00cd'
export const COLLECTION_ID_USERS = '651833d92d367aa1ab81'
export const COLLECTION_ID_MESSAGES = '651844b10aa8d87b151f'
export const BUCKET_ID = '6507557c3b1db95f6df7'

const client = new Client()

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('64fc8b7141e5be9e0948')

export const databases = new Databases(client)
export const account = new Account(client)
export const storage = new Storage(client)

export default client
