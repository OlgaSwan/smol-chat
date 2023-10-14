import { atom } from 'nanostores'

import { ID, Permission, Role } from 'appwrite'
import { account, databases } from '../appwrite-config'

import { getUser } from '../utils/getUser'

import { Credentials, CredentialsRegister } from '../types/user'
import { User } from '../types/user'

export const loadingStore = atom(true)

const user = atom<User | null>(null)

export const userStore = {
  user,
  getUserOnLoad: async () => {
    try {
      const authAccount = await account.get()
      const userResponse = await getUser(authAccount.$id)
      user.set(userResponse)
    } catch {
      //ignored
    }
    loadingStore.set(false)
  },
  handleUserLogin: async (
    e: React.FormEvent<HTMLFormElement>,
    credentials: Credentials
  ): Promise<void> => {
    e.preventDefault()

    const session = await account.createEmailSession(
      credentials.email,
      credentials.password
    )
    const userResponse = await getUser(session.userId)
    user.set(userResponse)
  },
  handleUserLogOut: async () => {
    await account.deleteSession('current')
    user.set(null)
  },
  handleUserRegister: async (
    e: React.FormEvent<HTMLFormElement>,
    credentials: CredentialsRegister
  ): Promise<void> => {
    e.preventDefault()
    const authAccount = await account.create(
      ID.unique(),
      credentials.email,
      credentials.password,
      credentials.name
    )

    await account.createEmailSession(credentials.email, credentials.password)

    const permissions = [Permission.write(Role.user(authAccount.$id))]
    const userResponse = await databases.createDocument<User>(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_USERS,
      authAccount.$id,
      { name: credentials.name },
      permissions
    )
    user.set(userResponse)
  },
}

userStore.getUserOnLoad()
