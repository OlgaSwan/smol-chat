import { Client, Databases, Account  } from 'appwrite';

export const PROJECT_ID = '64fc8b7141e5be9e0948'
export const DATABASE_ID = '64fc8d222544458f00cd'
export const COLLECTION_ID_MESSAGES = '64fc8d34b6aefc3386c8'

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64fc8b7141e5be9e0948');

export const databases = new Databases(client);
export const account = new Account(client);

export default client