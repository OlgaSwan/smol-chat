import { Client, Databases, Account, Storage } from 'appwrite'

const client = new Client()

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_PROJECT_ID)

export const databases = new Databases(client)
export const account = new Account(client)
export const storage = new Storage(client)

export default client
