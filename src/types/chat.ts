import { Models } from 'appwrite'

export enum ChatType {
  Global = 'Global',
  Private = 'Private',
}

export type Chat = {
  chat_id: string
  type: ChatType
  name?: string
  last_updated_time?: number
} & Models.Document

export type ChatsMembers = {
  chat_id: string
  user_id: string
} & Models.Document
