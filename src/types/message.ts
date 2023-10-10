import { Models } from 'appwrite'
import { User } from './user'

export type MessageExternal = {
  body: string
  user_id: string
  chat_id: string
} & Models.Document

export type MessageInternal = {
  user: User
} & MessageExternal
