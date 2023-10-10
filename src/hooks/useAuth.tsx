import { useStore } from '@nanostores/react'
import { userStore } from '../model/userStore'

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
