import React, { useState } from 'react'
import { storage, BUCKET_ID } from '../appwrite-config'

import { Avatar, Dialog } from '@mui/material'
import { Logout } from '@mui/icons-material'

import Profile from './profile'
import { useAuth } from '../utils/auth-context'

const Header = () => {
  const { user, handleUserLogOut } = useAuth()
  const [open, setOpen] = useState(false)
  const avatar = storage.getFilePreview(BUCKET_ID, user?.$id ?? '')

  return (
    <div id="header--wrapper">
      {user && (
        <>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <Profile />
          </Dialog>
          <div className="header--link--wrapper" onClick={() => setOpen(true)}>
            <div className="header--link">Welcome, {user.name}</div>
            <Avatar
              alt={user.name}
              src={avatar.href}
              sx={{ width: 24, height: 24 }}
            >
              {user.name.slice(0, 1)}
            </Avatar>
          </div>
          <Logout onClick={handleUserLogOut} className="header--link" />
        </>
      )}
    </div>
  )
}

export default Header
