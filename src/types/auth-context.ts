import { Credentials } from '../pages/login-page'
import { CredentialsRegister } from '../pages/register-page'
import { Models } from 'appwrite'

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

export type User = Models.User<noPreferences>

export type noPreferences = Record<string, never>
