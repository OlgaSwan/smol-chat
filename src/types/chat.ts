import { Models } from 'appwrite'

export enum ChatType {
  Global = 'Global',
  Private = 'Private',
}

export type Chat = {
  chat_id: string
  name?: string
  type: ChatType
  last_updated_time?: string
} & Models.Document

export type ChatsMembers = {
  chat_id: string
  user_id: string
} & Models.Document
