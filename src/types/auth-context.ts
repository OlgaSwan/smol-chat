import { Models } from 'appwrite'

import { Credentials } from '../pages/login-page'
import { CredentialsRegister } from '../pages/register-page'

export type AuthContextType = {
  user: User | null
  handleUserLogin: (
    e: React.FormEvent<HTMLFormElement>,
    credentials: Credentials
  ) => Promise<void>
  handleUserLogOut: () => Promise<void>
  handleUserRegister: (
    e: React.FormEvent<HTMLFormElement>,
    credentials: CredentialsRegister
  ) => Promise<void>
}

export type User = {
  name: string
  bio?: string
  photo_id?: string
} & Models.Document

export type noPreferences = Record<string, never>
