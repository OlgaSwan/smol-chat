import {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { ID } from 'appwrite'
import { account } from '../appwrite-config'

import { AuthContextType, User, noPreferences } from '../types/auth-context'
import { Credentials } from '../pages/login-page'
import { CredentialsRegister } from '../pages/register-page'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface AuthContextProps extends PropsWithChildren {}

export const AuthProvider: FunctionComponent<AuthContextProps> = ({
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
      const accountDetails = await account.get<noPreferences>()
      setUser(accountDetails)
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
      await account.createEmailSession(
        credentials.email,
        credentials.password
      )
      const accountDetails = await account.get<noPreferences>()
      setUser(accountDetails)
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
      const response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password,
        credentials.name
      )
      await account.createEmailSession(credentials.email, credentials.password)
      const accountDetails = await account.get<noPreferences>()
      setUser(accountDetails)
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
