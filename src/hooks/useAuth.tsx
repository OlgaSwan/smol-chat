import { useStore } from '@nanostores/react'
import { userStore } from '../stores/user-store'

export const useAuth = () => {
  const user = useStore(userStore.user)
  return {
    user,
    getUserOnLoad: userStore.getUserOnLoad,
    handleUserLogin: userStore.handleUserLogin,
    handleUserLogOut: userStore.handleUserLogOut,
    handleUserRegister: userStore.handleUserRegister,
  }
}
