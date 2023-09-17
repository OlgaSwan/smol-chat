import React, { useState } from 'react'
import { LogOut } from 'react-feather'
import Modal from '../model/modal/modal'
import Profile from '../model/modal/profile'
import { useAuth } from '../utils/auth-context'

const Header = () => {
  const { user, handleUserLogOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div id="header--wrapper">
      {user && (
        <>
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <Profile />
          </Modal>
          <div className="header--link" onClick={() => setIsOpen(true)}>
            Welcome, {user.name}
          </div>
          <LogOut onClick={handleUserLogOut} className="header--link" />
        </>
      )}
    </div>
  )
}

export default Header
