import React from 'react'
import { LogOut } from 'react-feather'
import { useAuth } from '../utils/auth-context'

const Header = () => {
  const { user, handleUserLogOut } = useAuth()
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          Welcome, {user.name}
          <LogOut onClick={handleUserLogOut} className="header--link" />
        </>
      ) : (
        <button>Login</button>
      )}
    </div>
  )
}

export default Header
