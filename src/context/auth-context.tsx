import {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { Permission, Role, ID } from 'appwrite'
import {
  COLLECTION_ID_USERS,
  DATABASE_ID,
  account,
  databases,
} from '../appwrite-config'

import { getUser } from '../utils/getUser'
import { AuthContextType, User, noPreferences } from '../types/auth-context'
import { Credentials } from '../pages/login-page'
import { CredentialsRegister } from '../pages/register-page'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getUserOnLoad()
  }, [])

  const getUserOnLoad = async () => {
    try {
      const authAccount = await account.get<noPreferences>()
      const user = await getUser(authAccount.$id)
      setUser(user)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const handleUserLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    credentials: Credentials
  ) => {
    e.preventDefault()

    try {
      const session = await account.createEmailSession(
        credentials.email,
        credentials.password
      )
      const user = await getUser(session.userId)
      setUser(user)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const handleUserLogOut = async () => {
    await account.deleteSession('current')
    setUser(null)
  }

  const handleUserRegister = async (
    e: React.FormEvent<HTMLFormElement>,
    credentials: CredentialsRegister
  ) => {
    e.preventDefault()

    if (credentials.password !== credentials.password1) {
      alert('Passwords do not match')
      return
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
      const user = await databases.createDocument<User>(
        DATABASE_ID,
        COLLECTION_ID_USERS,
        authAccount.$id,
        { name: credentials.name },
        permissions
      )

      setUser(user)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogOut,
    handleUserRegister,
  }

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
