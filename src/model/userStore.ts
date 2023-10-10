import { atom } from 'nanostores'

import { ID, Permission, Role } from 'appwrite'
import {
  COLLECTION_ID_USERS,
  DATABASE_ID,
  account,
  databases,
} from '../appwrite-config'

import { getUser } from '../utils/getUser'

import { Credentials, CredentialsRegister } from '../types/user'
import { User } from '../types/user'

export const loadingStore = atom(true)

const user = atom<User | null>(null)

export const userStore = {
  user,
  getUserOnLoad: async () => {
    const authAccount = await account.get()
    const userResponse = await getUser(authAccount.$id)
    user.set(userResponse)
    loadingStore.set(false)
  },
  handleUserLogin: async (
    e: React.FormEvent<HTMLFormElement>,
    credentials: Credentials
  ): Promise<boolean> => {
    e.preventDefault()

    try {
      const session = await account.createEmailSession(
        credentials.email,
        credentials.password
      )
      const userResponse = await getUser(session.userId)
      user.set(userResponse)
      return true
    } catch (error) {
      console.warn(error)
      return false
    }
  },
  handleUserLogOut: async () => {
    await account.deleteSession('current')
    user.set(null)
  },
  handleUserRegister: async (
    e: React.FormEvent<HTMLFormElement>,
    credentials: CredentialsRegister
  ): Promise<boolean> => {
    e.preventDefault()

    if (credentials.password !== credentials.password1) {
      alert('Passwords do not match')
      return false
    }

    try {
      const authAccount = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password,
        credentials.name
      )

      await account.createEmailSession(credentials.email, credentials.password)

      const permissions = [Permission.write(Role.user(authAccount.$id))]
      const userResponse = await databases.createDocument<User>(
        DATABASE_ID,
        COLLECTION_ID_USERS,
        authAccount.$id,
        { name: credentials.name },
        permissions
      )
      user.set(userResponse)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },
}

userStore.getUserOnLoad()
