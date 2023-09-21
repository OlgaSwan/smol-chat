import React, { useState } from 'react'
import { LogOut } from 'react-feather'
import { Avatar } from '@mui/material'

import Modal from '../model/modal/modal'
import Profile from '../model/modal/profile'
import { useAuth } from '../utils/auth-context'
import { storage, BUCKET_ID } from '../appwrite-config'

const Header = () => {
  const { user, handleUserLogOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const avatar = storage.getFilePreview(BUCKET_ID, user?.$id ?? '')

  return (
    <div id="header--wrapper">
      {user && (
        <>
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <Profile />
          </Modal>
          <div className="header--link--wrapper">
            <div className="header--link" onClick={() => setIsOpen(true)}>
              Welcome, {user.name}
            </div>
            <Avatar
              alt={user.name}
              src={avatar.href}
              sx={{ width: 24, height: 24 }}
            >
              {user.name.slice(0, 1)}
            </Avatar>
          </div>
          <LogOut onClick={handleUserLogOut} className="header--link" />
        </>
      )}
    </div>
  )
}

export default Header
